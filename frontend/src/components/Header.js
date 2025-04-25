import React, { useState } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  InputBase,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Divider,
  Avatar,
  Tooltip,
  Stack,
  Paper,
  useScrollTrigger,
  Slide,
  Badge
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import WorkIcon from '@mui/icons-material/Work';
import BuildIcon from '@mui/icons-material/Build';
import BusinessIcon from '@mui/icons-material/Business';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EmailIcon from '@mui/icons-material/Email';

// Hide app bar on scroll
const HideOnScroll = ({ children }) => {
  const trigger = useScrollTrigger();
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
};

// Logo component
const Logo = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  fontWeight: 700,
  color: theme.palette.common.white,
  marginRight: theme.spacing(3),
  '& .logo-text': {
    fontSize: '1.5rem',
    fontWeight: 600,
    letterSpacing: '-0.5px'
  },
  '& .logo-icon': {
    backgroundColor: theme.palette.secondary.main,
    width: 34,
    height: 34,
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing(1),
    boxShadow: '0 2px 8px rgba(22, 160, 133, 0.3)'
  }
}));

// Styled search component
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius * 3,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  transition: 'all 0.3s',
  border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: alpha(theme.palette.common.white, 0.65),
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: alpha(theme.palette.common.white, 0.9),
  '::placeholder': {
    color: alpha(theme.palette.common.white, 0.6),
    opacity: 1
  },
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create(['width', 'border-color']),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '25ch',
      '&:focus': {
        width: '35ch',
      },
    },
  },
}));

// Styled navigation button
const NavButton = styled(Button)(({ theme, active }) => ({
  fontWeight: 500,
  marginLeft: theme.spacing(0.5),
  marginRight: theme.spacing(0.5),
  borderRadius: theme.shape.borderRadius * 1.5,
  padding: theme.spacing(0.75, 2),
  color: theme.palette.common.white,
  position: 'relative',
  opacity: active ? 1 : 0.85,
  '&:hover': {
    opacity: 1,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
  },
  ...(active && {
    '&:after': {
      content: '""',
      position: 'absolute',
      bottom: 6,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '20px',
      height: '3px',
      backgroundColor: theme.palette.secondary.main,
      borderRadius: '2px',
    },
  }),
}));

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState(null);
  
  const isMobileMenuOpen = Boolean(mobileMenuAnchorEl);
  
  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchorEl(event.currentTarget);
  };
  
  const handleMobileMenuClose = () => {
    setMobileMenuAnchorEl(null);
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  // Check if the route is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <HideOnScroll>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar 
          position="static" 
          elevation={0}
          sx={{ 
            background: 'linear-gradient(135deg, #2c3e50 0%, #3e5871 100%)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <Toolbar sx={{ height: 70 }}>
            <Logo component={RouterLink} to="/">
              <div className="logo-icon">
                <BusinessIcon fontSize="small" />
              </div>
              <Typography
                variant="h6"
                noWrap
                component={RouterLink}
                to="/"
                className="logo-text"
                sx={{
                  display: { xs: 'none', sm: 'block' },
                  textDecoration: 'none',
                  color: 'inherit'
                }}
              >
                StaffAI
              </Typography>
            </Logo>

            <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: 500, display: 'flex' }}>
              <Search>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Search staff by name, role or skills..."
                  inputProps={{ 'aria-label': 'search' }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  fullWidth
                />
              </Search>
            </form>
            
            <Box sx={{ flexGrow: 1 }} />
            
            <Stack direction="row" spacing={0} sx={{ display: { xs: 'none', md: 'flex' } }}>
              <NavButton
                component={RouterLink}
                to="/"
                startIcon={<PersonIcon />}
                active={isActive('/')}
              >
                Profiles
              </NavButton>
              <NavButton
                component={RouterLink}
                to="/roles"
                startIcon={<WorkIcon />}
                active={isActive('/roles')}
              >
                Roles
              </NavButton>
              <NavButton
                component={RouterLink}
                to="/tools"
                startIcon={<BuildIcon />}
                active={isActive('/tools')}
              >
                Skills
              </NavButton>
              <NavButton
                component={RouterLink}
                to="/dashboard"
                startIcon={<DashboardIcon />}
                active={isActive('/dashboard')}
              >
                Dashboard
              </NavButton>
              <NavButton
                component={RouterLink}
                to="/messages"
                startIcon={<EmailIcon />}
                active={isActive('/messages')}
              >
                Messages
              </NavButton>
            </Stack>

            <Divider orientation="vertical" flexItem sx={{ mx: 2, display: { xs: 'none', md: 'block' }, borderColor: 'rgba(255, 255, 255, 0.15)' }} />
            
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <Tooltip title="Admin Profile">
                <IconButton sx={{ 
                  ml: 1, 
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                  }
                }}>
                  <Badge
                    color="secondary"
                    variant="dot"
                    overlap="circular"
                  >
                    <Avatar 
                      sx={{ 
                        width: 34, 
                        height: 34,
                        background: 'linear-gradient(45deg, #16a085 0%, #1abc9c 100%)',
                        color: '#fff',
                        fontWeight: 600,
                      }}
                      alt="Admin"
                    >
                      A
                    </Avatar>
                  </Badge>
                </IconButton>
              </Tooltip>
            </Box>
            
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="show more"
                aria-controls="mobile-menu"
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
                sx={{ 
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                  }
                }}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
        
        <Menu
          id="mobile-menu"
          anchorEl={mobileMenuAnchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={isMobileMenuOpen}
          onClose={handleMobileMenuClose}
          PaperProps={{
            elevation: 3,
            sx: {
              minWidth: 220,
              mt: 1.5,
              borderRadius: 2,
              overflow: 'hidden'
            }
          }}
        >
          <Box sx={{ py: 1, px: 2, bgcolor: 'primary.dark' }}>
            <Typography variant="subtitle1" color="common.white" fontWeight="500">
              Menu
            </Typography>
          </Box>

          <MenuItem onClick={() => { navigate('/'); handleMobileMenuClose(); }} selected={isActive('/')}>
            <PersonIcon color="primary" sx={{ mr: 2, fontSize: 20 }} />
            <Typography variant="body1">Profiles</Typography>
          </MenuItem>
          <Divider sx={{ my: 0.5 }} />
          <MenuItem onClick={() => { navigate('/roles'); handleMobileMenuClose(); }} selected={isActive('/roles')}>
            <WorkIcon color="primary" sx={{ mr: 2, fontSize: 20 }} />
            <Typography variant="body1">Roles</Typography>
          </MenuItem>
          <Divider sx={{ my: 0.5 }} />
          <MenuItem onClick={() => { navigate('/tools'); handleMobileMenuClose(); }} selected={isActive('/tools')}>
            <BuildIcon color="primary" sx={{ mr: 2, fontSize: 20 }} />
            <Typography variant="body1">Skills</Typography>
          </MenuItem>
          <Divider sx={{ my: 0.5 }} />
          <MenuItem onClick={() => { navigate('/dashboard'); handleMobileMenuClose(); }} selected={isActive('/dashboard')}>
            <DashboardIcon color="primary" sx={{ mr: 2, fontSize: 20 }} />
            <Typography variant="body1">Dashboard</Typography>
          </MenuItem>
          <Divider sx={{ my: 0.5 }} />
          <MenuItem onClick={() => { navigate('/messages'); handleMobileMenuClose(); }} selected={isActive('/messages')}>
            <EmailIcon color="primary" sx={{ mr: 2, fontSize: 20 }} />
            <Typography variant="body1">Messages</Typography>
          </MenuItem>
          <Divider sx={{ my: 0.5 }} />
          <MenuItem sx={{ mt: 1 }}>
            <Avatar 
              sx={{ 
                width: 28, 
                height: 28, 
                mr: 2,
                background: 'linear-gradient(45deg, #16a085 0%, #1abc9c 100%)',
              }}
            >
              A
            </Avatar>
            <Typography variant="body1">Admin Profile</Typography>
          </MenuItem>
        </Menu>
      </Box>
    </HideOnScroll>
  );
};

export default Header;
