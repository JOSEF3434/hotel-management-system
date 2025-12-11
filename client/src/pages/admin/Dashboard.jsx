// File: src/pages/admin/Dashboard.jsx
import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Card,
  CardContent,
  Grid,
  IconButton,
} from '@mui/material';
import {
  Logout,
  Menu as MenuIcon,
  Hotel,
  People,
  Bed,
  Receipt,
} from '@mui/icons-material';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const stats = [
    { label: 'Total Rooms', value: '45', icon: <Bed />, color: 'blue' },
    { label: 'Occupied', value: '32', icon: <Hotel />, color: 'green' },
    { label: 'Check-ins Today', value: '8', icon: <People />, color: 'purple' },
    { label: 'Revenue Today', value: '$4,250', icon: <Receipt />, color: 'orange' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* AppBar */}
      <AppBar position="static" className="bg-linear-to-r from-blue-600 to-indigo-600">
        <Toolbar>
          <IconButton edge="start" color="inherit" className="mr-4">
            <MenuIcon />
          </IconButton>
          <Hotel className="mr-2" />
          <Typography variant="h6" className="flex-grow">
            Hotel Management System
          </Typography>
          <Typography variant="body1" className="mr-4">
            Welcome, {user?.name} ({user?.role})
          </Typography>
          <Button
            color="inherit"
            onClick={handleLogout}
            startIcon={<Logout />}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="xl" className="py-8">
        <Typography variant="h4" className="mb-2 font-bold text-gray-800">
          Dashboard Overview
        </Typography>
        <Typography variant="body1" className="mb-8 text-gray-600">
          Welcome back! Here's what's happening with your hotel today.
        </Typography>

        {/* Stats Cards */}
        <Grid container spacing={3} className="mb-8">
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent>
                  <Box className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                      <div className={`text-${stat.color}-600`}>
                        {stat.icon}
                      </div>
                    </div>
                    <Typography variant="h3" className="font-bold">
                      {stat.value}
                    </Typography>
                  </Box>
                  <Typography variant="h6" className="text-gray-800">
                    {stat.label}
                  </Typography>
                  <Typography variant="body2" className="text-gray-500">
                    +12% from yesterday
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Quick Actions */}
        <Card className="shadow-lg">
          <CardContent>
            <Typography variant="h5" className="mb-4 font-bold">
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} md={3}>
                <Button
                  fullWidth
                  variant="contained"
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                >
                  Check-in Guest
                </Button>
              </Grid>
              <Grid item xs={6} md={3}>
                <Button
                  fullWidth
                  variant="contained"
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                >
                  New Booking
                </Button>
              </Grid>
              <Grid item xs={6} md={3}>
                <Button
                  fullWidth
                  variant="contained"
                  className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                >
                  View Reports
                </Button>
              </Grid>
              <Grid item xs={6} md={3}>
                <Button
                  fullWidth
                  variant="contained"
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                >
                  Manage Rooms
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Box className="mt-8">
          <Typography variant="h5" className="mb-4 font-bold">
            Recent Activity
          </Typography>
          <Card className="shadow-lg">
            <CardContent>
              <div className="space-y-4">
                {['Guest John Doe checked into Room 101', 'Room 205 cleaned by staff', 'New booking from Jane Smith', 'Payment received for Room 301'].map(
                  (activity, index) => (
                    <div key={index} className="flex items-center p-3 hover:bg-gray-50 rounded-lg">
                      <div className="w-3 h-3 rounded-full bg-blue-500 mr-3"></div>
                      <Typography>{activity}</Typography>
                      <Typography variant="caption" className="ml-auto text-gray-500">
                        2 hours ago
                      </Typography>
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </div>
  );
};

export default Dashboard;
