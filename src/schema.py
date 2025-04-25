"""
Neo4j graph database schema definitions for the job profile matching system.
Includes Cypher queries for creating constraints and indexes.
"""

# Node labels
LABELS = {
    'PERSON': 'Person',
    'ROLE': 'Role',
    'TOOL': 'Tool',
    'DEMAND': 'Demand'
}

# Relationship types
RELATIONSHIPS = {
    'CAN_PLAY': 'CAN_PLAY',    # Person to Role
    'HAS_SKILL': 'HAS_SKILL',  # Person to Tool (with rating property)
    'REQUIRES': 'REQUIRES'      # Demand to Role
}

# Schema creation queries
SCHEMA_QUERIES = [
    # Constraints
    """
    CREATE CONSTRAINT person_emp_id IF NOT EXISTS
    FOR (p:Person) REQUIRE p.emp_id IS UNIQUE
    """,
    """
    CREATE CONSTRAINT role_name IF NOT EXISTS
    FOR (r:Role) REQUIRE r.name IS UNIQUE
    """,
    """
    CREATE CONSTRAINT tool_name IF NOT EXISTS
    FOR (t:Tool) REQUIRE t.name IS UNIQUE
    """,
    """
    CREATE CONSTRAINT demand_id IF NOT EXISTS
    FOR (d:Demand) REQUIRE d.id IS UNIQUE
    """,
    
    # Indexes for better query performance
    """
    CREATE INDEX person_embedding IF NOT EXISTS
    FOR (p:Person) ON (p.embedding)
    """,
    """
    CREATE INDEX person_office IF NOT EXISTS
    FOR (p:Person) ON (p.office)
    """,
    """
    CREATE INDEX person_grade IF NOT EXISTS
    FOR (p:Person) ON (p.grade)
    """,
    """
    CREATE INDEX demand_role IF NOT EXISTS
    FOR (d:Demand) ON (d.role)
    """,
    """
    CREATE INDEX demand_embedding IF NOT EXISTS
    FOR (d:Demand) ON (d.embedding)
    """
]

# Example of the graph structure in Cypher
EXAMPLE_STRUCTURE = """
// Create a Person node
CREATE (p:Person {
    emp_id: 'string',      // Unique identifier
    name: 'string',        // Employee name
    role: 'string',        // Current role
    grade: 'string',       // Seniority level
    office: 'string',      // Location
    embedding: 'list'      // Vector embedding of skills and roles
})

// Create a Role node
CREATE (r:Role {
    name: 'string'         // Role name
})

// Create a Tool node
CREATE (t:Tool {
    name: 'string'         // Tool/technology name
})

// Create a Demand node
CREATE (d:Demand {
    id: 'string',          // Unique identifier
    role: 'string',        // Required role
    grade: 'string',       // Required seniority level
    start_date: 'string',  // Project start date
    end_date: 'string',    // Project end date
    office: 'string',      // Location
    job_description: 'string', // Text description
    embedding: 'list'      // Vector embedding of requirements
})

// Create relationships
CREATE (p)-[:CAN_PLAY]->(r)
CREATE (p)-[:HAS_SKILL {rating: integer}]->(t)
CREATE (d)-[:REQUIRES]->(r)
"""
