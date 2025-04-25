import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Chip,
  Divider,
  Button,
  CircularProgress,
  Alert,
  Paper,
  Rating,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';
import WorkIcon from '@mui/icons-material/Work';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BuildIcon from '@mui/icons-material/Build';
import StarIcon from '@mui/icons-material/Star';
import { getProfileById } from '../services/api';

const ProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const data = await getProfileById(id);
        setProfile(data);
      } catch (err) {
        setError('Failed to fetch profile details. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  const handleBack = () => {
    navigate(-1);
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
        <Box sx={{ mt: 2 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
          >
            Back
          </Button>
        </Box>
      </Container>
    );
  }

  if (!profile) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="info" sx={{ mt: 2 }}>
          Profile not found.
        </Alert>
        <Box sx={{ mt: 2 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
          >
            Back
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mb: 2 }}
        >
          Back
        </Button>
        
        <Paper sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Avatar
                  sx={{
                    width: 120,
                    height: 120,
                    bgcolor: 'primary.main',
                    fontSize: '3rem',
                    mb: 2,
                  }}
                >
                  {profile.name.charAt(0)}
                </Avatar>
                <Typography variant="h5" component="h1" gutterBottom>
                  {profile.name}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                  {profile.role}
                </Typography>
                <Chip
                  label={profile.grade}
                  color="primary"
                  variant="outlined"
                  sx={{ mt: 1 }}
                />
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                  <LocationOnIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {profile.office}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={8}>
              <Typography variant="h6" gutterBottom>
                Profile Overview
              </Typography>
              <Typography variant="body1" paragraph>
                {profile.description}
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="h6" gutterBottom>
                Roles
              </Typography>
              <Box sx={{ mb: 2 }}>
                {profile.roles && profile.roles.length > 0 ? (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {profile.roles.map((role) => (
                      <Chip
                        key={role}
                        icon={<WorkIcon />}
                        label={role}
                        variant="outlined"
                        sx={{ m: 0.5 }}
                      />
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No roles specified.
                  </Typography>
                )}
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="h6" gutterBottom>
                Skills
              </Typography>
              {profile.skills && profile.skills.length > 0 ? (
                <List>
                  {profile.skills.sort((a, b) => b.rating - a.rating).map((skill) => (
                    <ListItem key={skill.name} disablePadding sx={{ mb: 1 }}>
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <BuildIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={skill.name} 
                        primaryTypographyProps={{ variant: 'body1' }}
                      />
                      <Rating
                        value={skill.rating}
                        readOnly
                        size="small"
                        emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No skills specified.
                </Typography>
              )}
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};

export default ProfilePage;
