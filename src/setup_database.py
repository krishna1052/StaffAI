"""
Combined script to generate descriptions, create embeddings, and populate the database.
"""

from typing import Dict, Any, List
from neo4j import GraphDatabase
from sentence_transformers import SentenceTransformer
from src.data.sample_data import EMPLOYEES, DEMANDS, ROLES, TOOLS
from src.schema import SCHEMA_QUERIES

class DatabaseSetup:
    def __init__(self, 
                 uri: str = "bolt://localhost:7687",
                 user: str = "neo4j", 
                 password: str = "password",
                 model_name: str = 'all-MiniLM-L6-v2'):
        """Initialize database and embedding model connections."""
        self.driver = GraphDatabase.driver(uri, auth=(user, password))
        self.model = SentenceTransformer(model_name)

    def close(self):
        """Close the database connection."""
        self.driver.close()

    def format_tools_description(self, tools: Dict[str, int]) -> str:
        """Format tools and their ratings into a readable string."""
        tools_list = [f"{tool} (rating: {rating})" for tool, rating in tools.items()]
        return f"Skilled in {', '.join(tools_list)}."

    def generate_profile_description(self, profile: Dict[str, Any]) -> str:
        """Generate a textual description for an employee profile."""
        roles = ", ".join(profile['can_play'])
        tools = self.format_tools_description(profile['tools'])
        
        description = f"Can play roles: {roles}. {tools}"
        description += f" {profile['grade']} level position in {profile['office']}."
        
        return description

    def generate_demand_description(self, demand: Dict[str, Any]) -> str:
        """Generate a textual description for a job demand."""
        description = demand['job_description']
        additional_info = (
            f" Position is for a {demand['grade']} {demand['role']} "
            f"in {demand['office']}, from {demand['start_date']} to {demand['end_date']}."
        )
        return f"{description}{additional_info}"

    def generate_embedding(self, text: str) -> List[float]:
        """Generate embedding for a given text."""
        return self.model.encode(text).tolist()

    def setup_schema(self):
        """Create constraints and indexes"""
        with self.driver.session() as session:
            for query in SCHEMA_QUERIES:
                session.run(query)
            print("✓ Schema setup complete")

    def clear_database(self):
        """Remove all nodes and relationships"""
        with self.driver.session() as session:
            session.run("MATCH (n) DETACH DELETE n")
            print("✓ Database cleared")

    def create_roles(self):
        """Create Role nodes"""
        with self.driver.session() as session:
            for role in ROLES:
                session.run(
                    "CREATE (r:Role {name: $name})",
                    name=role
                )
            print("✓ Roles created")

    def create_tools(self):
        """Create Tool nodes"""
        with self.driver.session() as session:
            for tool in TOOLS:
                session.run(
                    "CREATE (t:Tool {name: $name})",
                    name=tool
                )
            print("✓ Tools created")

    def create_employees_with_embeddings(self):
        """Create Person nodes with embeddings and their relationships"""
        with self.driver.session() as session:
            for emp in EMPLOYEES.values():
                # Generate description and embedding
                description = self.generate_profile_description(emp)
                embedding = self.generate_embedding(description)
                embedding_str = ','.join(map(str, embedding))
                
                # Create Person node with embedding
                session.run("""
                    CREATE (p:Person {
                        emp_id: $emp_id,
                        name: $name,
                        role: $role,
                        grade: $grade,
                        office: $office,
                        description: $description,
                        embedding: $embedding_str
                    })
                """, **emp, description=description, embedding_str=embedding_str)

                # Create relationships
                for role in emp['can_play']:
                    session.run("""
                        MATCH (p:Person {emp_id: $emp_id})
                        MATCH (r:Role {name: $role})
                        CREATE (p)-[:CAN_PLAY]->(r)
                    """, emp_id=emp['emp_id'], role=role)

                for tool, rating in emp['tools'].items():
                    session.run("""
                        MATCH (p:Person {emp_id: $emp_id})
                        MATCH (t:Tool {name: $tool})
                        CREATE (p)-[:HAS_SKILL {rating: $rating}]->(t)
                    """, emp_id=emp['emp_id'], tool=tool, rating=rating)
                
                print(f"✓ Created employee {emp['name']} with embedding")
            
            print("✓ Employees created with relationships and embeddings")

    def create_demands_with_embeddings(self, demand=None):
        """Create Demand nodes with embeddings and their relationships"""
        with self.driver.session() as session:
            if demand and isinstance(demand, dict):
                # Get the last demand ID and increment
                last_id_result = session.run("""
                    MATCH (d:Demand) 
                    RETURN COALESCE(MAX(toInteger(d.id)), 0) as last_id
                """)
                last_id = last_id_result.single()["last_id"]
                new_id = str(last_id + 1)
                demand['id'] = new_id

                # Generate description and embedding
                description = self.generate_demand_description(demand)
                embedding = self.generate_embedding(description)
                embedding_str = ','.join(map(str, embedding))
                
                # Create Demand node with embedding
                session.run("""
                    CREATE (d:Demand {
                        id: $id,
                        role: $role,
                        grade: $grade,
                        start_date: $start_date,
                        end_date: $end_date,
                        office: $office,
                        job_description: $job_description,
                        description: $description,
                        embedding: $embedding_str
                    })
                """, **demand, description=description, embedding_str=embedding_str)

                # Create REQUIRES relationship
                session.run("""
                    MATCH (d:Demand {id: $id})
                    MATCH (r:Role {name: $role})
                    CREATE (d)-[:REQUIRES]->(r)
                """, id=demand['id'], role=demand['role'])
                
                print(f"✓ Created demand {demand['id']} with embedding")
                
            else: 
                for demand in DEMANDS.values():
                    # Generate description and embedding
                    description = self.generate_demand_description(demand)
                    embedding = self.generate_embedding(description)
                    embedding_str = ','.join(map(str, embedding))
                    
                    # Create Demand node with embedding
                    session.run("""
                        CREATE (d:Demand {
                            id: $id,
                            role: $role,
                            grade: $grade,
                            start_date: $start_date,
                            end_date: $end_date,
                            office: $office,
                            job_description: $job_description,
                            description: $description,
                            embedding: $embedding_str
                        })
                    """, **demand, description=description, embedding_str=embedding_str)

                    # Create REQUIRES relationship
                    session.run("""
                        MATCH (d:Demand {id: $id})
                        MATCH (r:Role {name: $role})
                        CREATE (d)-[:REQUIRES]->(r)
                    """, id=demand['id'], role=demand['role'])
                    
                    print(f"✓ Created demand {demand['id']} with embedding")
                
                print("✓ Demands created with relationships and embeddings")

    def validate_data(self):
        """Validate that nodes and embeddings were stored correctly."""
        with self.driver.session() as session:
            # Check profiles
            profile_result = session.run("""
                MATCH (p:Person)
                RETURN p.emp_id as emp_id, 
                       p.name as name,
                       size(split(p.embedding, ',')) as embedding_length,
                       p.description as description
                LIMIT 1
            """)
            profile = profile_result.single()
            
            # Check demands
            demand_result = session.run("""
                MATCH (d:Demand)
                RETURN d.id as id,
                       size(split(d.embedding, ',')) as embedding_length,
                       d.description as description
                LIMIT 1
            """)
            demand = demand_result.single()
            
            print("\nValidation Results:")
            print(f"Sample Profile: {profile['name']} (ID: {profile['emp_id']})")
            print(f"  - Embedding dimensions: {profile['embedding_length']}")
            print(f"  - Has description: {'Yes' if profile['description'] else 'No'}")
            
            print(f"\nSample Demand: {demand['id']}")
            print(f"  - Embedding dimensions: {demand['embedding_length']}")
            print(f"  - Has description: {'Yes' if demand['description'] else 'No'}")

    def setup_database(self):
        """Complete database setup with descriptions and embeddings"""
        print("Starting database setup...")
        self.clear_database()
        self.setup_schema()
        self.create_roles()
        self.create_tools()
        self.create_employees_with_embeddings()
        self.create_demands_with_embeddings()
        self.validate_data()
        print("\nDatabase setup completed successfully! ✨")

def main():
    """Main function to setup the database"""
    setup = DatabaseSetup()
    try:
        setup.setup_database()
    finally:
        setup.close()

if __name__ == "__main__":
    main()
