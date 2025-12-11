// components/HomePage.jsx - Fixed top margin and gaps
import React, { useState, useMemo, useContext } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  IconButton,
  Button,
  Chip,
  Avatar,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  useTheme,
  alpha,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Badge,
  Collapse,
  useMediaQuery
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Hotel,
  People,
  CalendarToday,
  AttachMoney,
  Star,
  Wifi,
  Restaurant,
  Pool,
  FitnessCenter,
  Spa,
  MoreVert,
  ArrowForward,
  EventAvailable,
  EventBusy,
  CleaningServices,
  RoomService,
  Security,
  CarRental,
  LocalBar,
  BusinessCenter,
  ArrowUpward,
  ArrowDownward,
  Refresh,
  Dashboard,
  Room,
  BookOnline,
  ReceiptLong,
  Groups,
  Notifications,
  Settings,
  ExpandLess,
  ExpandMore,
  ChevronLeft,
  ChevronRight,
  Today,
  Event,
  CheckCircle,
  Warning,
  BarChart,
  PieChart,
  Timeline,
  Insights,
  Menu as MenuIcon
} from '@mui/icons-material';
import {
  AreaChart,
  Area,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { tokens } from '../theme.js';
import { ColorModeContext } from '../theme.js';
import { format, subDays } from 'date-fns';

// Dashboard Sidebar Component
const DashboardSidebar = ({ open, onToggle }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
  const [activeItem, setActiveItem] = useState('overview');
  const [expandedSections, setExpandedSections] = useState({
    analytics: true,
    operations: false,
    management: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const menuItems = [
    {
      id: 'overview',
      text: 'Overview',
      icon: <Dashboard />,
      badge: null
    },
    {
      id: 'analytics',
      text: 'Analytics',
      icon: <Insights />,
      badge: '3',
      subItems: [
        { id: 'revenue', text: 'Revenue', icon: <AttachMoney /> },
        { id: 'occupancy', text: 'Occupancy', icon: <BarChart /> },
        { id: 'performance', text: 'Performance', icon: <Timeline /> }
      ]
    },
    {
      id: 'rooms',
      text: 'Rooms',
      icon: <Room />,
      badge: '12'
    },
    {
      id: 'bookings',
      text: 'Bookings',
      icon: <BookOnline />,
      badge: '24'
    },
    {
      id: 'guests',
      text: 'Guests',
      icon: <Groups />,
      badge: '156'
    }
  ];

  const quickActions = [
    { text: 'Check-in', icon: <CheckCircle />, color: colors.greenAccent[500] },
    { text: 'Check-out', icon: <Event />, color: colors.blueAccent[500] },
    { text: 'New Booking', icon: <Today />, color: colors.primary[300] },
    { text: 'Maintenance', icon: <Warning />, color: colors.redAccent[500] }
  ];

  const todayStats = [
    { label: 'Arrivals', value: '24', change: '+3' },
    { label: 'Departures', value: '18', change: '-2' },
    { label: 'Occupied', value: '156', change: '+5' },
    { label: 'Available', value: '27', change: '-3' }
  ];

  const drawerWidth = open ? 280 : 70;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          borderRight: `1px solid ${theme.palette.mode === 'dark' ? colors.primary[600] : colors.grey[200]}`,
          background: theme.palette.mode === 'dark' ? colors.primary[500] : '#ffffff',
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          overflowX: 'hidden',
          position: 'fixed',
          height: '100vh',
          zIndex: 1100,
          top: '10vh',
          left: 0,
          // Remove top margin - align with top navbar
          mt: 0,
        },
      }}
    >
      {/* Toggle Button - Removed margin top */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: open ? 'space-between' : 'center',
          p: 2,
          borderBottom: `1px solid ${theme.palette.mode === 'dark' ? colors.primary[600] : colors.grey[200]}`,
          minHeight: 70,
          // Align with navbar height
          mt: 0,
        }}
      >
        {open ? (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Hotel sx={{ fontSize: 28, color: colors.greenAccent[500] }} />
              <Typography variant="h6" fontWeight={700}>
                Dashboard
              </Typography>
            </Box>
            <IconButton onClick={onToggle} size="small">
              <ChevronLeft />
            </IconButton>
          </>
        ) : (
          <IconButton onClick={onToggle}>
            <ChevronRight />
          </IconButton>
        )}
      </Box>

      {/* Today's Stats */}
      {open && (
        <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.mode === 'dark' ? colors.primary[600] : colors.grey[200]}` }}>
          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1, color: colors.grey[500] }}>
            Today's Stats
          </Typography>
          <Grid container spacing={1}>
            {todayStats.map((stat, index) => (
              <Grid size={{ xs: 6 }} key={index}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 1,
                    borderRadius: '8px',
                    background: theme.palette.mode === 'dark' ? colors.primary[600] : colors.grey[50],
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="h6" fontWeight={700}>
                    {stat.value}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {stat.label}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: stat.change.startsWith('+') ? colors.greenAccent[500] : colors.redAccent[500],
                      fontWeight: 600,
                      ml: 0.5
                    }}
                  >
                    {stat.change}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Quick Actions */}
      {open && (
        <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.mode === 'dark' ? colors.primary[600] : colors.grey[200]}` }}>
          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1, color: colors.grey[500] }}>
            Quick Actions
          </Typography>
          <Grid container spacing={1}>
            {quickActions.map((action, index) => (
              <Grid size={{ xs: 6 }} key={index}>
                <Button
                  fullWidth
                  size="small"
                  startIcon={action.icon}
                  sx={{
                    justifyContent: 'flex-start',
                    textTransform: 'none',
                    borderRadius: '8px',
                    backgroundColor: `${action.color}15`,
                    color: action.color,
                    '&:hover': {
                      backgroundColor: `${action.color}30`,
                    }
                  }}
                >
                  {action.text}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Main Menu */}
      <List sx={{ p: open ? 2 : 1, flexGrow: 1 }}>
        {menuItems.map((item) => (
          <React.Fragment key={item.id}>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  if (item.subItems) {
                    toggleSection(item.id);
                  } else {
                    setActiveItem(item.id);
                  }
                }}
                sx={{
                  borderRadius: '8px',
                  mb: 0.5,
                  backgroundColor: activeItem === item.id
                    ? (theme.palette.mode === 'dark' ? colors.primary[600] : colors.blueAccent[50])
                    : 'transparent',
                  color: activeItem === item.id ? colors.blueAccent[500] : 'inherit',
                  minHeight: 48,
                  px: open ? 2 : 1,
                  justifyContent: open ? 'initial' : 'center',
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 2 : 0,
                    justifyContent: 'center',
                    color: activeItem === item.id ? colors.blueAccent[500] : 'inherit',
                  }}
                >
                  {item.badge ? (
                    <Badge badgeContent={item.badge} color="error" size="small">
                      {item.icon}
                    </Badge>
                  ) : (
                    item.icon
                  )}
                </ListItemIcon>
                {open && (
                  <>
                    <ListItemText 
                      primary={item.text} 
                      primaryTypographyProps={{
                        fontWeight: activeItem === item.id ? 600 : 500,
                        fontSize: '0.9rem',
                      }}
                    />
                    {item.subItems && (
                      expandedSections[item.id] ? <ExpandLess /> : <ExpandMore />
                    )}
                  </>
                )}
              </ListItemButton>
            </ListItem>
            
            {/* Sub Items */}
            {item.subItems && open && (
              <Collapse in={expandedSections[item.id]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.subItems.map((subItem) => (
                    <ListItem key={subItem.id} disablePadding>
                      <ListItemButton
                        onClick={() => setActiveItem(subItem.id)}
                        sx={{
                          pl: 4,
                          borderRadius: '8px',
                          mb: 0.5,
                          backgroundColor: activeItem === subItem.id
                            ? (theme.palette.mode === 'dark' ? colors.primary[700] : colors.blueAccent[100])
                            : 'transparent',
                          color: activeItem === subItem.id ? colors.blueAccent[500] : 'inherit',
                          minHeight: 40,
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: 36,
                            color: activeItem === subItem.id ? colors.blueAccent[500] : 'inherit',
                          }}
                        >
                          {subItem.icon}
                        </ListItemIcon>
                        <ListItemText 
                          primary={subItem.text} 
                          primaryTypographyProps={{
                            fontSize: '0.85rem',
                          }}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            )}
          </React.Fragment>
        ))}
      </List>

      {/* Bottom Section */}
      <Box sx={{ p: open ? 2 : 1 }}>
        {open ? (
          <>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    backgroundColor: colors.greenAccent[500],
                  }}
                >
                  JD
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" fontWeight={600}>
                    John Doe
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Manager
                  </Typography>
                </Box>
              </Box>
              <IconButton size="small">
                <Notifications />
              </IconButton>
            </Box>
            <Button
              fullWidth
              variant="outlined"
              size="small"
              startIcon={<Settings />}
              sx={{
                borderRadius: '8px',
                borderColor: theme.palette.mode === 'dark' ? colors.primary[300] : colors.grey[300],
                color: theme.palette.mode === 'dark' ? colors.grey[100] : colors.grey[800],
                mb: 1,
              }}
            >
              Settings
            </Button>
          </>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
            <IconButton size="small">
              <Notifications />
            </IconButton>
            <IconButton size="small">
              <Settings />
            </IconButton>
          </Box>
        )}
      </Box>
    </Drawer>
  );
};

const HomePage = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [timeRange, setTimeRange] = useState('week');
  
  // Responsive breakpoints
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'lg'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  
  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Dashboard Stats Data
  const statsData = [
    {
      title: 'Total Revenue',
      value: '$245,800',
      change: 18.7,
      icon: AttachMoney,
      color: colors.greenAccent[500],
      details: 'This month',
      trend: 'up'
    },
    {
      title: 'Occupancy Rate',
      value: '85.2%',
      change: 5.3,
      icon: Hotel,
      color: colors.blueAccent[500],
      details: '156/183 rooms',
      trend: 'up'
    },
    {
      title: 'Average Daily Rate',
      value: '$289',
      change: -2.1,
      icon: TrendingUp,
      color: colors.redAccent[500],
      details: 'Previous: $295',
      trend: 'down'
    },
    {
      title: 'Guest Satisfaction',
      value: '4.8',
      change: 0.3,
      icon: Star,
      color: colors.primary[300],
      details: 'Based on 234 reviews',
      trend: 'up'
    }
  ];

  // Revenue Chart Data
  const revenueData = useMemo(() => {
    const data = [];
    const now = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = subDays(now, i);
      const revenue = Math.floor(Math.random() * 50000) + 20000;
      const expenses = Math.floor(Math.random() * 15000) + 5000;
      const profit = revenue - expenses;
      
      data.push({
        name: format(date, 'EEE'),
        date: format(date, 'MM/dd'),
        revenue,
        expenses,
        profit
      });
    }
    return data;
  }, []);

  // Room Type Occupancy Data
  const roomOccupancyData = [
    { name: 'Deluxe Suite', value: 45, color: colors.greenAccent[500], total: 60 },
    { name: 'Executive Suite', value: 30, color: colors.blueAccent[500], total: 40 },
    { name: 'Presidential Suite', value: 18, color: colors.redAccent[500], total: 20 },
    { name: 'Standard Room', value: 63, color: colors.primary[300], total: 80 },
    { name: 'Family Room', value: 36, color: colors.primary[500], total: 50 },
  ];

  // Recent Bookings Data
  const recentBookings = [
    {
      id: 1,
      guest: 'John Smith',
      room: 'Deluxe Suite - 301',
      checkIn: '2024-01-15',
      checkOut: '2024-01-20',
      status: 'checked-in',
      amount: '$1,890',
      nights: 5
    },
    {
      id: 2,
      guest: 'Sarah Johnson',
      room: 'Executive Suite - 205',
      checkIn: '2024-01-16',
      checkOut: '2024-01-18',
      status: 'confirmed',
      amount: '$1,240',
      nights: 2
    },
    {
      id: 3,
      guest: 'Michael Chen',
      room: 'Presidential Suite - 401',
      checkIn: '2024-01-14',
      checkOut: '2024-01-22',
      status: 'checked-in',
      amount: '$4,560',
      nights: 8
    },
    {
      id: 4,
      guest: 'Emma Wilson',
      room: 'Family Room - 108',
      checkIn: '2024-01-17',
      checkOut: '2024-01-19',
      status: 'pending',
      amount: '$890',
      nights: 2
    },
    {
      id: 5,
      guest: 'Robert Brown',
      room: 'Standard Room - 156',
      checkIn: '2024-01-15',
      checkOut: '2024-01-17',
      status: 'checked-out',
      amount: '$650',
      nights: 2
    }
  ];

  // Hotel Services Data
  const hotelServices = [
    { name: 'Wi-Fi', icon: Wifi, usage: 92, revenue: '$2,800' },
    { name: 'Restaurant', icon: Restaurant, usage: 78, revenue: '$18,500' },
    { name: 'Spa', icon: Spa, usage: 65, revenue: '$8,200' },
    { name: 'Pool', icon: Pool, usage: 45, revenue: '$1,200' },
    { name: 'Gym', icon: FitnessCenter, usage: 38, revenue: '$800' },
    { name: 'Room Service', icon: RoomService, usage: 82, revenue: '$5,400' },
    { name: 'Parking', icon: CarRental, usage: 58, revenue: '$3,100' },
    { name: 'Bar', icon: LocalBar, usage: 71, revenue: '$6,800' },
    { name: 'Business Center', icon: BusinessCenter, usage: 42, revenue: '$1,500' },
  ];

  // Stat Card Component
  const StatCard = ({ title, value, change, icon: Icon, color, details, trend }) => (
    <Card
      sx={{
        height: '100%',
        background: theme.palette.mode === 'dark'
          ? colors.primary[400]
          : colors.primary[50],
        borderRadius: '12px',
        border: `1px solid ${theme.palette.mode === 'dark' ? colors.primary[600] : colors.grey[200]}`,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8],
        }
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography color="textSecondary" variant="body2" sx={{ mb: 0.5 }}>
              {title}
            </Typography>
            <Typography variant="h4" fontWeight={700}>
              {value}
            </Typography>
          </Box>
          <Box
            sx={{
              backgroundColor: `${color}20`,
              borderRadius: '12px',
              padding: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Icon sx={{ color: color, fontSize: 24 }} />
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {trend === 'up' ? (
              <ArrowUpward sx={{ color: colors.greenAccent[500], fontSize: 16, mr: 0.5 }} />
            ) : (
              <ArrowDownward sx={{ color: colors.redAccent[500], fontSize: 16, mr: 0.5 }} />
            )}
            <Typography
              variant="body2"
              sx={{
                color: trend === 'up' ? colors.greenAccent[500] : colors.redAccent[500],
                fontWeight: 600
              }}
            >
              {change >= 0 ? '+' : ''}{change}%
            </Typography>
          </Box>
          <Typography variant="caption" color="textSecondary">
            {details}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );

  // Service Usage Card
  const ServiceCard = ({ service }) => {
    const Icon = service.icon;
    return (
      <Paper
        elevation={0}
        sx={{
          p: 2,
          borderRadius: '12px',
          border: `1px solid ${theme.palette.mode === 'dark' ? colors.primary[600] : colors.grey[200]}`,
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: theme.palette.mode === 'dark' ? colors.primary[600] : colors.primary[50],
            transform: 'translateY(-2px)',
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box
            sx={{
              backgroundColor: `${colors.primary[300]}20`,
              borderRadius: '10px',
              padding: '8px',
              mr: 2
            }}
          >
            <Icon sx={{ color: colors.primary[300] }} />
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle2" fontWeight={600}>
              {service.name}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {service.usage}% usage
            </Typography>
          </Box>
          <Typography variant="subtitle2" fontWeight={700} color={colors.greenAccent[500]}>
            {service.revenue}
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={service.usage}
          sx={{
            height: 6,
            borderRadius: 3,
            backgroundColor: theme.palette.mode === 'dark' ? colors.primary[700] : colors.grey[200],
            '& .MuiLinearProgress-bar': {
              borderRadius: 3,
              background: `linear-gradient(90deg, ${colors.primary[300]}, ${colors.blueAccent[500]})`,
            }
          }}
        />
      </Paper>
    );
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Calculate sidebar width for content margin
  const sidebarWidth = sidebarOpen ? 280 : 70;

  return (
    <Box sx={{ 
      display: 'flex', 
      minHeight: '100vh',
      width: '100%',
      overflow: 'hidden',
      bgcolor: 'background.default',
      // Remove any extra top margin
      mt: 0,
    }}>
      {/* Left Side Dashboard Sidebar */}
      <DashboardSidebar 
        open={sidebarOpen} 
        onToggle={toggleSidebar} 
      />

      {/* Main Content Area - FIXED TOP MARGIN */}
      <Box 
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          minHeight: '100vh',
          // FIXED: Remove top margin, align directly under navbar
          ml: { 
            xs: 0,
            sm: `${sidebarWidth}px`,
            md: `${sidebarWidth}px`,
            lg: `${sidebarWidth}px`,
            xl: `${sidebarWidth}px`
          },
          transition: theme.transitions.create(['margin-left'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          // FIXED: Start content directly after navbar
          mt: { xs: '56px', sm: '64px', md: '64px', lg: '64px', xl: '64px' },
        }}
      >
        {/* Mobile Menu Button */}
        {isMobile && (
          <Box
            sx={{
              position: 'fixed',
              top: '64px',
              left: 16,
              zIndex: 1200,
              backgroundColor: theme.palette.mode === 'dark' ? colors.primary[500] : '#ffffff',
              borderRadius: '50%',
              boxShadow: 3,
            }}
          >
            <IconButton onClick={toggleSidebar}>
              <MenuIcon />
            </IconButton>
          </Box>
        )}

        {/* Content Container - REMOVED EXTRA PADDING TOP */}
        <Box
          sx={{
            flex: 1,
            p: { 
              xs: 2, 
              sm: 3,
              md: 3,
              lg: 3,
              xl: 4
            },
            // FIXED: Remove extra top padding since we have mt on parent
            pt: 0,
            backgroundColor: theme.palette.background.default,
            width: '100%',
            maxWidth: '100%',
            overflowX: 'hidden',
          }}
        >
          {/* Header Section - FIXED: Reduced top spacing */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: 'space-between', 
              alignItems: { xs: 'flex-start', md: 'center' }, 
              mb: 2,
              gap: 2
            }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                  Hotel Dashboard
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  Welcome back! Here's your hotel performance overview for {format(new Date(), 'MMMM d, yyyy')}
                </Typography>
              </Box>
              <Box sx={{ 
                display: 'flex', 
                gap: 2,
                flexWrap: { xs: 'wrap', md: 'nowrap' },
                width: { xs: '100%', md: 'auto' }
              }}>
                <Button
                  variant="outlined"
                  startIcon={<Refresh />}
                  onClick={() => setTimeRange(timeRange === 'week' ? 'month' : 'week')}
                  sx={{
                    borderRadius: '8px',
                    borderColor: theme.palette.mode === 'dark' ? colors.primary[300] : colors.grey[300],
                    minWidth: { xs: '48%', sm: 'auto' }
                  }}
                >
                  {timeRange === 'week' ? 'This Week' : 'This Month'}
                </Button>
                <Button
                  variant="contained"
                  endIcon={<ArrowForward />}
                  sx={{
                    borderRadius: '8px',
                    background: `linear-gradient(45deg, ${colors.greenAccent[500]}, ${colors.blueAccent[500]})`,
                    '&:hover': {
                      background: `linear-gradient(45deg, ${colors.greenAccent[600]}, ${colors.blueAccent[600]})`,
                    },
                    minWidth: { xs: '48%', sm: 'auto' }
                  }}
                >
                  View Full Report
                </Button>
              </Box>
            </Box>

            {/* Quick Stats - FIXED: Reduced spacing */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
              {statsData.map((stat, index) => (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                  <StatCard {...stat} />
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Charts Section */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            {/* Revenue Chart */}
            <Grid size={{ xs: 12, xl: 8 }}>
              <Card
                sx={{
                  height: '100%',
                  borderRadius: '12px',
                  background: theme.palette.mode === 'dark'
                    ? colors.primary[400]
                    : colors.primary[50],
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Box>
                      <Typography variant="h6" fontWeight={700}>
                        Revenue Overview
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Last 7 days performance
                      </Typography>
                    </Box>
                    <IconButton size="small">
                      <MoreVert />
                    </IconButton>
                  </Box>
                  <Box sx={{ height: 300, minWidth: 0, minHeight: 0 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.mode === 'dark' ? colors.grey[800] : colors.grey[200]} />
                        <XAxis 
                          dataKey="name" 
                          stroke={theme.palette.mode === 'dark' ? colors.grey[100] : colors.grey[700]}
                        />
                        <YAxis 
                          stroke={theme.palette.mode === 'dark' ? colors.grey[100] : colors.grey[700]}
                          tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                        />
                        <RechartsTooltip 
                          formatter={(value) => [`$${value.toLocaleString()}`, 'Amount']}
                          labelStyle={{ color: theme.palette.mode === 'dark' ? colors.grey[100] : colors.grey[900] }}
                          contentStyle={{
                            backgroundColor: theme.palette.mode === 'dark' ? colors.primary[500] : 'white',
                            border: `1px solid ${theme.palette.mode === 'dark' ? colors.primary[600] : colors.grey[300]}`,
                            borderRadius: '8px'
                          }}
                        />
                        <Legend />
                        <Area
                          type="monotone"
                          dataKey="revenue"
                          name="Revenue"
                          stackId="1"
                          stroke={colors.greenAccent[500]}
                          fill={colors.greenAccent[500]}
                          fillOpacity={0.3}
                        />
                        <Area
                          type="monotone"
                          dataKey="profit"
                          name="Profit"
                          stackId="2"
                          stroke={colors.blueAccent[500]}
                          fill={colors.blueAccent[500]}
                          fillOpacity={0.3}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Room Occupancy Pie Chart */}
            <Grid size={{ xs: 12, xl: 4 }}>
              <Card
                sx={{
                  height: '100%',
                  borderRadius: '12px',
                  background: theme.palette.mode === 'dark'
                    ? colors.primary[400]
                    : colors.primary[50],
                }}
              >
                <CardContent>
                  <Typography variant="h6" fontWeight={700} gutterBottom>
                    Room Type Distribution
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                    Current occupancy by room type
                  </Typography>
                  <Box sx={{ height: 250, mb: 2, minWidth: 0, minHeight: 0 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={roomOccupancyData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {roomOccupancyData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip 
                          formatter={(value, name, props) => [
                            `${value} rooms occupied`,
                            props.payload.name
                          ]}
                        />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </Box>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {roomOccupancyData.map((room, index) => (
                      <Chip
                        key={index}
                        label={`${room.name}: ${room.value}/${room.total}`}
                        size="small"
                        sx={{
                          backgroundColor: `${room.color}20`,
                          color: room.color,
                          fontWeight: 500,
                        }}
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Recent Bookings Table */}
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, xl: 8 }}>
              <Card
                sx={{
                  borderRadius: '12px',
                  background: theme.palette.mode === 'dark'
                    ? colors.primary[400]
                    : colors.primary[50],
                  overflow: 'auto'
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Box>
                      <Typography variant="h6" fontWeight={700}>
                        Recent Bookings
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Latest guest reservations
                      </Typography>
                    </Box>
                    <Button
                      endIcon={<ArrowForward />}
                      sx={{
                        color: colors.blueAccent[500],
                        '&:hover': {
                          backgroundColor: theme.palette.mode === 'dark'
                            ? colors.blueAccent[800]
                            : colors.blueAccent[50],
                        }
                      }}
                    >
                      View All
                    </Button>
                  </Box>
                  <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Guest</TableCell>
                          <TableCell>Room</TableCell>
                          <TableCell>Stay</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell align="right">Amount</TableCell>
                          <TableCell align="right">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {recentBookings.map((booking) => (
                          <TableRow
                            key={booking.id}
                            hover
                            sx={{
                              '&:hover': {
                                backgroundColor: theme.palette.mode === 'dark'
                                  ? colors.primary[600]
                                  : colors.primary[100],
                              }
                            }}
                          >
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar
                                  sx={{
                                    width: 32,
                                    height: 32,
                                    mr: 2,
                                    backgroundColor: colors.primary[300],
                                  }}
                                >
                                  {booking.guest.charAt(0)}
                                </Avatar>
                                <Box>
                                  <Typography variant="subtitle2" fontWeight={600}>
                                    {booking.guest}
                                  </Typography>
                                  <Typography variant="caption" color="textSecondary">
                                    {booking.nights} nights
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">{booking.room}</Typography>
                              <Typography variant="caption" color="textSecondary">
                                {booking.checkIn} → {booking.checkOut}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={`${booking.nights} nights`}
                                size="small"
                                sx={{
                                  backgroundColor: theme.palette.mode === 'dark'
                                    ? colors.primary[600]
                                    : colors.primary[100],
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={booking.status.replace('-', ' ')}
                                size="small"
                                color={
                                  booking.status === 'checked-in' ? 'success' :
                                  booking.status === 'confirmed' ? 'primary' :
                                  booking.status === 'pending' ? 'warning' : 'default'
                                }
                                sx={{ textTransform: 'capitalize' }}
                              />
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="subtitle2" fontWeight={700}>
                                {booking.amount}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <IconButton size="small">
                                <MoreVert />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>

            {/* Services Usage Grid */}
            <Grid size={{ xs: 12, xl: 4 }}>
              <Card
                sx={{
                  height: '100%',
                  borderRadius: '12px',
                  background: theme.palette.mode === 'dark'
                    ? colors.primary[400]
                    : colors.primary[50],
                }}
              >
                <CardContent>
                  <Typography variant="h6" fontWeight={700} gutterBottom>
                    Hotel Services Usage
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                    Revenue from additional services
                  </Typography>
                  <Grid container spacing={2}>
                    {hotelServices.map((service, index) => (
                      <Grid size={{ xs: 6, sm: 4, lg: 6, xl: 6 }} key={index}>
                        <ServiceCard service={service} />
                      </Grid>
                    ))}
                  </Grid>
                  <Box sx={{ mt: 3, pt: 2, borderTop: `1px solid ${theme.palette.mode === 'dark' ? colors.primary[600] : colors.grey[200]}` }}>
                    <Typography variant="body2" color="textSecondary" align="center">
                      Total services revenue this month: <strong>$48,300</strong>
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Bottom Stats */}
          <Grid container spacing={3} sx={{ mt: 3 }}>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: '12px',
                  background: `linear-gradient(135deg, ${colors.primary[400]}, ${colors.primary[600]})`,
                  color: 'white',
                  height: '100%'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Today's Arrivals
                    </Typography>
                    <Typography variant="h4" fontWeight={700}>
                      24
                    </Typography>
                  </Box>
                  <EventAvailable sx={{ fontSize: 40, opacity: 0.8 }} />
                </Box>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: '12px',
                  background: `linear-gradient(135deg, ${colors.greenAccent[400]}, ${colors.greenAccent[600]})`,
                  color: 'white',
                  height: '100%'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Today's Departures
                    </Typography>
                    <Typography variant="h4" fontWeight={700}>
                      18
                    </Typography>
                  </Box>
                  <EventBusy sx={{ fontSize: 40, opacity: 0.8 }} />
                </Box>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: '12px',
                  background: `linear-gradient(135deg, ${colors.blueAccent[400]}, ${colors.blueAccent[600]})`,
                  color: 'white',
                  height: '100%'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Rooms to Clean
                    </Typography>
                    <Typography variant="h4" fontWeight={700}>
                      12
                    </Typography>
                  </Box>
                  <CleaningServices sx={{ fontSize: 40, opacity: 0.8 }} />
                </Box>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: '12px',
                  background: `linear-gradient(135deg, ${colors.redAccent[400]}, ${colors.redAccent[600]})`,
                  color: 'white',
                  height: '100%'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Maintenance Issues
                    </Typography>
                    <Typography variant="h4" fontWeight={700}>
                      3
                    </Typography>
                  </Box>
                  <Security sx={{ fontSize: 40, opacity: 0.8 }} />
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default HomePage;
