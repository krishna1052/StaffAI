from typing import Dict, List, Optional
from src.setup_database import DatabaseSetup
from neo4j.graph import Record

class DemandQuery:
    def __init__(self, db: DatabaseSetup):
        """Initialize DemandQuery with database connection."""
        self.db = db

    def find_one_hop_connections(self, demand_id: str, similarity_threshold: float = 0.5) -> List[Record]:
        """
        Find direct connections through roles with similarity above threshold.
        
        Args:
            demand_id: The ID of the demand to search for
            similarity_threshold: Minimum similarity score threshold (default: 0.5)
            
        Returns:
            List of neo4j.Record objects containing matching persons
        """
        query = """
            MATCH (d:Demand {id: $demand_id})-[:REQUIRES]->(r:Role)<-[:CAN_PLAY]-(p:Person)
            WITH d, p, 
                gds.similarity.cosine(
                    d.embedding,
                    p.embedding
                ) AS similarity
            WHERE similarity > $threshold
            RETURN p.name AS name, p.role AS role, p.grade AS grade, similarity
            ORDER BY similarity DESC
        """
        
        with self.db.driver.session() as session:
            results = list(session.run(query, demand_id=demand_id, threshold=similarity_threshold))
        return results

    def find_two_hop_connections(self, demand_id: str, similarity_threshold: float = 0.5, 
                               person_similarity_threshold: float = 0.3) -> List[Record]:
        """
        Find connections through roles and similar people with similarity above threshold.
        
        Args:
            demand_id: The ID of the demand to search for
            similarity_threshold: Minimum similarity score threshold (default: 0.5)
            person_similarity_threshold: Minimum similarity score between persons (default: 0.3)
            
        Returns:
            List of neo4j.Record objects containing matching persons
        """
        query = """
            MATCH (d:Demand {id: $demand_id})-[:REQUIRES]->(r:Role)<-[:CAN_PLAY]-(p1:Person)-[s:SIMILAR_TO]->(p2:Person)
            WHERE p1 <> p2 AND s.score > $person_threshold
            WITH d, p2,
                gds.similarity.cosine(
                    d.embedding,
                    p2.embedding
                ) AS similarity
            WHERE similarity > $threshold
            RETURN DISTINCT p2.name AS name, p2.role AS role, p2.grade AS grade, similarity
            ORDER BY similarity DESC
        """
        
        with self.db.driver.session() as session:
            results = list(session.run(query, 
                                    demand_id=demand_id, 
                                    threshold=similarity_threshold,
                                    person_threshold=person_similarity_threshold))
        return results

    def print_results(self, results: List[Record], hop_type: str):
        """Print formatted results."""
        print(f"\n=== {hop_type}-Hop Connections ===")
        if results:
            for record in results:
                print(f"Person: {record['name']}, Role: {record['role']}, Grade: {record['grade']}")
                print(f"Similarity Score: {record['similarity']:.3f}\n")
        else:
            print(f"No {hop_type}-hop connections found.\n")

def main():
    """Main function to demonstrate demand querying."""
    db = DatabaseSetup()
    demand_query = DemandQuery(db)
    
    # Sample demand data
    sample_demand = {
        'role': 'UX Designer',
        'grade': 'Senior',
        'start_date': '2025-05-01',
        'end_date': '2025-09-30',
        'office': 'New York',
        'job_description': 'Looking for a UX Designer with strong skills in Figma, and Photoshop'
    }
    
    # Create demand and get demand_id
    demand_id = db.create_demands_with_embeddings(sample_demand)
    
    # Find and print 1-hop connections
    one_hop_results = demand_query.find_one_hop_connections(demand_id)
    demand_query.print_results(one_hop_results, "1")
    
    # Find and print 2-hop connections
    two_hop_results = demand_query.find_two_hop_connections(demand_id)
    demand_query.print_results(two_hop_results, "2")

if __name__ == "__main__":
    main()
