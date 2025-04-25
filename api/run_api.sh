#!/bin/bash

# Load environment variables from .env file if it exists
if [ -f .env ]; then
  echo "Loading environment variables from .env file"
  export $(grep -v '^#' .env | xargs)
fi

# Set Neo4j connection environment variables (can be overridden by exporting these variables before running the script)
export NEO4J_URL=${NEO4J_URL:-"bolt://localhost:7687"}
export NEO4J_USER=${NEO4J_USER:-"neo4j"}
export NEO4J_PASSWORD=${NEO4J_PASSWORD:-"twerstwers"}
export NEO4J_DATABASE=${NEO4J_DATABASE:-"twemployee"}

# Print connection info
echo "Starting StaffAI API server with the following configuration:"
echo "NEO4J_URL: $NEO4J_URL"
echo "NEO4J_USER: $NEO4J_USER"
echo "NEO4J_DATABASE: $NEO4J_DATABASE"

# Run the FastAPI server
uvicorn app:app --host 0.0.0.0 --port 8080 --reload
