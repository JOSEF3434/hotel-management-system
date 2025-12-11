// components/Navbar.jsx
import React, { useState, useContext } from "react";
import { 
  AppBar, 
  Toolbar, 
  IconButton, 
  Typography, 
  Button, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Box, 
  Avatar, 
  Menu, 
  MenuItem, 
  Badge,
  InputBase,
  alpha,
  Tooltip,
  Divider,
  Container,
  //useScrollTrigger,
  Slide,
  Fade,
  Zoom,
  Chip
} from "@mui/material";
import { 
  Menu as MenuIcon, 
  DarkModeOutlined, 
  LightModeOutlined, 
  Search,
  NotificationsOutlined,
  PersonOutlined,
  HomeOutlined,
  ContactMailOutlined,
  InfoOutlined,
  RoomServiceOutlined,
  LoginOutlined,
  HowToRegOutlined,
  Close,
  Hotel,
  Star,
  Wifi,
  Pool,
  Restaurant,
  Spa,
  ChevronRight,
  KeyboardArrowDown
} from "@mui/icons-material";
import { ColorModeContext } from "../theme.js";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../theme.js";
import { Link, useLocation } from "react-router-dom";
import SettingsPage from "./SettingsPage.jsx";

const Navbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const location = useLocation();
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElNotifications, setAnchorElNotifications] = useState(null);
  const [anchorElServices, setAnchorElServices] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navigation items for desktop
  const navItems = [
    { text: "Home", icon: <HomeOutlined />, path: "/" },
    { 
      text: "Services", 
      icon: <RoomServiceOutlined />, 
      path: "/services",
      subItems: [
        { text: "Rooms & Suites", icon: <Hotel /> },
        { text: "Dining", icon: <Restaurant /> },
        { text: "Spa & Wellness", icon: <Spa /> },
        { text: "Pool", icon: <Pool /> },
        { text: "Wi-Fi", icon: <Wifi /> },
        { text: "Concierge", icon: <Star /> }
      ]
    },
    { text: "About", icon: <InfoOutlined />, path: "/about" },
    { text: "Contact", icon: <ContactMailOutlined />, path: "/contact" },
    { text: "Sign In", icon: <LoginOutlined />, path: "/signin", variant: "outlined" },
    { text: "Sign Up", icon: <HowToRegOutlined />, path: "/signup", variant: "contained" }
  ];

  // Mobile navigation items
  const mobileNavItems = [
    { text: "Home", icon: <HomeOutlined />, path: "/" },
    { text: "Services", icon: <RoomServiceOutlined />, path: "/services" },
    { text: "About", icon: <InfoOutlined />, path: "/about" },
    { text: "Contact", icon: <ContactMailOutlined />, path: "/contact" },
    { text: "Sign In", icon: <LoginOutlined />, path: "/signin" },
    { text: "Sign Up", icon: <HowToRegOutlined />, path: "/signup" }
  ];

  // Notifications data
  const notifications = [
    { id: 1, text: "New booking from John Doe", time: "5 min ago", type: "booking" },
    { id: 2, text: "Room 101 checkout today", time: "1 hour ago", type: "checkout" },
    { id: 3, text: "Maintenance request for Room 205", time: "2 hours ago", type: "maintenance" },
    { id: 4, text: "Special offer: 20% off weekend stays", time: "1 day ago", type: "offer" },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleUserMenuOpen = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorElUser(null);
  };

  const handleNotificationsMenuOpen = (event) => {
    setAnchorElNotifications(event.currentTarget);
  };

  const handleNotificationsMenuClose = () => {
    setAnchorElNotifications(null);
  };

  const handleServicesMenuOpen = (event) => {
    setAnchorElServices(event.currentTarget);
  };

  const handleServicesMenuClose = () => {
    setAnchorElServices(null);
  };

  const handleSearchToggle = () => {
    setSearchOpen(!searchOpen);
  };

  const drawer = (
    <Box 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: theme.palette.mode === 'dark' 
          ? colors.primary[500] 
          : '#ffffff',
      }}
    >
      {/* Drawer Header */}
      <Box 
        sx={{ 
          p: 3, 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: `1px solid ${theme.palette.mode === 'dark' ? colors.primary[600] : colors.grey[200]}`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Hotel sx={{ fontSize: 32, mr: 1, color: colors.greenAccent[500] }} />
          <Typography 
            variant="h5" 
            fontWeight={800}
            sx={{ 
              background: `linear-gradient(45deg, ${colors.greenAccent[500]}, ${colors.blueAccent[500]})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            GRAND HOTEL
          </Typography>
        </Box>
        <IconButton onClick={handleDrawerToggle}>
          <Close />
        </IconButton>
      </Box>

      {/* Navigation Items */}
      <List sx={{ flexGrow: 1, p: 2 }}>
        {mobileNavItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem
              key={item.text}
              component={Link}
              to={item.path}
              onClick={handleDrawerToggle}
              sx={{
                borderRadius: '12px',
                mb: 1,
                color: isActive ? colors.blueAccent[500] : 'inherit',
                backgroundColor: isActive 
                  ? (theme.palette.mode === 'dark' ? colors.blueAccent[900] : colors.blueAccent[50])
                  : 'transparent',
                textDecoration: 'none',
                '&:hover': {
                  backgroundColor: theme.palette.mode === 'dark' 
                    ? colors.primary[600] 
                    : colors.grey[100],
                },
              }}
            >
              <ListItemIcon sx={{ color: isActive ? colors.blueAccent[500] : 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '1.1rem',
                }}
              />
              {isActive && <ChevronRight sx={{ color: colors.blueAccent[500] }} />}
            </ListItem>
          );
        })}
      </List>

      {/* Drawer Footer */}
      <Box sx={{ p: 3, borderTop: `1px solid ${theme.palette.mode === 'dark' ? colors.primary[600] : colors.grey[200]}` }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="body2" color="textSecondary">
            Switch Theme
          </Typography>
          <IconButton 
            onClick={colorMode.toggleColorMode}
            sx={{ 
              backgroundColor: theme.palette.mode === 'dark' ? colors.primary[600] : colors.grey[100],
              '&:hover': {
                backgroundColor: theme.palette.mode === 'dark' ? colors.primary[700] : colors.grey[200],
              }
            }}
          >
            {theme.palette.mode === 'dark' ? <LightModeOutlined /> : <DarkModeOutlined />}
          </IconButton>
        </Box>
        <Button
          variant="contained"
          fullWidth
          startIcon={<Hotel />}
          sx={{
            background: `linear-gradient(45deg, ${colors.greenAccent[500]}, ${colors.blueAccent[500]})`,
            borderRadius: '10px',
            py: 1.5,
            fontWeight: 600,
          }}
        >
          Book Now
        </Button>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Main App Bar */}
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: scrolled 
            ? (theme.palette.mode === 'dark' 
                ? alpha(colors.primary[500], 0.95) 
                : alpha('#ffffff', 0.95))
            : (theme.palette.mode === 'dark' 
                ? colors.primary[500] 
                : '#ffffff'),
          backdropFilter: scrolled ? 'blur(10px)' : 'none',
          boxShadow: scrolled 
            ? `0 4px 20px ${alpha(theme.palette.mode === 'dark' ? '#000' : colors.grey[400], 0.15)}`
            : 'none',
          borderBottom: scrolled 
            ? `1px solid ${theme.palette.mode === 'dark' ? colors.primary[600] : colors.grey[200]}`
            : 'none',
          transition: 'all 0.3s ease',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar 
            sx={{ 
              px: { xs: 0, md: 2 },
              minHeight: { xs: 70, md: 80 }
            }}
          >
            {/* Left Section - Logo/Hotel Name */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              flex: { xs: 1, md: 'none' },
              mr: { md: 4 }
            }}>
              <Box 
                component={Link}
                to="/"
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  textDecoration: 'none'
                }}
              >
                <Hotel sx={{ 
                  fontSize: { xs: 28, md: 32 }, 
                  mr: 1.5, 
                  color: colors.greenAccent[500] 
                }} />
                <Box>
                  <Typography 
                    variant="h5" 
                    fontWeight={900}
                    sx={{ 
                      fontSize: { xs: '1.2rem', md: '1.5rem' },
                      background: `linear-gradient(45deg, ${colors.greenAccent[500]}, ${colors.blueAccent[500]})`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      lineHeight: 1.2,
                    }}
                  >
                    GRAND HOTEL
                  </Typography>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      fontSize: '0.65rem',
                      letterSpacing: '1.5px',
                      color: colors.grey[500],
                      display: { xs: 'none', sm: 'block' }
                    }}
                  >
                    LUXURY & COMFORT
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Center Section - Desktop Navigation */}
            <Box sx={{ 
              display: { xs: 'none', md: 'flex' }, 
              alignItems: 'center',
              flex: 1,
              justifyContent: 'center',
              gap: 1
            }}>
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                
                if (item.text === "Services") {
                  return (
                    <Button
                      key={item.text}
                      onClick={handleServicesMenuOpen}
                      startIcon={item.icon}
                      endIcon={<KeyboardArrowDown />}
                      sx={{
                        color: isActive ? colors.blueAccent[500] : (theme.palette.mode === 'dark' ? colors.grey[100] : colors.grey[800]),
                        fontWeight: isActive ? 700 : 500,
                        textTransform: 'none',
                        fontSize: '0.95rem',
                        px: 2,
                        py: 1,
                        borderRadius: '10px',
                        backgroundColor: isActive 
                          ? (theme.palette.mode === 'dark' ? colors.blueAccent[900] : colors.blueAccent[50])
                          : 'transparent',
                        '&:hover': {
                          backgroundColor: theme.palette.mode === 'dark' 
                            ? colors.primary[600] 
                            : colors.grey[100],
                        }
                      }}
                    >
                      {item.text}
                    </Button>
                  );
                }

                return (
                  <Button
                    key={item.text}
                    component={Link}
                    to={item.path}
                    variant={item.variant || "text"}
                    startIcon={item.icon}
                    sx={{
                      color: isActive ? colors.blueAccent[500] : (theme.palette.mode === 'dark' ? colors.grey[100] : colors.grey[800]),
                      fontWeight: isActive ? 700 : 500,
                      textTransform: 'none',
                      fontSize: '0.95rem',
                      px: 2,
                      py: 1,
                      borderRadius: '10px',
                      backgroundColor: isActive 
                        ? (theme.palette.mode === 'dark' ? colors.blueAccent[900] : colors.blueAccent[50])
                        : 'transparent',
                      border: item.variant === 'outlined' 
                        ? `1px solid ${theme.palette.mode === 'dark' ? colors.blueAccent[500] : colors.blueAccent[400]}`
                        : 'none',
                      background: item.variant === 'contained' 
                        ? `linear-gradient(45deg, ${colors.greenAccent[500]}, ${colors.blueAccent[500]})`
                        : 'transparent',
                      '&:hover': {
                        backgroundColor: item.variant === 'text' 
                          ? (theme.palette.mode === 'dark' ? colors.primary[600] : colors.grey[100])
                          : (item.variant === 'contained' 
                              ? `linear-gradient(45deg, ${colors.greenAccent[600]}, ${colors.blueAccent[600]})`
                              : (theme.palette.mode === 'dark' ? colors.blueAccent[800] : colors.blueAccent[100])),
                      }
                    }}
                  >
                    {item.text}
                  </Button>
                );
              })}
            </Box>

            {/* Right Section - Icons */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              flex: { xs: 'none', md: 'none' },
              ml: 'auto',
              gap: { xs: 0.5, md: 1 }
            }}>
              {/* Search Button (Desktop) */}
              <Tooltip title="Search">
                <IconButton
                  onClick={handleSearchToggle}
                  sx={{
                    display: { xs: 'none', md: 'flex' },
                    color: theme.palette.mode === 'dark' ? colors.grey[100] : colors.grey[800],
                  }}
                >
                  <Search />
                </IconButton>
              </Tooltip>

              {/* Theme Toggle */}
              <Tooltip title={`Switch to ${theme.palette.mode === 'dark' ? 'light' : 'dark'} mode`}>
                <IconButton 
                  onClick={colorMode.toggleColorMode}
                  sx={{ 
                    color: theme.palette.mode === 'dark' ? colors.grey[100] : colors.grey[800],
                    backgroundColor: theme.palette.mode === 'dark' ? colors.primary[600] : colors.grey[100],
                    '&:hover': {
                      backgroundColor: theme.palette.mode === 'dark' ? colors.primary[700] : colors.grey[200],
                    }
                  }}
                >
                  {theme.palette.mode === 'dark' ? <LightModeOutlined /> : <DarkModeOutlined />}
                </IconButton>
              </Tooltip>

              {/* Notifications */}
              <Tooltip title="Notifications">
                <IconButton 
                  onClick={handleNotificationsMenuOpen}
                  sx={{ 
                    color: theme.palette.mode === 'dark' ? colors.grey[100] : colors.grey[800],
                  }}
                >
                  <Badge 
                    badgeContent={4} 
                    color="error"
                    sx={{
                      '& .MuiBadge-badge': {
                        fontSize: '0.6rem',
                        height: 18,
                        minWidth: 18,
                      }
                    }}
                  >
                    <NotificationsOutlined />
                  </Badge>
                </IconButton>
              </Tooltip>

              {/* User Profile */}
              <Tooltip title="Account">
                <IconButton 
                  onClick={handleUserMenuOpen}
                  sx={{ 
                    p: 0.5,
                    border: `2px solid ${theme.palette.mode === 'dark' ? colors.primary[300] : colors.blueAccent[200]}`,
                  }}
                >
                  <Avatar 
                    sx={{ 
                      width: 36, 
                      height: 36, 
                      backgroundColor: colors.greenAccent[500],
                    }}
                  >
                    JD
                  </Avatar>
                </IconButton>
              </Tooltip>

              {/* Mobile Menu Button */}
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="end"
                onClick={handleDrawerToggle}
                sx={{ 
                  ml: 1,
                  display: { xs: 'flex', md: 'none' },
                  color: theme.palette.mode === 'dark' ? colors.grey[100] : colors.grey[800],
                }}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>

        {/* Services Dropdown Menu */}
        <Menu
          anchorEl={anchorElServices}
          open={Boolean(anchorElServices)}
          onClose={handleServicesMenuClose}
          PaperProps={{
            elevation: 3,
            sx: {
              mt: 1.5,
              width: 280,
              borderRadius: '12px',
              overflow: 'hidden',
              background: theme.palette.mode === 'dark' 
                ? colors.primary[500] 
                : '#ffffff',
            },
          }}
        >
          <Box sx={{ p: 2 }}>
            <Typography variant="subtitle1" fontWeight={600}>
              Hotel Services
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Explore our premium amenities
            </Typography>
          </Box>
          <Divider />
          {navItems.find(item => item.text === "Services")?.subItems?.map((service) => (
            <MenuItem 
              key={service.text} 
              onClick={handleServicesMenuClose}
              sx={{ py: 1.5 }}
            >
              <ListItemIcon sx={{ color: colors.primary[300] }}>
                {service.icon}
              </ListItemIcon>
              <ListItemText primary={service.text} />
            </MenuItem>
          ))}
        </Menu>

        {/* Notifications Menu */}
        <Menu
          anchorEl={anchorElNotifications}
          open={Boolean(anchorElNotifications)}
          onClose={handleNotificationsMenuClose}
          PaperProps={{
            elevation: 3,
            sx: {
              mt: 1.5,
              width: 350,
              maxHeight: 400,
              borderRadius: '12px',
              overflow: 'hidden',
              background: theme.palette.mode === 'dark' 
                ? colors.primary[500] 
                : '#ffffff',
            },
          }}
        >
          <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6" fontWeight={600}>
              Notifications
            </Typography>
            <Chip 
              label="4 New" 
              size="small" 
              color="primary" 
              sx={{ height: 20, fontSize: '0.7rem' }}
            />
          </Box>
          <Divider />
          {notifications.map((notification) => (
            <MenuItem 
              key={notification.id} 
              onClick={handleNotificationsMenuClose}
              sx={{ 
                py: 2,
                borderBottom: `1px solid ${theme.palette.mode === 'dark' ? colors.primary[600] : colors.grey[100]}`,
                '&:last-child': { borderBottom: 'none' }
              }}
            >
              <Box sx={{ width: '100%' }}>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  {notification.text}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="caption" color="textSecondary">
                    {notification.time}
                  </Typography>
                  <Chip 
                    label={notification.type} 
                    size="small" 
                    variant="outlined"
                    sx={{ height: 18, fontSize: '0.6rem' }}
                  />
                </Box>
              </Box>
            </MenuItem>
          ))}
          <Divider />
          <Box sx={{ p: 1.5, textAlign: 'center' }}>
            <Button 
              size="small" 
              sx={{ 
                color: colors.blueAccent[500],
                '&:hover': { backgroundColor: 'transparent' }
              }}
            >
              View All Notifications
            </Button>
          </Box>
        </Menu>

        {/* User Profile Menu */}
        <Menu
          anchorEl={anchorElUser}
          open={Boolean(anchorElUser)}
          onClose={handleUserMenuClose}
          PaperProps={{
            elevation: 3,
            sx: {
              mt: 1.5,
              width: 220,
              borderRadius: '12px',
              overflow: 'hidden',
              background: theme.palette.mode === 'dark' 
                ? colors.primary[500] 
                : '#ffffff',
            },
          }}
        >
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Avatar 
              sx={{ 
                width: 56, 
                height: 56, 
                mx: 'auto',
                mb: 1.5,
                backgroundColor: colors.greenAccent[500],
                fontSize: '1.5rem',
              }}
            >
              JD
            </Avatar>
            <Typography variant="subtitle1" fontWeight={600}>
              John Doe
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Hotel Manager
            </Typography>
          </Box>
          <Divider />
          <MenuItem onClick={handleUserMenuClose}>
            <ListItemIcon>
              <PersonOutlined fontSize="small" />
            </ListItemIcon>
            <ListItemText>My Profile</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleUserMenuClose}>
            <ListItemIcon>
              <Hotel fontSize="small" />
            </ListItemIcon>
            <ListItemText>My Bookings</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleUserMenuClose}>
            <ListItemIcon>
              <SettingsPage fontSize="small" />
            </ListItemIcon>
            <ListItemText>Settings</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem 
            onClick={handleUserMenuClose}
            sx={{ color: colors.redAccent[500] }}
          >
            <ListItemIcon>
              <LoginOutlined fontSize="small" sx={{ color: colors.redAccent[500] }} />
            </ListItemIcon>
            <ListItemText>Logout</ListItemText>
          </MenuItem>
        </Menu>
      </AppBar>

      {/* Search Bar (Slide Down) */}
      <Slide direction="down" in={searchOpen} mountOnEnter unmountOnExit>
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1200,
            pt: { xs: 9, md: 10 },
            pb: 3,
            px: 2,
            background: theme.palette.mode === 'dark' 
              ? colors.primary[500] 
              : '#ffffff',
            boxShadow: `0 4px 12px ${alpha(theme.palette.mode === 'dark' ? '#000' : colors.grey[400], 0.15)}`,
          }}
        >
          <Container maxWidth="md">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ flex: 1, position: 'relative' }}>
                <Search 
                  sx={{ 
                    position: 'absolute',
                    left: 16,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: colors.grey[500],
                  }}
                />
                <InputBase
                  placeholder="Search rooms, amenities, services..."
                  autoFocus
                  fullWidth
                  sx={{
                    pl: 6,
                    pr: 4,
                    py: 1.5,
                    borderRadius: '10px',
                    border: `1px solid ${theme.palette.mode === 'dark' ? colors.primary[600] : colors.grey[300]}`,
                    backgroundColor: theme.palette.mode === 'dark' 
                      ? colors.primary[600] 
                      : colors.grey[50],
                    fontSize: '1rem',
                  }}
                />
              </Box>
              <IconButton onClick={handleSearchToggle}>
                <Close />
              </IconButton>
            </Box>
          </Container>
        </Box>
      </Slide>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 320,
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Spacer for fixed AppBar */}
      <Toolbar sx={{ 
        minHeight: { xs: 70, md: 80 } 
      }} />
    </>
  );
};

export default Navbar;