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
  useTheme,
  Modal,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import WorkIcon from '@mui/icons-material/Work';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FilterListIcon from '@mui/icons-material/FilterList';
import BusinessIcon from '@mui/icons-material/Business';
import SchoolIcon from '@mui/icons-material/School';
import StarIcon from '@mui/icons-material/Star';
import GradingIcon from '@mui/icons-material/Grading';
import DateRangeIcon from '@mui/icons-material/DateRange';
import DescriptionIcon from '@mui/icons-material/Description';
import ChatIcon from '@mui/icons-material/Chat';
import SendIcon from '@mui/icons-material/Send';
import EmailIcon from '@mui/icons-material/Email';
import { getProfiles, searchProfiles, searchProfilesWithFilters, vectorSearchProfiles, getRoles, getTools, sendMessages } from '../services/api';

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
  const roleParam = query.get('role');
  const skillParam = query.get('skill');
  const gradeParam = query.get('grade');
  const officeParam = query.get('office');
  const startDateParam = query.get('startDate');
  const endDateParam = query.get('endDate');
  const jobDescriptionParam = query.get('jobDescription');

  const [profiles, setProfiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState(searchParam || '');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchType, setSearchType] = useState('text'); // 'text' or 'vector'
  const [roles, setRoles] = useState([]);
  const [tools, setTools] = useState([]);
  const [selectedRole, setSelectedRole] = useState(roleParam || '');
  const [selectedTool, setSelectedTool] = useState(skillParam || '');
  const [filterOpen, setFilterOpen] = useState(false);
  
  // New state for additional filter fields
  const [grade, setGrade] = useState(gradeParam || '');
  const [startDate, setStartDate] = useState(startDateParam || '');
  const [endDate, setEndDate] = useState(endDateParam || '');
  const [office, setOffice] = useState(officeParam || '');
  const [jobDescription, setJobDescription] = useState(jobDescriptionParam || '');
  
  // States for profile selection and messaging
  const [selectedProfiles, setSelectedProfiles] = useState([]);
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [roleInput, setRoleInput] = useState('');
  const [additionalMessage, setAdditionalMessage] = useState('');
  const [messageSending, setMessageSending] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  
  // Sample grades and offices (replace with API data in production)
  const grades = ['Associate', 'Consultant', 'Senior Consultant', 'Manager', 'Senior Manager', 'Director'];
  const offices = ['New York', 'London', 'Tokyo', 'Singapore', 'Sydney', 'Berlin', 'Paris'];

  // Fetch profiles on component mount or when search param changes
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let results;
        // Use filters if they exist
        if (searchParam || roleParam || skillParam || gradeParam || officeParam || startDateParam || endDateParam || jobDescriptionParam) {
          // Collect all query parameters
          const filters = {
            query: searchParam,
            role: roleParam,
            skill: skillParam,
            grade: gradeParam,
            office: officeParam,
            startDate: startDateParam,
            endDate: endDateParam,
            jobDescription: jobDescriptionParam
          };
          
          results = await searchProfilesWithFilters(filters);
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
  }, [searchParam, roleParam, skillParam, gradeParam, officeParam, startDateParam, endDateParam, jobDescriptionParam]);

  // Handle profile selection for messaging
  const handleProfileSelection = (profile) => {
    const isSelected = selectedProfiles.some(p => p.emp_id === profile.emp_id);
    if (isSelected) {
      // Remove from selection
      setSelectedProfiles(selectedProfiles.filter(p => p.emp_id !== profile.emp_id));
    } else {
      // Add to selection
      setSelectedProfiles([...selectedProfiles, profile]);
    }
  };

  // Open message dialog
  const handleOpenMessageDialog = () => {
    setMessageDialogOpen(true);
    setRoleInput(selectedRole || '');
    setMessageSent(false);
  };

  // Close message dialog
  const handleCloseMessageDialog = () => {
    setMessageDialogOpen(false);
    setRoleInput('');
    setAdditionalMessage('');
    setMessageSent(false);
  };

  // Send message to selected profiles
  const handleSendMessage = async () => {
    setMessageSending(true);
    setError(null);
    
    try {
      // Extract profile IDs from selected profiles
      const profileIds = selectedProfiles.map(profile => profile.emp_id);
      
      // Send message using API
      await sendMessages(profileIds, roleInput, additionalMessage);
      
      setMessageSending(false);
      setMessageSent(true);
      
      // After successful send, close dialog after a short delay
      setTimeout(() => {
        setMessageDialogOpen(false);
        setSelectedProfiles([]);
        setRoleInput('');
        setAdditionalMessage('');
      }, 2000);
    } catch (err) {
      setMessageSending(false);
      setError('Failed to send messages. Please try again later.');
      console.error('Error sending messages:', err);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      let results;
      // Collect all filters
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
      
      // Use vector search or filtered search based on search type
      if (searchType === 'vector' && searchQuery.trim()) {
        results = await vectorSearchProfiles(searchQuery);
      } else {
        results = await searchProfilesWithFilters(filters);
      }
      
      // Build query parameters
      const params = new URLSearchParams();
      
      // Add all non-empty filters to query parameters
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          // Convert 'query' param to 'search' for URL consistency
          const paramName = key === 'query' ? 'search' : key;
          params.append(paramName, value);
        }
      });
      
      // Navigate with all query parameters
      const queryString = params.toString();
      navigate(queryString ? `/?${queryString}` : '/');
      
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
  
  const clearAllFilters = () => {
    setSelectedRole('');
    setSelectedTool('');
    setGrade('');
    setStartDate('');
    setEndDate('');
    setOffice('');
    setJobDescription('');
  };

  // Use the profiles directly since they've already been filtered by the API
  const filteredProfiles = profiles;

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
                  {/* Selection checkbox */}
                  <Checkbox
                    checked={selectedProfiles.some(p => p.emp_id === profile.emp_id)}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleProfileSelection(profile);
                    }}
                    sx={{ 
                      position: 'absolute', 
                      top: 8, 
                      right: 8, 
                      zIndex: 2,
                      '& .MuiSvgIcon-root': { fontSize: 20 }
                    }}
                    color="primary"
                  />

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
                    clearAllFilters();
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
      
      {/* Start Conversation Button - shows when profiles are selected */}
      {selectedProfiles.length > 0 && (
        <Box sx={{ 
          position: 'sticky', 
          bottom: 20, 
          display: 'flex', 
          justifyContent: 'center', 
          mt: 3, 
          zIndex: 10 
        }}>
          <Paper
            elevation={3}
            sx={{
              borderRadius: 8,
              py: 2,
              px: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              bgcolor: 'primary.main',
              color: 'white',
              boxShadow: '0 8px 32px rgba(44, 62, 80, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              width: { xs: '95%', sm: 450 }
            }}
          >
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
                {selectedProfiles.length} {selectedProfiles.length === 1 ? 'profile' : 'profiles'} selected
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8, fontSize: '0.85rem' }}>
                Send a message to the selected staff
              </Typography>
            </Box>
            <Button 
              variant="contained" 
              color="secondary" 
              onClick={handleOpenMessageDialog}
              startIcon={<ChatIcon />}
              sx={{ 
                borderRadius: 4,
                boxShadow: theme.shadows[5],
                py: 1,
                fontSize: '0.9rem'
              }}
            >
              Start Conversation
            </Button>
          </Paper>
        </Box>
      )}
      
      {/* Message Dialog */}
      <Dialog
        open={messageDialogOpen}
        onClose={handleCloseMessageDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ pb: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <EmailIcon sx={{ mr: 1, color: theme.palette.secondary.main }} />
            <Typography variant="h6" component="div">
              Send Message to Selected Staff
            </Typography>
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Selected Recipients ({selectedProfiles.length}):
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {selectedProfiles.map(profile => (
                <Chip 
                  key={profile.emp_id}
                  avatar={
                    <Avatar sx={{ bgcolor: gradientColors[getAvatarColor(profile.name)] }}>
                      {getInitials(profile.name)}
                    </Avatar>
                  }
                  label={profile.name}
                  variant="outlined"
                  onDelete={() => handleProfileSelection(profile)}
                />
              ))}
            </Box>
          </Box>
          
          <TextField
            fullWidth
            label="Role Being Offered"
            value={roleInput}
            onChange={(e) => setRoleInput(e.target.value)}
            margin="normal"
            variant="outlined"
            required
          />
          
          <TextField
            fullWidth
            label="Additional Message (Optional)"
            value={additionalMessage}
            onChange={(e) => setAdditionalMessage(e.target.value)}
            margin="normal"
            variant="outlined"
            multiline
            rows={4}
            placeholder="Include any additional details about the role..."
          />
          
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1">
              Preview message:
            </Typography>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 2, 
                mt: 1,
                bgcolor: 'rgba(0, 0, 0, 0.02)',
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2
              }}
            >
              <Typography variant="body1" paragraph>
                There is a role <strong>{roleInput || '[Role name]'}</strong> - are you willing to join the project?
              </Typography>
              {additionalMessage && (
                <Typography variant="body2" color="text.secondary">
                  {additionalMessage}
                </Typography>
              )}
            </Paper>
          </Box>
          
          {messageSent && (
            <Alert severity="success" sx={{ mt: 3 }}>
              Messages sent successfully!
            </Alert>
          )}
        </DialogContent>
        
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleCloseMessageDialog} variant="outlined">
            Cancel
          </Button>
          <Button 
            onClick={handleSendMessage} 
            variant="contained" 
            color="primary" 
            startIcon={messageSending ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
            disabled={!roleInput.trim() || messageSending || messageSent}
          >
            {messageSending ? 'Sending...' : messageSent ? 'Sent!' : 'Send Message'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default HomePage;
