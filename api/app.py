"""
FastAPI backend for the StaffAI job profile matching system.
This API provides endpoints to search and retrieve profiles from the Neo4j database.
"""

from fastapi import FastAPI, HTTPException, Query, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
import sys
import os
from contextlib import asynccontextmanager
import json
from neo4j import GraphDatabase
from config import NEO4J_URL, NEO4J_USER, NEO4J_PASSWORD, NEO4J_DATABASE

# Models
class ProfileBase(BaseModel):
    emp_id: str
    name: str
    role: str
    grade: str
    office: str
    description: Optional[str] = None

class ProfileCreate(BaseModel):
    role: str = Field(..., description="Job role")
    grade: str = Field(..., description="Grade level")
    start_date: str = Field(..., description="Start date in YYYY-MM-DD format")
    end_date: str = Field(..., description="End date in YYYY-MM-DD format") 
    office: str = Field(..., description="Office location")
    job_description: str = Field(..., description="Job description")

class Skill(BaseModel):
    name: str
    rating: int

class ProfileDetail(ProfileBase):
    roles: List[str]
    skills: List[Skill]

class ProfileWithRating(ProfileBase):
    rating: int

# Neo4j connection
class Neo4jConnection:
    def __init__(self, uri=NEO4J_URL, user=NEO4J_USER, password=NEO4J_PASSWORD, database=NEO4J_DATABASE):
        self.driver = GraphDatabase.driver(uri, auth=(user, password), database=database)
        
    def close(self):
        self.driver.close()
        
    def test_connection(self):
        with self.driver.session() as session:
            result = session.run("RETURN 'Connection successful' as message")
            return result.single()["message"]
    
    def get_all_profiles(self):
        """Get all profiles from Neo4j."""
        with self.driver.session() as session:
            result = session.run("""
                MATCH (p:Person)
                RETURN p.emp_id as emp_id, 
                       p.name as name, 
                       p.role as role, 
                       p.grade as grade, 
                       p.office as office, 
                       p.description as description
            """)
            return [dict(record) for record in result]
            
    def create_profile(self, profile_data):
        """Create a new profile in Neo4j."""
        # Generate a new unique ID
        with self.driver.session() as session:
            # Get the highest emp_id and increment
            result = session.run("""
                MATCH (p:Person)
                RETURN p.emp_id as emp_id
                ORDER BY p.emp_id DESC
                LIMIT 1
            """)
            record = result.single()
            if record:
                try:
                    last_id = int(record["emp_id"])
                    new_id = str(last_id + 1).zfill(3)
                except (ValueError, TypeError):
                    new_id = "001"
            else:
                new_id = "001"
                
            # Create the profile
            result = session.run("""
                CREATE (p:Person {
                    emp_id: $emp_id,
                    name: $name,
                    role: $role,
                    grade: $grade,
                    office: $office,
                    description: $description,
                    start_date: $start_date,
                    end_date: $end_date
                })
                RETURN p.emp_id as emp_id, 
                       p.name as name, 
                       p.role as role, 
                       p.grade as grade, 
                       p.office as office, 
                       p.description as description
            """, 
            emp_id=new_id,
            name=f"Profile {new_id}",  # Default name
            role=profile_data.role,
            grade=profile_data.grade,
            office=profile_data.office,
            description=profile_data.job_description,
            start_date=profile_data.start_date,
            end_date=profile_data.end_date
            )
            
            record = result.single()
            if not record:
                return None
                
            # Also create relationship to the Role node
            session.run("""
                MATCH (p:Person {emp_id: $emp_id})
                MERGE (r:Role {name: $role})
                CREATE (p)-[:CAN_PLAY]->(r)
            """, emp_id=new_id, role=profile_data.role)
                
            return dict(record)
    
    def search_profiles(self, query):
        """Search profiles by query."""
        query_lower = query.lower()
        with self.driver.session() as session:
            result = session.run("""
                MATCH (p:Person)
                WHERE toLower(p.name) CONTAINS $query OR 
                      toLower(p.role) CONTAINS $query OR 
                      toLower(p.description) CONTAINS $query
                RETURN p.emp_id as emp_id, 
                       p.name as name, 
                       p.role as role, 
                       p.grade as grade, 
                       p.office as office, 
                       p.description as description
            """, query=query_lower)
            return [dict(record) for record in result]
    
    def get_profile_by_id(self, id):
        """Get profile by ID with roles and skills."""
        with self.driver.session() as session:
            # Get basic profile info
            profile_result = session.run("""
                MATCH (p:Person {emp_id: $id})
                RETURN p.emp_id as emp_id, 
                       p.name as name, 
                       p.role as role, 
                       p.grade as grade, 
                       p.office as office, 
                       p.description as description
            """, id=id)
            
            profile_record = profile_result.single()
            if not profile_record:
                return None
            
            profile = dict(profile_record)
            
            # Get roles
            roles_result = session.run("""
                MATCH (p:Person {emp_id: $id})-[:CAN_PLAY]->(r:Role)
                RETURN r.name as role
            """, id=id)
            
            profile["roles"] = [record["role"] for record in roles_result]
            
            # Get skills with ratings
            skills_result = session.run("""
                MATCH (p:P  erson {emp_id: $id})-[rel:HAS_SKILL]->(t:Tool)
                RETURN t.name as name, rel.rating as rating
            """, id=id)
            
            profile["skills"] = [{"name": record["name"], "rating": record["rating"]} for record in skills_result]
            
            return profile
    
    def get_all_roles(self):
        """Get all roles."""
        with self.driver.session() as session:
            result = session.run("""
                MATCH (r:Role)
                RETURN r.name as role
                ORDER BY r.name
            """)
            return [record["role"] for record in result]
    
    def get_all_tools(self):
        """Get all tools/skills."""
        with self.driver.session() as session:
            result = session.run("""
                MATCH (t:Tool)
                RETURN t.name as tool
                ORDER BY t.name
            """)
            return [record["tool"] for record in result]
    
    def get_profiles_by_role(self, role):
        """Get profiles by role."""
        with self.driver.session() as session:
            result = session.run("""
                MATCH (p:Person)-[:CAN_PLAY]->(r:Role {name: $role})
                RETURN p.emp_id as emp_id, 
                       p.name as name, 
                       p.role as role, 
                       p.grade as grade, 
                       p.office as office, 
                       p.description as description
            """, role=role)
            return [dict(record) for record in result]
    
    def get_profiles_by_tool(self, tool):
        """Get profiles by tool/skill with ratings."""
        with self.driver.session() as session:
            result = session.run("""
                MATCH (p:Person)-[rel:HAS_SKILL]->(t:Tool {name: $tool})
                RETURN p.emp_id as emp_id, 
                       p.name as name, 
                       p.role as role, 
                       p.grade as grade, 
                       p.office as office, 
                       p.description as description,
                       rel.rating as rating
                ORDER BY rel.rating DESC
            """, tool=tool)
            return [dict(record) for record in result]

# Database connection
try:
    db = Neo4jConnection()
    # Test connection
    connection_test = db.test_connection()
    print(f"Neo4j connection test: {connection_test}")
except Exception as e:
    print(f"Error connecting to Neo4j: {str(e)}")
    # Continue with initialization to allow the app to start,
    # but endpoints will fail if db connection is not working
    db = None

# Create sample data for testing
SAMPLE_PROFILES = [
    {
        "emp_id": "001",
        "name": "Alice",
        "role": "Data Scientist",
        "grade": "Senior",
        "office": "New York",
        "description": "Skilled in Python, R, and TensorFlow."
    },
    {
        "emp_id": "002",
        "name": "Bob",
        "role": "Software Engineer",
        "grade": "Mid",
        "office": "San Francisco",
        "description": "Skilled in Java, Python, and SQL."
    },
    {
        "emp_id": "003",
        "name": "Charlie",
        "role": "Data Analyst",
        "grade": "Junior",
        "office": "New York",
        "description": "Skilled in Excel, SQL, and Python."
    }
]

SAMPLE_ROLES = ["Data Scientist", "Software Engineer", "Data Analyst", "Frontend Developer", "Backend Developer"]
SAMPLE_TOOLS = ["Python", "R", "Java", "SQL", "Excel", "TensorFlow", "React", "Node.js"]

# Lifespan event handler
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    yield
    # Shutdown
    db.close()

# Create FastAPI app
app = FastAPI(
    title="StaffAI API",
    description="API for searching and retrieving profiles from the Neo4j database",
    version="1.0.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

@app.get("/api/profiles", response_model=List[ProfileBase])
async def get_profiles():
    """Get all profiles."""
    try:
        if db is not None:
            return db.get_all_profiles()
        else:
            # Fallback to sample data if database connection failed
            print("Using sample data as fallback since database connection failed")
            return SAMPLE_PROFILES
    except Exception as e:
        print(f"Error in get_profiles: {str(e)}")
        # Fallback to sample data
        return SAMPLE_PROFILES

@app.get("/api/profiles/search", response_model=List[ProfileBase])
async def search_profiles(query: str = Query(..., description="Search query")):
    """Search profiles by query."""
    if not query:
        raise HTTPException(status_code=400, detail="Search query is required")
    
    try:
        if db is not None:
            return db.search_profiles(query)
        else:
            # Fallback to filtering sample data
            print("Using sample data as fallback since database connection failed")
            query_lower = query.lower()
            return [
                profile for profile in SAMPLE_PROFILES 
                if query_lower in profile["name"].lower() 
                or query_lower in profile["role"].lower() 
                or (profile.get("description") and query_lower in profile["description"].lower())
            ]
    except Exception as e:
        print(f"Error in search_profiles: {str(e)}")
        # Fallback to filtering sample data
        query_lower = query.lower()
        return [
            profile for profile in SAMPLE_PROFILES 
            if query_lower in profile["name"].lower() 
            or query_lower in profile["role"].lower() 
            or (profile.get("description") and query_lower in profile["description"].lower())
        ]

@app.get("/api/profiles/{id}", response_model=ProfileDetail)
async def get_profile(id: str):
    """Get profile by ID with roles and skills."""
    try:
        profile = db.get_profile_by_id(id)
        if not profile:
            raise HTTPException(status_code=404, detail="Profile not found")
        return profile
    except Exception as e:
        if "Profile not found" in str(e):
            raise HTTPException(status_code=404, detail="Profile not found")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@app.get("/api/roles", response_model=List[str])
async def get_roles():
    """Get all roles."""
    try:
        return db.get_all_roles()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@app.get("/api/tools", response_model=List[str])
async def get_tools():
    """Get all tools/skills."""
    try:
        return db.get_all_tools()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@app.get("/api/profiles/role/{role}", response_model=List[ProfileBase])
async def get_profiles_by_role(role: str):
    """Get profiles by role."""
    try:
        return db.get_profiles_by_role(role)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@app.get("/api/profiles/tool/{tool}", response_model=List[ProfileWithRating])
async def get_profiles_by_tool(tool: str):
    """Get profiles by tool/skill."""
    try:
        return db.get_profiles_by_tool(tool)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@app.get("/api/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "ok"}

@app.post("/api/profiles", response_model=ProfileBase)
async def create_profile(profile_data: ProfileCreate = Body(...)):
    """Create a new profile."""
    try:
        if db is not None:
            profile = db.create_profile(profile_data)
            if not profile:
                raise HTTPException(status_code=500, detail="Failed to create profile")
            return profile
        else:
            # Fallback for testing without DB
            raise HTTPException(status_code=500, detail="Database connection not available")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8080, reload=True)
