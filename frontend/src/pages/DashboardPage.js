import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
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
  Paper,
  Button,
  Fade,
  useTheme,
  Avatar,
  Divider
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import WorkIcon from '@mui/icons-material/Work';
import BusinessIcon from '@mui/icons-material/Business';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import GradingIcon from '@mui/icons-material/Grading';
import DateRangeIcon from '@mui/icons-material/DateRange';
import DescriptionIcon from '@mui/icons-material/Description';
import { getRoles, getTools, sendMessages } from '../services/api';

// Helper function to parse query parameters
const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const DashboardPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const query = useQuery();
  const searchParam = query.get('search');

  const [searchQuery, setSearchQuery] = useState(searchParam || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchType, setSearchType] = useState('text'); // 'text' or 'vector'
  const [roles, setRoles] = useState([]);
  const [tools, setTools] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedTool, setSelectedTool] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [hasFiltered, setHasFiltered] = useState(false);
  const [startingConversation, setStartingConversation] = useState(false);
  
  // New state for additional filter fields
  const [grade, setGrade] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [office, setOffice] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  
  // Sample grades and offices (replace with API data in production)
  const grades = ['Associate', 'Consultant', 'Senior Consultant', 'Manager', 'Senior Manager', 'Director'];
  const offices = ['New York', 'London', 'Tokyo', 'Singapore', 'Sydney', 'Berlin', 'Paris'];

  // Fetch roles and tools for filters on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch roles and tools for filters
        const rolesData = await getRoles();
        const toolsData = await getTools();
        setRoles(rolesData);
        setTools(toolsData);
      } catch (err) {
        setError('Failed to fetch filter data. Please try again later.');
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // Build query parameters
    const params = new URLSearchParams();
    
    if (searchQuery.trim()) {
      params.append('search', searchQuery);
    }
    
    if (selectedRole) {
      params.append('role', selectedRole);
    }
    
    if (selectedTool) {
      params.append('skill', selectedTool);
    }
    
    if (grade) {
      params.append('grade', grade);
    }
    
    if (startDate) {
      params.append('startDate', startDate);
    }
    
    if (endDate) {
      params.append('endDate', endDate);
    }
    
    if (office) {
      params.append('office', office);
    }
    
    if (jobDescription) {
      params.append('jobDescription', jobDescription);
    }
    
    // Update URL with query parameters
    navigate(`/?${params.toString()}`);
    
    try {
      // Create filters object for API call
      const filters = {
        query: searchQuery.trim(),
        role: selectedRole,
        skill: selectedTool,
        grade: grade,
        office: office,
        startDate: startDate,
        endDate: endDate,
        jobDescription: jobDescription
      };
      
      // Mock search results for demonstration
      // In a real app, we would use the searchProfilesWithFilters API
      // const results = await searchProfilesWithFilters(filters);
      
      // Mock data for demonstration
      const mockResults = [
        {
          id: '1',
          name: 'John Smith',
          role: 'Frontend Developer',
          skills: ['React', 'JavaScript', 'CSS'],
          grade: 'Senior Consultant',
          office: 'London'
        },
        {
          id: '2',
          name: 'Sarah Johnson',
          role: 'UI/UX Designer',
          skills: ['Figma', 'Adobe XD', 'User Research'],
          grade: 'Consultant',
          office: 'New York'
        },
        {
          id: '3',
          name: 'Michael Chen',
          role: 'Backend Developer',
          skills: ['Node.js', 'Express', 'MongoDB'],
          grade: 'Manager',
          office: 'Singapore'
        }
      ];
      
      setSearchResults(mockResults);
      setHasFiltered(true);
      setLoading(false);
    } catch (err) {
      setError('Failed to search profiles. Please try again.');
      console.error(err);
      setLoading(false);
    }
  };
  
  const handleStartConversation = async () => {
    if (searchResults.length === 0) return;
    
    setStartingConversation(true);
    try {
      // Get profile IDs from search results
      const profileIds = searchResults.map(profile => profile.id);
      
      // Determine role to offer based on filters
      const roleToOffer = selectedRole || "Available Position";
      
      // In a real app, we would call the API
      // await sendMessages(profileIds, roleToOffer, jobDescription);
      
      // For demonstration, use setTimeout to simulate API call
      setTimeout(() => {
        // Navigate to messages page after sending
        navigate('/messages');
        setStartingConversation(false);
      }, 1500);
    } catch (err) {
      setError('Failed to start conversation. Please try again.');
      console.error(err);
      setStartingConversation(false);
    }
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
  
  const clearAllFilters = () => {
    setSelectedRole('');
    setSelectedTool('');
    setGrade('');
    setStartDate('');
    setEndDate('');
    setOffice('');
    setJobDescription('');
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 8, mb: 8 }} className="fade-in">
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography 
          variant="h3" 
          component="h1" 
          fontWeight="600" 
          className="section-heading"
          sx={{ color: theme.palette.text.primary, mb: 2 }}
        >
          Staff Search Dashboard
        </Typography>
        <Typography 
          variant="body1" 
          color="text.secondary" 
          sx={{ maxWidth: 700, mx: 'auto' }}
        >
          Find staff profiles across the organization using advanced search options.
        </Typography>
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
                {/* Row 1: Role and Skill */}
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
                
                {/* Row 2: Grade and Office */}
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="grade-filter-label">Grade</InputLabel>
                    <Select
                      labelId="grade-filter-label"
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      label="Grade"
                      sx={{ borderRadius: 3 }}
                      startAdornment={<GradingIcon color="action" sx={{ ml: 1, mr: 1 }} />}
                    >
                      <MenuItem value="">
                        <em>All Grades</em>
                      </MenuItem>
                      {grades.map((g) => (
                        <MenuItem key={g} value={g}>
                          {g}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="office-filter-label">Office</InputLabel>
                    <Select
                      labelId="office-filter-label"
                      value={office}
                      onChange={(e) => setOffice(e.target.value)}
                      label="Office"
                      sx={{ borderRadius: 3 }}
                      startAdornment={<LocationOnIcon color="action" sx={{ ml: 1, mr: 1 }} />}
                    >
                      <MenuItem value="">
                        <em>All Offices</em>
                      </MenuItem>
                      {offices.map((o) => (
                        <MenuItem key={o} value={o}>
                          {o}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                {/* Row 3: Start Date and End Date */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Start Date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <DateRangeIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ borderRadius: 3 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="End Date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <DateRangeIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ borderRadius: 3 }}
                  />
                </Grid>
                
                {/* Row 4: Job Description */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Job Description"
                    multiline
                    rows={2}
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Enter job description or keywords..."
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <DescriptionIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ borderRadius: 3 }}
                  />
                </Grid>
              </Grid>
              
              {/* Active filters display */}
              {(selectedRole || selectedTool || grade || startDate || endDate || office || jobDescription) && (
                <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
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
                  {grade && (
                    <Chip 
                      label={`Grade: ${grade}`} 
                      onDelete={() => setGrade('')}
                      size="small"
                      color="info"
                      variant="outlined"
                    />
                  )}
                  {office && (
                    <Chip 
                      label={`Office: ${office}`} 
                      onDelete={() => setOffice('')}
                      size="small"
                      color="warning"
                      variant="outlined"
                    />
                  )}
                  {startDate && (
                    <Chip 
                      label={`Start: ${startDate}`} 
                      onDelete={() => setStartDate('')}
                      size="small"
                      color="success"
                      variant="outlined"
                    />
                  )}
                  {endDate && (
                    <Chip 
                      label={`End: ${endDate}`} 
                      onDelete={() => setEndDate('')}
                      size="small"
                      color="success"
                      variant="outlined"
                    />
                  )}
                  {jobDescription && (
                    <Chip 
                      label="Job Description" 
                      onDelete={() => setJobDescription('')}
                      size="small"
                      color="default"
                      variant="outlined"
                    />
                  )}
                  
                  <Button 
                    size="small" 
                    onClick={clearAllFilters}
                    variant="text" 
                    color="primary"
                    sx={{ ml: 'auto' }}
                  >
                    Clear All
                  </Button>
                </Box>
              )}
            </Box>
          </Fade>
        </form>
      </Paper>

      {/* Dashboard Stats or Search Results Section */}
      {!hasFiltered ? (
        // Show dashboard stats when no search has been performed
        <Grid container spacing={3} sx={{ mt: 4 }}>
          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                textAlign: 'center',
                background: 'linear-gradient(45deg, #3498db 0%, #2980b9 100%)',
                color: 'white',
              }}
            >
              <DashboardIcon sx={{ fontSize: 48, mb: 2, opacity: 0.9 }} />
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                Staff Search
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Use the search bar above to find staff members
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                textAlign: 'center',
                background: 'linear-gradient(45deg, #16a085 0%, #27ae60 100%)',
                color: 'white',
              }}
            >
              <WorkIcon sx={{ fontSize: 48, mb: 2, opacity: 0.9 }} />
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                Role Search
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Filter by role to find staff with specific positions
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                textAlign: 'center',
                background: 'linear-gradient(45deg, #e74c3c 0%, #c0392b 100%)',
                color: 'white',
              }}
            >
              <BusinessIcon sx={{ fontSize: 48, mb: 2, opacity: 0.9 }} />
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                Skill Search
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Filter by skill to find staff with specific expertise
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      ) : (
        // Show search results when search has been performed
        <Box sx={{ mt: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" component="h2" fontWeight="600">
              Search Results
            </Typography>
            
            {/* Start Conversation Button */}
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleStartConversation}
              disabled={startingConversation || searchResults.length === 0}
              startIcon={startingConversation ? <CircularProgress size={20} color="inherit" /> : null}
              sx={{
                borderRadius: 2,
                py: 1,
                px: 3,
                boxShadow: '0 4px 10px rgba(44, 62, 80, 0.15)',
                background: 'linear-gradient(45deg, #16a085 0%, #27ae60 100%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1abc9c 0%, #2ecc71 100%)',
                },
              }}
            >
              {startingConversation ? 'Starting...' : 'Start Conversation'}
            </Button>
          </Box>
          
          {/* Error message if any */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          
          {/* Loading indicator */}
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          )}
          
          {/* Search results */}
          {!loading && searchResults.length > 0 ? (
            <Grid container spacing={3}>
              {searchResults.map((profile) => (
                <Grid item xs={12} md={6} lg={4} key={profile.id}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      border: '1px solid',
                      borderColor: theme.palette.divider,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 5px 15px rgba(0,0,0,0.08)',
                        borderColor: theme.palette.primary.light,
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar 
                        sx={{ 
                          width: 56, 
                          height: 56,
                          mr: 2,
                          background: `linear-gradient(135deg, #3498db 0%, #2980b9 100%)`
                        }}
                      >
                        {profile.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight="600">
                          {profile.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {profile.role} • {profile.grade}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {profile.office}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Skills:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {profile.skills?.map((skill, index) => (
                          <Chip 
                            key={index} 
                            label={skill} 
                            size="small" 
                            color={skill === selectedTool ? "primary" : "default"}
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          ) : !loading && (
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 3,
                textAlign: 'center',
                border: '1px dashed',
                borderColor: theme.palette.divider,
              }}
            >
              <Typography variant="h6" color="text.secondary">
                No matching results found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Try adjusting your search filters
              </Typography>
            </Paper>
          )}
        </Box>
      )}
    </Container>
  );
};

export default DashboardPage;
