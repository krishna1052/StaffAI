import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Divider,
  CircularProgress,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemButton,
  Rating,
  TextField,
  InputAdornment,
  IconButton,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import BuildIcon from '@mui/icons-material/Build';
import SearchIcon from '@mui/icons-material/Search';
import StarIcon from '@mui/icons-material/Star';
import { getTools, getProfilesByTool } from '../services/api';

const ToolsPage = () => {
  const navigate = useNavigate();
  const [tools, setTools] = useState([]);
  const [filteredTools, setFilteredTools] = useState([]);
  const [toolProfiles, setToolProfiles] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedTool, setExpandedTool] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchTools = async () => {
      setLoading(true);
      try {
        const toolsData = await getTools();
        setTools(toolsData);
        setFilteredTools(toolsData);
        
        // Initialize toolProfiles with empty arrays
        const initialToolProfiles = {};
        toolsData.forEach(tool => {
          initialToolProfiles[tool] = [];
        });
        setToolProfiles(initialToolProfiles);
      } catch (err) {
        setError('Failed to fetch tools. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTools();
  }, []);

  useEffect(() => {
    // Filter tools based on search query
    if (searchQuery.trim() === '') {
      setFilteredTools(tools);
    } else {
      const filtered = tools.filter(tool => 
        tool.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredTools(filtered);
    }
  }, [searchQuery, tools]);

  const handleToolExpand = async (tool) => {
    // Toggle expanded tool
    const newExpandedTool = expandedTool === tool ? null : tool;
    setExpandedTool(newExpandedTool);
    
    // If expanding and no profiles loaded yet, fetch them
    if (newExpandedTool && toolProfiles[tool].length === 0) {
      try {
        const profiles = await getProfilesByTool(tool);
        setToolProfiles(prev => ({
          ...prev,
          [tool]: profiles
        }));
      } catch (err) {
        console.error(`Error fetching profiles for tool ${tool}:`, err);
        // Keep the accordion expanded but show an error
        setToolProfiles(prev => ({
          ...prev,
          [tool]: 'error'
        }));
      }
    }
  };

  const handleProfileClick = (id) => {
    navigate(`/profile/${id}`);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Skills & Technologies
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Browse all available skills and technologies and see which staff members possess them.
        </Typography>
        
        <Box sx={{ my: 3 }}>
          <TextField
            fullWidth
            label="Search Skills"
            variant="outlined"
            value={searchQuery}
            onChange={handleSearch}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end">
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {filteredTools.length} skills found
          </Typography>
        </Box>
        
        <Divider sx={{ my: 3 }} />
        
        <Box sx={{ mt: 3 }}>
          {filteredTools.length > 0 ? (
            filteredTools.map((tool) => (
              <Accordion 
                key={tool} 
                expanded={expandedTool === tool}
                onChange={() => handleToolExpand(tool)}
                sx={{ mb: 2 }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`${tool}-content`}
                  id={`${tool}-header`}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <BuildIcon color="primary" sx={{ mr: 2 }} />
                    <Typography variant="h6">{tool}</Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  {toolProfiles[tool] === 'error' ? (
                    <Alert severity="error">
                      Failed to load profiles for this skill.
                    </Alert>
                  ) : toolProfiles[tool]?.length === 0 ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                      <CircularProgress size={24} />
                    </Box>
                  ) : toolProfiles[tool]?.length > 0 ? (
                    <List>
                      {toolProfiles[tool].map((profile) => (
                        <ListItem 
                          key={profile.emp_id}
                          disablePadding
                          sx={{ mb: 1 }}
                        >
                          <ListItemButton onClick={() => handleProfileClick(profile.emp_id)}>
                            <ListItemAvatar>
                              <Avatar sx={{ bgcolor: 'primary.main' }}>
                                {profile.name.charAt(0)}
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText 
                              primary={profile.name} 
                              secondary={`${profile.role} (${profile.grade}) - ${profile.office}`}
                            />
                            <Rating
                              value={profile.rating}
                              readOnly
                              size="small"
                              emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                            />
                          </ListItemButton>
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No profiles found with this skill.
                    </Typography>
                  )}
                </AccordionDetails>
              </Accordion>
            ))
          ) : (
            <Alert severity="info">
              No skills found matching your search.
            </Alert>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default ToolsPage;
