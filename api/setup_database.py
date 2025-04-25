"""
Script to initialize the Neo4j database with sample data for the StaffAI application.
"""

import sys
import os
from neo4j import GraphDatabase
from sentence_transformers import SentenceTransformer
import time
from config import NEO4J_URL, NEO4J_USER, NEO4J_PASSWORD, NEO4J_DATABASE

# Add the src directory to the path so we can import from there
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
from src.data.sample_data import EMPLOYEES, DEMANDS, ROLES, TOOLS
from src.schema import SCHEMA_QUERIES

class DatabaseSetup:
    def __init__(self, 
                 uri: str = NEO4J_URL,
                 user: str = NEO4J_USER, 
                 password: str = NEO4J_PASSWORD,
                 database: str = NEO4J_DATABASE,
                 model_name: str = 'all-MiniLM-L6-v2'):
        """Initialize database and embedding model connections."""
        self.driver = GraphDatabase.driver(uri, auth=(user, password), database=database)
        print("Loading embedding model...")
        try:
            self.model = SentenceTransformer(model_name)
            print("Embedding model loaded successfully.")
        except Exception as e:
            print(f"Warning: Could not load embedding model: {str(e)}")
            print("Continuing without embeddings...")
            self.model = None

    def close(self):
        """Close the database connection."""
        self.driver.close()

    def format_tools_description(self, tools):
        """Format tools and their ratings into a readable string."""
        tools_list = [f"{tool} (rating: {rating})" for tool, rating in tools.items()]
        return f"Skilled in {', '.join(tools_list)}."

    def generate_profile_description(self, profile):
        """Generate a textual description for an employee profile."""
        roles = ", ".join(profile['can_play'])
        tools = self.format_tools_description(profile['tools'])
        
        description = f"Can play roles: {roles}. {tools}"
        description += f" {profile['grade']} level position in {profile['office']}."
        
        return description

    def generate_embedding(self, text):
        """Generate embedding for a given text."""
        if self.model:
            return self.model.encode(text).tolist()
        return []  # Return empty list if model is not available

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
                embedding_str = ','.join(map(str, embedding)) if embedding else ""
                
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

    def validate_data(self):
        """Validate that nodes and embeddings were stored correctly."""
        with self.driver.session() as session:
            # Check profiles
            profile_result = session.run("""
                MATCH (p:Person)
                RETURN count(p) as person_count
            """)
            person_count = profile_result.single()["person_count"]
            
            # Check roles
            role_result = session.run("""
                MATCH (r:Role)
                RETURN count(r) as role_count
            """)
            role_count = role_result.single()["role_count"]
            
            # Check tools
            tool_result = session.run("""
                MATCH (t:Tool)
                RETURN count(t) as tool_count
            """)
            tool_count = tool_result.single()["tool_count"]
            
            # Check relationships
            can_play_result = session.run("""
                MATCH ()-[r:CAN_PLAY]->()
                RETURN count(r) as rel_count
            """)
            can_play_count = can_play_result.single()["rel_count"]
            
            has_skill_result = session.run("""
                MATCH ()-[r:HAS_SKILL]->()
                RETURN count(r) as rel_count
            """)
            has_skill_count = has_skill_result.single()["rel_count"]
            
            print("\nValidation Results:")
            print(f"Person nodes: {person_count}")
            print(f"Role nodes: {role_count}")
            print(f"Tool nodes: {tool_count}")
            print(f"CAN_PLAY relationships: {can_play_count}")
            print(f"HAS_SKILL relationships: {has_skill_count}")

    def setup_database(self):
        """Complete database setup with descriptions and embeddings"""
        print("Starting database setup...")
        self.clear_database()
        self.setup_schema()
        self.create_roles()
        self.create_tools()
        self.create_employees_with_embeddings()
        self.validate_data()
        print("\nDatabase setup completed successfully! ✨")

def main():
    """Main function to setup the database"""
    print("Initializing Neo4j database for StaffAI...")
    setup = DatabaseSetup()
    try:
        setup.setup_database()
    except Exception as e:
        print(f"Error setting up database: {str(e)}")
    finally:
        setup.close()

if __name__ == "__main__":
    main()
