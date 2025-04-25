"""
Configuration settings for the StaffAI application.
"""

import os
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables from .env file if it exists
env_path = Path(__file__).parent / '.env'
if env_path.exists():
    load_dotenv(dotenv_path=env_path)

# Neo4j connection settings
NEO4J_URL = os.environ.get("NEO4J_URL", "bolt://localhost:7687")
NEO4J_USER = os.environ.get("NEO4J_USER", "neo4j")
NEO4J_PASSWORD = os.environ.get("NEO4J_PASSWORD", "twerstwers")
NEO4J_DATABASE = os.environ.get("NEO4J_DATABASE", "twemployee")

# API settings
API_HOST = os.environ.get("API_HOST", "0.0.0.0")
API_PORT = int(os.environ.get("API_PORT", "8080"))

# Print configuration (for debugging)
if __name__ == "__main__":
    print("StaffAI Configuration:")
    print(f"NEO4J_URL: {NEO4J_URL}")
    print(f"NEO4J_USER: {NEO4J_USER}")
    print(f"NEO4J_DATABASE: {NEO4J_DATABASE}")
    print(f"API_HOST: {API_HOST}")
    print(f"API_PORT: {API_PORT}")
