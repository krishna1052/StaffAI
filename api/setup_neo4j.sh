#!/bin/bash

# Set Neo4j connection environment variables (can be overridden by exporting these variables before running the script)
export NEO4J_URL=${NEO4J_URL:-"bolt://localhost:7687"}
export NEO4J_USER=${NEO4J_USER:-"neo4j"}
export NEO4J_PASSWORD=${NEO4J_PASSWORD:-"twerstwers"}
export NEO4J_DATABASE=${NEO4J_DATABASE:-"twemployee"}

# Print connection info
echo "Setting up Neo4j database for StaffAI with the following configuration:"
echo "NEO4J_URL: $NEO4J_URL"
echo "NEO4J_USER: $NEO4J_USER"
echo "NEO4J_DATABASE: $NEO4J_DATABASE"

# Run the Neo4j database setup script
python setup_database.py
