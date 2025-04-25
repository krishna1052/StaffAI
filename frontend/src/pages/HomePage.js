import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Divider,
  Paper,
  Rating,
  Avatar,
  Button,
  Tooltip,
  Fade,
  useTheme
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import WorkIcon from '@mui/icons-material/Work';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FilterListIcon from '@mui/icons-material/FilterList';
import BusinessIcon from '@mui/icons-material/Business';
import SchoolIcon from '@mui/icons-material/School';
import StarIcon from '@mui/icons-material/Star';
import { getProfiles, searchProfiles, vectorSearchProfiles, getRoles, getTools } from '../services/api';

// Helper function to parse query parameters
const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

// Helper function to get initials from name
const getInitials = (name) => {
  if (!name) return 'U';
  
  const nameParts = name.split(' ');
  if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
  
  return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
};

// Generate a unique color based on name
const getAvatarColor = (name) => {
  if (!name) return 0;
  
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  return Math.abs(hash) % 5;
};

// Gradient colors for avatars
const gradientColors = [
  'linear-gradient(135deg, #3498db 0%, #2980b9 100%)', // Blue
  'linear-gradient(135deg, #16a085 0%, #27ae60 100%)', // Green
  'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)', // Red
  'linear-gradient(135deg, #f39c12 0%, #d35400 100%)', // Orange
  'linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)', // Purple
];

const HomePage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const query = useQuery();
  const searchParam = query.get('search');

  const [profiles, setProfiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState(searchParam || '');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchType, setSearchType] = useState('text'); // 'text' or 'vector'
  const [roles, setRoles] = useState([]);
  const [tools, setTools] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedTool, setSelectedTool] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);

  // Fetch profiles on component mount or when search param changes
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let results;
        if (searchParam) {
          results = await searchProfiles(searchParam);
        } else {
          results = await getProfiles();
        }
        setProfiles(results);
        
        // Fetch roles and tools for filters
        const rolesData = await getRoles();
        const toolsData = await getTools();
        setRoles(rolesData);
        setTools(toolsData);
      } catch (err) {
        setError('Failed to fetch profiles. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchParam]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      let results;
      if (searchType === 'vector' && searchQuery.trim()) {
        results = await vectorSearchProfiles(searchQuery);
      } else if (searchQuery.trim()) {
        results = await searchProfiles(searchQuery);
        // Update URL with search query
        navigate(`/?search=${encodeURIComponent(searchQuery)}`);
      } else {
        results = await getProfiles();
        navigate('/');
      }
      setProfiles(results);
    } catch (err) {
      setError('Search failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileClick = (id) => {
    navigate(`/profile/${id}`);
  };

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
  };

  const handleToolChange = (event) => {
    setSelectedTool(event.target.value);
  };

  const toggleFilter = () => {
    setFilterOpen(!filterOpen);
  };

  // Filter profiles based on selected role and tool
  const filteredProfiles = profiles.filter(profile => {
    let matchesRole = true;
    let matchesTool = true;
    
    if (selectedRole) {
      // This is a simplified filter - in reality, we'd need to fetch the roles for each profile
      matchesRole = profile.role === selectedRole;
    }
    
    if (selectedTool) {
      // This is a simplified filter - in reality, we'd need to fetch the tools for each profile
      matchesTool = profile.description?.toLowerCase().includes(selectedTool.toLowerCase());
    }
    
    return matchesRole && matchesTool;
  });

  // Skill level mappings for badges
  const getSkillLevel = (similarity) => {
    if (!similarity && similarity !== 0) return null;
    
    if (similarity > 0.8) return { level: 'Expert', color: theme.palette.success.main };
    if (similarity > 0.6) return { level: 'Advanced', color: theme.palette.info.main };
    if (similarity > 0.4) return { level: 'Intermediate', color: theme.palette.secondary.main };
    return { level: 'Beginner', color: theme.palette.warning.main };
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 8 }} className="fade-in">
      <Box sx={{ mb: 4, mt: 1 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          flexWrap: 'wrap',
          mb: 3 
        }}>
          <Box>
            <Typography 
              variant="h3" 
              component="h1" 
              fontWeight="600" 
              className="section-heading"
              sx={{ color: theme.palette.text.primary }}
            >
              Staff Profiles
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary" 
              sx={{ maxWidth: 700, mt: 1 }}
            >
              Browse and search for staff profiles across the organization. Find team members by expertise, role, or location.
            </Typography>
          </Box>
        </Box>
        
        <Paper 
          elevation={0}
          sx={{ 
            p: 3, 
            mb: 4, 
            borderRadius: 3,
            border: '1px solid',
            borderColor: theme.palette.divider,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
            background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
          }}
        >
          <form onSubmit={handleSearch}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={6} lg={5}>
                <TextField
                  fullWidth
                  placeholder="Search by name, skill, or keywords..."
                  variant="outlined"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      '&.Mui-focused': {
                        boxShadow: '0 0 0 3px rgba(22, 160, 133, 0.1)',
                      },
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: searchQuery && (
                      <InputAdornment position="end">
                        <IconButton 
                          size="small"
                          onClick={() => setSearchQuery('')}
                        >
                          <Chip 
                            label="Clear" 
                            size="small"
                            onDelete={() => setSearchQuery('')}
                          />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3} lg={3}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="search-type-label">Search Method</InputLabel>
                  <Select
                    labelId="search-type-label"
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                    label="Search Method"
                    sx={{
                      borderRadius: 3,
                      '&.Mui-focused': {
                        boxShadow: '0 0 0 3px rgba(22, 160, 133, 0.1)',
                      },
                    }}
                  >
                    <MenuItem value="text">Text-based Search</MenuItem>
                    <MenuItem value="vector">Semantic AI Search</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6} md={2} lg={2}>
                <Button 
                  type="submit" 
                  variant="contained" 
                  fullWidth
                  sx={{ 
                    borderRadius: 3,
                    py: 1.5,
                    boxShadow: '0 4px 10px rgba(44, 62, 80, 0.15)',
                  }}
                >
                  Search
                </Button>
              </Grid>
              <Grid item xs={6} md={1} lg={2}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={toggleFilter}
                  sx={{ 
                    borderRadius: 3,
                    py: 1.5,
                    width: '100%',
                    borderColor: theme.palette.divider,
                  }}
                  startIcon={<FilterListIcon />}
                >
                  {filterOpen ? 'Hide' : 'Filters'}
                </Button>
              </Grid>
            </Grid>
            
            <Fade in={filterOpen}>
              <Box sx={{ mt: 3, pt: 3, borderTop: `1px solid ${theme.palette.divider}` }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel id="role-filter-label">Filter by Role</InputLabel>
                      <Select
                        labelId="role-filter-label"
                        value={selectedRole}
                        onChange={handleRoleChange}
                        label="Filter by Role"
                        sx={{ borderRadius: 3 }}
                        startAdornment={<WorkIcon color="action" sx={{ ml: 1, mr: 1 }} />}
                      >
                        <MenuItem value="">
                          <em>All Roles</em>
                        </MenuItem>
                        {roles.map((role) => (
                          <MenuItem key={role} value={role}>
                            {role}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel id="tool-filter-label">Filter by Skill</InputLabel>
                      <Select
                        labelId="tool-filter-label"
                        value={selectedTool}
                        onChange={handleToolChange}
                        label="Filter by Skill"
                        sx={{ borderRadius: 3 }}
                        startAdornment={<BusinessIcon color="action" sx={{ ml: 1, mr: 1 }} />}
                      >
                        <MenuItem value="">
                          <em>All Skills</em>
                        </MenuItem>
                        {tools.map((tool) => (
                          <MenuItem key={tool} value={tool}>
                            {tool}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
                
                {(selectedRole || selectedTool) && (
                  <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Typography variant="body2" sx={{ mr: 1, color: 'text.secondary' }}>
                      Active filters:
                    </Typography>
                    {selectedRole && (
                      <Chip 
                        label={`Role: ${selectedRole}`} 
                        onDelete={() => setSelectedRole('')} 
                        size="small" 
                        color="primary"
                        variant="outlined"
                      />
                    )}
                    {selectedTool && (
                      <Chip 
                        label={`Skill: ${selectedTool}`} 
                        onDelete={() => setSelectedTool('')}
                        size="small"
                        color="secondary"
                        variant="outlined"
                      />
                    )}
                  </Box>
                )}
              </Box>
            </Fade>
          </form>
        </Paper>
        
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 3
        }}>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
            {searchQuery ? 
              `Search Results: "${searchQuery}"` : 
              'Available Staff'
            }
          </Typography>
          
          <Chip 
            icon={<PersonIcon />}
            label={`${filteredProfiles.length} profile${filteredProfiles.length !== 1 ? 's' : ''}`}
            color="primary" 
            variant="outlined" 
            sx={{ borderRadius: 3 }}
          />
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', mt: 8, mb: 8 }}>
          <CircularProgress size={60} thickness={4} sx={{ color: theme.palette.secondary.main }} />
          <Typography variant="h6" sx={{ mt: 2, color: 'text.secondary' }}>
            Loading profiles...
          </Typography>
        </Box>
      ) : error ? (
        <Alert 
          severity="error" 
          variant="outlined" 
          sx={{ 
            mt: 2, 
            borderRadius: 2,
            boxShadow: '0 4px 12px rgba(231, 76, 60, 0.1)'
          }}
        >
          {error}
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {filteredProfiles.length > 0 ? (
            filteredProfiles.map((profile, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={profile.emp_id} className="slide-in" sx={{ animationDelay: `${index * 0.05}s` }}>
                <Card 
                  className="profile-card"
                  sx={{ 
                    height: '100%',
                    overflow: 'visible',
                    position: 'relative',
                    pt: 4
                  }}
                >
                  {/* Avatar positioned half-above the card */}
                  <Box sx={{ 
                    display: 'flex',
                    justifyContent: 'center',
                    position: 'absolute',
                    top: -30,
                    left: 0,
                    right: 0
                  }}>
                    <Avatar
                      className="profile-avatar"
                      sx={{
                        background: gradientColors[getAvatarColor(profile.name)],
                      }}
                    >
                      {getInitials(profile.name)}
                    </Avatar>
                  </Box>

                  <CardActionArea 
                    onClick={() => handleProfileClick(profile.emp_id)}
                    sx={{ 
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'stretch',
                      borderRadius: '12px',
                      pt: 2
                    }}
                  >
                    <CardContent sx={{ pt: 2 }}>
                      <Box sx={{ textAlign: 'center', mb: 2 }}>
                        <Typography variant="h6" component="div" fontWeight="600">
                          {profile.name}
                        </Typography>
                        <Typography 
                          variant="subtitle1" 
                          color="secondary"
                          sx={{ mb: 0.5 }}
                        >
                          {profile.role}
                        </Typography>
                        <Chip 
                          size="small"
                          label={profile.grade}
                          color="primary"
                          variant="outlined"
                          sx={{ borderRadius: 3 }}
                        />
                      </Box>
                      
                      <Divider sx={{ my: 2 }} />
                      
                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                          <LocationOnIcon fontSize="small" sx={{ mr: 1.5, color: theme.palette.text.secondary }} />
                          <Typography variant="body2" color="text.secondary">
                            {profile.office || 'Remote'}
                          </Typography>
                        </Box>
                        
                        {profile.department && (
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                            <BusinessIcon fontSize="small" sx={{ mr: 1.5, color: theme.palette.text.secondary }} />
                            <Typography variant="body2" color="text.secondary">
                              {profile.department}
                            </Typography>
                          </Box>
                        )}
                        
                        {profile.education && (
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                            <SchoolIcon fontSize="small" sx={{ mr: 1.5, color: theme.palette.text.secondary }} />
                            <Typography variant="body2" color="text.secondary">
                              {profile.education}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                      
                      <Typography 
                        variant="body2" 
                        color="text.primary" 
                        sx={{ 
                          mb: 2,
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          height: '4.5em'
                        }}
                      >
                        {profile.description || 'No description available'}
                      </Typography>
                      
                      {profile.skills && profile.skills.length > 0 && (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                          {profile.skills.slice(0, 3).map((skill, idx) => (
                            <Chip
                              key={idx}
                              label={skill}
                              size="small"
                              variant="outlined"
                              className="corporate-badge"
                            />
                          ))}
                          {profile.skills.length > 3 && (
                            <Chip
                              label={`+${profile.skills.length - 3}`}
                              size="small"
                              color="primary"
                              className="corporate-badge"
                              variant="outlined"
                            />
                          )}
                        </Box>
                      )}
                      
                      {profile.similarity !== undefined && (
                        <Box 
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            mt: 2, 
                            bgcolor: 'rgba(0,0,0,0.02)', 
                            borderRadius: 2, 
                            p: 1
                          }}
                        >
                          <Tooltip title="Match score based on search">
                            <StarIcon sx={{ color: theme.palette.warning.main, mr: 1, fontSize: 20 }} />
                          </Tooltip>
                          
                          <Box sx={{ flex: 1 }}>
                            <Rating 
                              value={profile.similarity * 5} 
                              precision={0.5} 
                              readOnly 
                              size="small" 
                            />
                          </Box>
                          
                          {getSkillLevel(profile.similarity) && (
                            <Chip
                              label={getSkillLevel(profile.similarity).level}
                              size="small"
                              sx={{ 
                                height: 20, 
                                fontSize: '0.625rem',
                                bgcolor: `${getSkillLevel(profile.similarity).color}20`,
                                color: getSkillLevel(profile.similarity).color,
                                fontWeight: 600
                              }}
                            />
                          )}
                        </Box>
                      )}
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 4, 
                  textAlign: 'center',
                  borderRadius: 3,
                  border: `1px dashed ${theme.palette.divider}`,
                }}
              >
                <Box sx={{ mb: 2 }}>
                  <PersonIcon sx={{ fontSize: 60, color: theme.palette.text.secondary, opacity: 0.4 }} />
                </Box>
                <Typography variant="h6" gutterBottom>No Profiles Found</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 500, mx: 'auto', mb: 2 }}>
                  No staff profiles match your search criteria. Try adjusting your filters or search terms.
                </Typography>
                <Button 
                  variant="outlined" 
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedRole('');
                    setSelectedTool('');
                    navigate('/');
                  }}
                  sx={{ borderRadius: 3 }}
                >
                  Clear All Filters
                </Button>
              </Paper>
            </Grid>
          )}
        </Grid>
      )}
    </Container>
  );
};

export default HomePage;
