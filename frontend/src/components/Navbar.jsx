import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import api from '../utils/api';
import logo from '../assets/final_logo.png';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Logout as LogoutIcon,
  ShoppingBag as ShoppingBagIcon,
  Home as HomeIcon,
  Info as InfoIcon,
  ContactMail as ContactMailIcon,
  Build as BuildIcon,
  Category as CategoryIcon
} from '@mui/icons-material';

export default function Navbar() {
  const { isAdmin, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [storeName, setStoreName] = useState('Swift Solutions');
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const fetchStoreName = async () => {
      try {
        const { data } = await api.get('/settings');
        if (data.data?.storeName) {
          setStoreName(data.data.storeName);
        }
      } catch (err) {
        // Silently fail — use default name
      }
    };
    fetchStoreName();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    handleMenuClose();
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Split store name for color styling — first word gets primary color
  const nameParts = storeName.split(' ');
  const firstName = nameParts[0] || 'Swift';
  const restName = nameParts.slice(1).join(' ') || 'Solutions';

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{
        bgcolor: 'white',
        borderBottom: '1px solid',
        borderColor: '#e2e8f0',
        zIndex: 1100,
        fontFamily: "'Inter', 'Segoe UI', system-ui, -apple-system, BlinkMacSystemFont, 'Roboto', sans-serif"
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ py: { xs: 1, md: 1.5 } }}>
          {/* Logo/Brand - Mobile */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', flexGrow: 1 }}>
            <img 
              src={logo} 
              alt="Logo" 
              style={{ 
                height: '32px', 
                width: 'auto',
                marginRight: '10px'
              }} 
            />
            <Typography
              variant="h6"
              component={Link}
              to="/"
              sx={{
                fontFamily: "'Poppins', 'Inter', 'Segoe UI', sans-serif",
                fontWeight: 700,
                fontSize: '1.35rem',
                letterSpacing: '-0.01em',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.02)',
                  opacity: 0.9
                }
              }}
            >
              <span style={{ color: theme.palette.primary.main }}>{firstName}</span>
              {restName && <span style={{ color: '#1e293b' }}>{restName}</span>}
            </Typography>
          </Box>

          {/* Mobile menu button */}
          <IconButton
            onClick={handleMenuOpen}
            sx={{ 
              display: { xs: 'flex', md: 'none' }, 
              color: 'primary.main',
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: 'primary.light',
                color: 'white',
                transform: 'rotate(90deg)'
              }
            }}
          >
            <MenuIcon />
          </IconButton>

          {/* Logo/Brand - Desktop */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', mr: 5 }}>
            <img 
              src={logo} 
              alt="Logo" 
              style={{ 
                height: '44px', 
                width: 'auto',
                marginRight: '14px'
              }} 
            />
            <Typography
              variant="h4"
              component={Link}
              to="/"
              sx={{
                fontFamily: "'Poppins', 'Inter', 'Segoe UI', sans-serif",
                fontWeight: 800,
                fontSize: '1.8rem',
                letterSpacing: '-0.02em',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': { 
                  transform: 'translateY(-2px)',
                  '& span:first-of-type': {
                    color: theme.palette.primary.dark
                  }
                }
              }}
            >
              <span style={{ color: theme.palette.primary.main, transition: 'color 0.3s ease' }}>{firstName}</span>
              {restName && <span style={{ color: '#1e293b', transition: 'color 0.3s ease' }}>{restName}</span>}
            </Typography>
          </Box>

          {/* Desktop Navigation */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'flex-end', gap: 1 }}>
            <Button
              component={Link}
              to="/"
              startIcon={<HomeIcon />}
              sx={{
                fontFamily: "'Inter', 'Segoe UI', sans-serif",
                fontWeight: 600,
                fontSize: '0.95rem',
                textTransform: 'none',
                letterSpacing: '-0.01em',
                color: '#334155',
                px: 2.5,
                py: 1,
                borderRadius: '40px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  bgcolor: theme.palette.primary.main,
                  color: 'white',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }
              }}
            >
              Home
            </Button>
            
            <Button
              component={Link}
              to="/products"
              startIcon={<CategoryIcon />}
              sx={{
                fontFamily: "'Inter', 'Segoe UI', sans-serif",
                fontWeight: 600,
                fontSize: '0.95rem',
                textTransform: 'none',
                letterSpacing: '-0.01em',
                color: '#334155',
                px: 2.5,
                py: 1,
                borderRadius: '40px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  bgcolor: theme.palette.primary.main,
                  color: 'white',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }
              }}
            >
              Products
            </Button>
            
            <Button
              component={Link}
              to="/services"
              startIcon={<BuildIcon />}
              sx={{
                fontFamily: "'Inter', 'Segoe UI', sans-serif",
                fontWeight: 600,
                fontSize: '0.95rem',
                textTransform: 'none',
                letterSpacing: '-0.01em',
                color: '#334155',
                px: 2.5,
                py: 1,
                borderRadius: '40px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  bgcolor: theme.palette.primary.main,
                  color: 'white',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }
              }}
            >
              Services
            </Button>
            
            <Button
              component={Link}
              to="/about"
              startIcon={<InfoIcon />}
              sx={{
                fontFamily: "'Inter', 'Segoe UI', sans-serif",
                fontWeight: 600,
                fontSize: '0.95rem',
                textTransform: 'none',
                letterSpacing: '-0.01em',
                color: '#334155',
                px: 2.5,
                py: 1,
                borderRadius: '40px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  bgcolor: theme.palette.primary.main,
                  color: 'white',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }
              }}
            >
              About
            </Button>
            
            <Button
              component={Link}
              to="/contact"
              startIcon={<ContactMailIcon />}
              sx={{
                fontFamily: "'Inter', 'Segoe UI', sans-serif",
                fontWeight: 600,
                fontSize: '0.95rem',
                textTransform: 'none',
                letterSpacing: '-0.01em',
                color: '#334155',
                px: 2.5,
                py: 1,
                borderRadius: '40px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  bgcolor: theme.palette.primary.main,
                  color: 'white',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }
              }}
            >
              Contact
            </Button>
            
            {isAdmin && (
              <>
                <Button
                  component={Link}
                  to="/admin"
                  startIcon={<DashboardIcon />}
                  sx={{
                    fontFamily: "'Inter', 'Segoe UI', sans-serif",
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    textTransform: 'none',
                    letterSpacing: '-0.01em',
                    color: '#334155',
                    px: 2.5,
                    py: 1,
                    borderRadius: '40px',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      bgcolor: theme.palette.primary.main,
                      color: 'white',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  Dashboard
                </Button>
                
                <Button
                  onClick={handleLogout}
                  startIcon={<LogoutIcon />}
                  sx={{
                    fontFamily: "'Inter', 'Segoe UI', sans-serif",
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    textTransform: 'none',
                    letterSpacing: '-0.01em',
                    color: '#ef4444',
                    px: 2.5,
                    py: 1,
                    borderRadius: '40px',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      bgcolor: '#ef4444',
                      color: 'white',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  Logout
                </Button>
              </>
            )}
          </Box>

          {/* Mobile Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            sx={{ display: { xs: 'block', md: 'none' } }}
            PaperProps={{
              sx: {
                width: '85%',
                maxWidth: 300,
                mt: 2,
                bgcolor: 'white',
                borderRadius: '20px',
                boxShadow: '0 20px 35px -10px rgba(0,0,0,0.15)',
                overflow: 'hidden'
              }
            }}
          >
            <MenuItem 
              component={Link} 
              to="/" 
              onClick={handleMenuClose}
              sx={{ 
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
                color: '#334155', 
                py: 1.5,
                px: 2.5,
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: theme.palette.primary.light,
                  color: 'white',
                  transform: 'translateX(8px)'
                }
              }}
            >
              <HomeIcon sx={{ mr: 2, fontSize: '1.3rem', transition: 'transform 0.2s ease' }} />
              Home
            </MenuItem>
            
            <MenuItem 
              component={Link} 
              to="/products" 
              onClick={handleMenuClose}
              sx={{ 
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
                color: '#334155', 
                py: 1.5,
                px: 2.5,
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: theme.palette.primary.light,
                  color: 'white',
                  transform: 'translateX(8px)'
                }
              }}
            >
              <CategoryIcon sx={{ mr: 2, fontSize: '1.3rem', transition: 'transform 0.2s ease' }} />
              Products
            </MenuItem>
            
            <MenuItem 
              component={Link} 
              to="/services" 
              onClick={handleMenuClose}
              sx={{ 
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
                color: '#334155', 
                py: 1.5,
                px: 2.5,
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: theme.palette.primary.light,
                  color: 'white',
                  transform: 'translateX(8px)'
                }
              }}
            >
              <BuildIcon sx={{ mr: 2, fontSize: '1.3rem', transition: 'transform 0.2s ease' }} />
              Services
            </MenuItem>
            
            <MenuItem 
              component={Link} 
              to="/about" 
              onClick={handleMenuClose}
              sx={{ 
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
                color: '#334155', 
                py: 1.5,
                px: 2.5,
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: theme.palette.primary.light,
                  color: 'white',
                  transform: 'translateX(8px)'
                }
              }}
            >
              <InfoIcon sx={{ mr: 2, fontSize: '1.3rem', transition: 'transform 0.2s ease' }} />
              About
            </MenuItem>
            
            <MenuItem 
              component={Link} 
              to="/contact" 
              onClick={handleMenuClose}
              sx={{ 
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
                color: '#334155', 
                py: 1.5,
                px: 2.5,
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: theme.palette.primary.light,
                  color: 'white',
                  transform: 'translateX(8px)'
                }
              }}
            >
              <ContactMailIcon sx={{ mr: 2, fontSize: '1.3rem', transition: 'transform 0.2s ease' }} />
              Contact
            </MenuItem>
            
            {isAdmin && (
              <>
                <MenuItem 
                  component={Link} 
                  to="/admin" 
                  onClick={handleMenuClose}
                  sx={{ 
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 500,
                    color: '#334155', 
                    py: 1.5,
                    px: 2.5,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: theme.palette.primary.light,
                      color: 'white',
                      transform: 'translateX(8px)'
                    }
                  }}
                >
                  <DashboardIcon sx={{ mr: 2, fontSize: '1.3rem', transition: 'transform 0.2s ease' }} />
                  Dashboard
                </MenuItem>
                
                <MenuItem 
                  onClick={handleLogout}
                  sx={{ 
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 500,
                    color: '#ef4444', 
                    py: 1.5,
                    px: 2.5,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: '#fee2e2',
                      color: '#dc2626',
                      transform: 'translateX(8px)'
                    }
                  }}
                >
                  <LogoutIcon sx={{ mr: 2, fontSize: '1.3rem', transition: 'transform 0.2s ease' }} />
                  Logout
                </MenuItem>
              </>
            )}
          </Menu>
        </Toolbar>
      </Container>
    </AppBar>
  );
}