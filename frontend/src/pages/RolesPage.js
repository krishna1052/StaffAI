import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActionArea,
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
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  MenuItem,
  Snackbar
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import WorkIcon from '@mui/icons-material/Work';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import { getRoles, getProfilesByRole, createProfile } from '../services/api';

const RolesPage = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [roleProfiles, setRoleProfiles] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedRole, setExpandedRole] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [formData, setFormData] = useState({
    role: 'Data Engineer',
    grade: 'Consultant',
    start_date: '2025-05-01',
    end_date: '2025-09-30',
    office: 'New York',
    job_description: 'Looking for a data engineer with strong Python and machine learning skills.'
  });

  const handleOpenForm = () => {
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await createProfile(formData);
      setSnackbarMessage('Role added successfully!');
      setSnackbarOpen(true);
      handleCloseForm();
      
      // Refresh roles list
      fetchRoles();
    } catch (err) {
      console.error('Error creating profile:', err);
      setSnackbarMessage('Error adding role. Please try again.');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const rolesData = await getRoles();
      setRoles(rolesData);
      
      // Initialize roleProfiles with empty arrays
      const initialRoleProfiles = {};
      rolesData.forEach(role => {
        initialRoleProfiles[role] = [];
      });
      setRoleProfiles(initialRoleProfiles);
    } catch (err) {
      setError('Failed to fetch roles. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleRoleExpand = async (role) => {
    // Toggle expanded role
    const newExpandedRole = expandedRole === role ? null : role;
    setExpandedRole(newExpandedRole);
    
    // If expanding and no profiles loaded yet, fetch them
    if (newExpandedRole && roleProfiles[role].length === 0) {
      try {
        const profiles = await getProfilesByRole(role);
        setRoleProfiles(prev => ({
          ...prev,
          [role]: profiles
        }));
      } catch (err) {
        console.error(`Error fetching profiles for role ${role}:`, err);
        // Keep the accordion expanded but show an error
        setRoleProfiles(prev => ({
          ...prev,
          [role]: 'error'
        }));
      }
    }
  };

  const handleProfileClick = (id) => {
    navigate(`/profile/${id}`);
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Typography variant="h4" component="h1" gutterBottom>
              Roles
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Browse all available roles and see which staff members can play each role.
            </Typography>
          </div>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />}
            onClick={handleOpenForm}
          >
            Add Role
          </Button>
        </Box>
        
        <Divider sx={{ my: 3 }} />
        
        <Box sx={{ mt: 3 }}>
          {roles.length > 0 ? (
            roles.map((role) => (
              <Accordion 
                key={role} 
                expanded={expandedRole === role}
                onChange={() => handleRoleExpand(role)}
                sx={{ mb: 2 }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`${role}-content`}
                  id={`${role}-header`}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <WorkIcon color="primary" sx={{ mr: 2 }} />
                    <Typography variant="h6">{role}</Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  {roleProfiles[role] === 'error' ? (
                    <Alert severity="error">
                      Failed to load profiles for this role.
                    </Alert>
                  ) : roleProfiles[role].length === 0 ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                      <CircularProgress size={24} />
                    </Box>
                  ) : roleProfiles[role].length > 0 ? (
                    <List>
                      {roleProfiles[role].map((profile) => (
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
                            <Chip 
                              label="View Profile" 
                              color="primary" 
                              size="small" 
                              variant="outlined" 
                            />
                          </ListItemButton>
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No profiles found for this role.
                    </Typography>
                  )}
                </AccordionDetails>
              </Accordion>
            ))
          ) : (
            <Alert severity="info">
              No roles found in the system.
            </Alert>
          )}
        </Box>
      </Box>

      {/* Add Role Form Dialog */}
      <Dialog 
        open={openForm} 
        onClose={handleCloseForm} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            maxHeight: '90vh',
            overflowY: 'auto'
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>Add New Role</DialogTitle>
        <form onSubmit={handleFormSubmit}>
          <DialogContent sx={{ pt: 1 }}>
            <DialogContentText sx={{ mb: 3 }}>
              Add a new role with the required details below.
            </DialogContentText>
            
            {/* Simplified layout for better visibility */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>Role Details</Typography>
              <TextField
                name="role"
                label="Role"
                fullWidth
                variant="outlined"
                value={formData.role}
                onChange={handleFormChange}
                required
                sx={{ mb: 2, mt: 1 }}
              />
              
              <TextField
                name="grade"
                label="Grade"
                fullWidth
                variant="outlined"
                value={formData.grade}
                onChange={handleFormChange}
                required
                select
                sx={{ mb: 2 }}
              >
                <MenuItem value="Intern">Intern</MenuItem>
                <MenuItem value="Junior">Junior</MenuItem>
                <MenuItem value="Mid">Mid</MenuItem>
                <MenuItem value="Senior">Senior</MenuItem>
                <MenuItem value="Lead">Lead</MenuItem>
                <MenuItem value="Consultant">Consultant</MenuItem>
                <MenuItem value="Manager">Manager</MenuItem>
              </TextField>
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>Timeline</Typography>
              <TextField
                name="start_date"
                label="Start Date"
                type="date"
                fullWidth
                variant="outlined"
                value={formData.start_date}
                onChange={handleFormChange}
                required
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{ mb: 2, mt: 1 }}
              />
              
              <TextField
                name="end_date"
                label="End Date"
                type="date"
                fullWidth
                variant="outlined"
                value={formData.end_date}
                onChange={handleFormChange}
                required
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{ mb: 2 }}
              />
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>Location</Typography>
              <TextField
                name="office"
                label="Office Location"
                fullWidth
                variant="outlined"
                value={formData.office}
                onChange={handleFormChange}
                required
                select
                sx={{ mb: 2, mt: 1 }}
              >
                <MenuItem value="New York">New York</MenuItem>
                <MenuItem value="San Francisco">San Francisco</MenuItem>
                <MenuItem value="London">London</MenuItem>
                <MenuItem value="Berlin">Berlin</MenuItem>
                <MenuItem value="Tokyo">Tokyo</MenuItem>
                <MenuItem value="Sydney">Sydney</MenuItem>
                <MenuItem value="Singapore">Singapore</MenuItem>
                <MenuItem value="Bangalore">Bangalore</MenuItem>
              </TextField>
            </Box>
            
            <Box>
              <Typography variant="subtitle2" gutterBottom>Description</Typography>
              <TextField
                name="job_description"
                label="Job Description"
                fullWidth
                variant="outlined"
                value={formData.job_description}
                onChange={handleFormChange}
                required
                multiline
                rows={4}
                sx={{ mb: 1, mt: 1 }}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button onClick={handleCloseForm} color="inherit">Cancel</Button>
            <Button type="submit" color="primary" variant="contained">Add Role</Button>
          </DialogActions>
        </form>
      </Dialog>
      
      {/* Success/Error Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </Container>
  );
};

export default RolesPage;
