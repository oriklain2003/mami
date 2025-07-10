import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Menu as MenuIcon, Favorite } from '@mui/icons-material';
import { motion } from 'framer-motion';

const Navigation: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();

  const menuItems = [
    { text: 'Home', path: '/' },
    { text: 'Games', path: '/games' },
    { text: 'Gallery', path: '/gallery' },
    { text: 'Where I\'m At', path: '/where-im-at' },
    { text: 'Surprise', path: '/surprise' },
    { text: 'Music', path: '/music' },
    { text: 'Beams Demo', path: '/beams-demo' }
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <List>
      {menuItems.map((item) => (
        <ListItem key={item.text} disablePadding>
          <ListItemButton
            component={Link}
            to={item.path}
            onClick={handleDrawerToggle}
            selected={location.pathname === item.path}
          >
            <ListItemText primary={item.text} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );

  return (
    <>
      <AppBar position="sticky" sx={{ background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)' }}>
        <Toolbar>
          {isMobile && (
            <IconButton
              color="primary"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Typography
              variant="h6"
              component="div"
              sx={{
                flexGrow: 1,
                color: theme.palette.primary.main,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Favorite /> Mami
            </Typography>
          </motion.div>

          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 2, ml: 'auto' }}>
              {menuItems.map((item) => (
                <motion.div
                  key={item.text}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    component={Link}
                    to={item.path}
                    color="primary"
                    variant={location.pathname === item.path ? "contained" : "text"}
                  >
                    {item.text}
                  </Button>
                </motion.div>
              ))}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navigation; 