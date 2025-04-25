# StaffAI - Job Profile Matching System

StaffAI is a job profile matching system that uses Neo4j graph database and vector embeddings to match staff profiles with job demands. The system consists of a Python backend with FastAPI and a React frontend.

## Project Structure

```
StaffAI/
├── api/                    # FastAPI backend
│   ├── app.py              # Main FastAPI application
│   ├── requirements.txt    # Python dependencies
│   ├── routes/             # API routes
│   └── services/           # Business logic
├── frontend/               # React frontend
│   ├── public/             # Static files
│   └── src/                # React source code
│       ├── components/     # React components
│       ├── pages/          # Page components
│       └── services/       # API services
└── src/                    # Core Python code
    ├── schema.py           # Neo4j schema definitions
    ├── setup_database.py   # Database setup code
    └── data/               # Sample data
        └── sample_data.py  # Sample employee and job data
```

## Prerequisites

- Node.js (v14+)
- Python (v3.8+)
- Neo4j Database (v4.4+)

## Setup Instructions

### 1. Set up Neo4j Database

1. Install Neo4j Desktop or use Neo4j Aura cloud service
2. Create a new database with the following credentials:
   - URL: bolt://localhost:7687
   - Username: neo4j
   - Password: password
   - (Or update the connection details in `src/setup_database.py`)
3. Install the Graph Data Science (GDS) library in your Neo4j instance

### 2. Set up Python Backend

```bash
# Create and activate a virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
pip install -r api/requirements.txt

# Initialize the database with sample data
python src/setup_database.py

# Start the FastAPI server
cd api
uvicorn app:app --reload
```

The API will be available at http://localhost:5000 with interactive documentation at http://localhost:5000/docs

### 3. Set up React Frontend

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

The frontend will be available at http://localhost:3000

## Features

- **Profile Search**: Search for staff profiles by name, role, or skills
- **Semantic Search**: Use vector embeddings to find semantically similar profiles
- **Role-based Filtering**: Filter profiles by role
- **Skill-based Filtering**: Filter profiles by skill/technology
- **Detailed Profile View**: View detailed information about each profile
- **Responsive Design**: Works on desktop and mobile devices

## API Endpoints

- `GET /api/profiles`: Get all profiles
- `GET /api/profiles/search?query=<query>`: Search profiles by text
- `POST /api/profiles/vector-search`: Search profiles using vector similarity
- `GET /api/profiles/{id}`: Get profile by ID
- `GET /api/roles`: Get all roles
- `GET /api/tools`: Get all tools/skills
- `GET /api/profiles/role/{role}`: Get profiles by role
- `GET /api/profiles/tool/{tool}`: Get profiles by tool/skill
- `GET /api/health`: Health check endpoint

## Technologies Used

- **Backend**:
  - FastAPI (Python web framework)
  - Neo4j (Graph database)
  - Sentence Transformers (Vector embeddings)

- **Frontend**:
  - React (UI library)
  - Material-UI (Component library)
  - React Router (Navigation)
  - Axios (API client)

## License

This project is licensed under the MIT License - see the LICENSE file for details.
