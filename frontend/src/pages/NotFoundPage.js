import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const NotFoundPage = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 8, mb: 4 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          textAlign: 'center'
        }}
      >
        <ErrorOutlineIcon sx={{ fontSize: 100, color: 'error.main', mb: 2 }} />
        
        <Typography variant="h3" component="h1" gutterBottom>
          404: Page Not Found
        </Typography>
        
        <Typography variant="body1" paragraph sx={{ mb: 4 }}>
          The page you are looking for doesn't exist or has been moved.
        </Typography>
        
        <Button
          variant="contained"
          color="primary"
          component={RouterLink}
          to="/"
          startIcon={<HomeIcon />}
          size="large"
        >
          Back to Home
        </Button>
      </Paper>
    </Container>
  );
};

export default NotFoundPage;
