import { useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  useTheme,
  useMediaQuery,
  Box,
  Typography,
  SwipeableDrawer,
  Divider,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import WorkIcon from '@mui/icons-material/Work';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import ArticleIcon from '@mui/icons-material/Article';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import FeedbackIcon from '@mui/icons-material/Feedback';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

const getNavItems = (showAdmin) => [
  { title: 'Home', path: '/', icon: <HomeIcon /> },
  { title: 'About', path: '/about', icon: <PersonIcon /> },
  { title: 'Portfolio', path: '/portfolio', icon: <WorkIcon /> },
  { title: 'Services', path: '/services', icon: <DesignServicesIcon /> },
  { title: 'Blog', path: '/blog', icon: <ArticleIcon /> },
  { title: 'Contact', path: '/contact', icon: <ContactMailIcon /> },
  { title: 'Testimonials', path: '/testimonials', icon: <FeedbackIcon /> },
  ...(showAdmin ? [{ title: 'Admin', path: '/admin', icon: <AdminPanelSettingsIcon /> }] : []),
];

function Navbar({ showAdmin }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();  const isMobile = useMediaQuery(theme.breakpoints.down(900));
  const location = useLocation();
  const navItems = getNavItems(showAdmin);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const ListItemComponent = motion(ListItem);

  const drawer = (
    <Box
      sx={{
        width: { xs: 240, sm: 280 },
        height: '100%',
        bgcolor: 'background.paper',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          p: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            color: 'primary.main',
            textDecoration: 'none',
            fontWeight: 700,
            fontSize: { xs: '1.2rem', sm: '1.5rem' },
          }}
          onClick={() => setMobileOpen(false)}
        >
          ADELA
        </Typography>
      </Box>

      <List sx={{ flex: 1, px: 2, py: 1 }}>
        {navItems.map((item, index) => (
          <ListItemComponent
            key={item.title}
            component={RouterLink}
            to={item.path}
            onClick={() => setMobileOpen(false)}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            sx={{
              mb: 0.5,
              borderRadius: 2,
              bgcolor: location.pathname === item.path ? 'primary.main' : 'transparent',
              color: location.pathname === item.path ? 'white' : 'text.primary',
              '&:hover': {
                bgcolor: location.pathname === item.path 
                  ? 'primary.dark'
                  : 'rgba(0, 0, 0, 0.04)',
              },
            }}
          >
            <ListItemIcon 
              sx={{ 
                color: location.pathname === item.path ? 'white' : 'primary.main',
                minWidth: 40,
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.title}
              primaryTypographyProps={{
                fontWeight: location.pathname === item.path ? 600 : 400,
              }}
            />
          </ListItemComponent>
        ))}
      </List>
    </Box>
  );

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, sm: 4, md: 6 } }}>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            color: 'primary.main',
            textDecoration: 'none',
            fontWeight: 700,
            fontSize: { xs: '1.2rem', sm: '1.5rem' },
          }}
        >
          ADELA
        </Typography>

        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
          {navItems.map((item) => (
            <Button
              key={item.title}
              component={RouterLink}
              to={item.path}
              startIcon={item.icon}
              sx={{
                mx: 0.5,
                px: 2,
                py: 1,
                color: location.pathname === item.path ? 'white' : 'text.primary',
                bgcolor: location.pathname === item.path ? 'primary.main' : 'transparent',
                '&:hover': {
                  bgcolor: location.pathname === item.path 
                    ? 'primary.dark' 
                    : 'rgba(0, 0, 0, 0.04)',
                },
              }}
            >
              {item.title}
            </Button>
          ))}
        </Box>

        <IconButton
          color="primary"
          aria-label="open drawer"
          edge="end"
          onClick={handleDrawerToggle}
          sx={{ display: { md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>

      <SwipeableDrawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        onOpen={() => setMobileOpen(true)}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box',
            width: { xs: 240, sm: 280 },
          },
        }}
      >
        {drawer}
      </SwipeableDrawer>
    </AppBar>
  );
}

export default Navbar;
