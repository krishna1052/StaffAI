"""
Script to test the StaffAI API endpoints.
"""

import requests
import json
from config import NEO4J_URL, NEO4J_USER, NEO4J_PASSWORD, NEO4J_DATABASE

# API base URL
API_URL = "http://localhost:8080/api"

def print_response(response, endpoint):
    """Print the response from an API endpoint."""
    print(f"\n=== {endpoint} ===")
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"Response: {json.dumps(data, indent=2)}")
    else:
        print(f"Error: {response.text}")

def test_health():
    """Test the health check endpoint."""
    response = requests.get(f"{API_URL}/health")
    print_response(response, "Health Check")

def test_get_profiles():
    """Test the get profiles endpoint."""
    response = requests.get(f"{API_URL}/profiles")
    print_response(response, "Get Profiles")

def test_search_profiles(query="data"):
    """Test the search profiles endpoint."""
    response = requests.get(f"{API_URL}/profiles/search?query={query}")
    print_response(response, f"Search Profiles (query={query})")

def test_get_profile_by_id(id="001"):
    """Test the get profile by ID endpoint."""
    response = requests.get(f"{API_URL}/profiles/{id}")
    print_response(response, f"Get Profile by ID (id={id})")

def test_get_roles():
    """Test the get roles endpoint."""
    response = requests.get(f"{API_URL}/roles")
    print_response(response, "Get Roles")

def test_get_tools():
    """Test the get tools endpoint."""
    response = requests.get(f"{API_URL}/tools")
    print_response(response, "Get Tools")

def test_get_profiles_by_role(role="Data Scientist"):
    """Test the get profiles by role endpoint."""
    response = requests.get(f"{API_URL}/profiles/role/{role}")
    print_response(response, f"Get Profiles by Role (role={role})")

def test_get_profiles_by_tool(tool="Python"):
    """Test the get profiles by tool endpoint."""
    response = requests.get(f"{API_URL}/profiles/tool/{tool}")
    print_response(response, f"Get Profiles by Tool (tool={tool})")

def run_all_tests():
    """Run all API tests."""
    print(f"Testing StaffAI API with Neo4j database: {NEO4J_DATABASE}")
    print(f"Neo4j URL: {NEO4J_URL}")
    print(f"Neo4j User: {NEO4J_USER}")
    
    test_health()
    test_get_profiles()
    test_search_profiles()
    test_get_roles()
    test_get_tools()
    
    # Get the first profile ID from the profiles endpoint
    response = requests.get(f"{API_URL}/profiles")
    if response.status_code == 200:
        profiles = response.json()
        if profiles:
            profile_id = profiles[0].get("emp_id")
            if profile_id:
                test_get_profile_by_id(profile_id)
    
    # Get the first role from the roles endpoint
    response = requests.get(f"{API_URL}/roles")
    if response.status_code == 200:
        roles = response.json()
        if roles:
            test_get_profiles_by_role(roles[0])
    
    # Get the first tool from the tools endpoint
    response = requests.get(f"{API_URL}/tools")
    if response.status_code == 200:
        tools = response.json()
        if tools:
            test_get_profiles_by_tool(tools[0])

if __name__ == "__main__":
    run_all_tests()
