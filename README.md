# StaffAI

## Setup

### Neo4j with Docker

Run the following command to start Neo4j with APOC and Graph Data Science plugins:

```bash
docker run \
  --name neo4j-apoc \
  -p7474:7474 -p7687:7687 \
  -d \
  -e NEO4J_AUTH=neo4j/password \
  -e NEO4J_PLUGINS='["apoc", "graph-data-science"]' \
  neo4j:5.16
```

This will:
- Start Neo4j version 5.16
- Expose ports 7474 (HTTP) and 7687 (Bolt)
- Set initial password to 'password'
- Include APOC and Graph Data Science plugins