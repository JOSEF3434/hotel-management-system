// components/DashboardContent.jsx
import React from "react";
import { 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  LinearProgress,
  IconButton
} from "@mui/material";
import { 
  Hotel, 
  People, 
  CalendarToday, 
  AttachMoney,
  TrendingUp,
  TrendingDown,
  MoreVert
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../theme.js";

const StatCard = ({ title, value, icon: Icon, change, color }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
  return (
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography color="textSecondary" gutterBottom variant="body2">
              {title}
            </Typography>
            <Typography variant="h4" fontWeight={700}>
              {value}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              {change >= 0 ? (
                <TrendingUp sx={{ color: colors.greenAccent[500], mr: 0.5 }} />
              ) : (
                <TrendingDown sx={{ color: colors.redAccent[500], mr: 0.5 }} />
              )}
              <Typography 
                variant="body2" 
                sx={{ 
                  color: change >= 0 ? colors.greenAccent[500] : colors.redAccent[500] 
                }}
              >
                {change >= 0 ? '+' : ''}{change}% from last month
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              backgroundColor: `${color}20`,
              borderRadius: '12px',
              padding: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Icon sx={{ color: color, fontSize: 28 }} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

const RoomOccupancyCard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
  const occupancyData = [
    { label: 'Deluxe Suite', value: 85, color: colors.greenAccent[500] },
    { label: 'Standard Room', value: 70, color: colors.blueAccent[500] },
    { label: 'Executive Suite', value: 90, color: colors.redAccent[500] },
    { label: 'Presidential', value: 60, color: colors.primary[300] },
  ];

  return (
    <Card 
      sx={{ 
        height: '100%',
        background: theme.palette.mode === 'dark' 
          ? colors.primary[400] 
          : colors.primary[50],
        borderRadius: '12px',
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" fontWeight={600}>
            Room Occupancy
          </Typography>
          <IconButton size="small">
            <MoreVert />
          </IconButton>
        </Box>
        {occupancyData.map((room, index) => (
          <Box key={room.label} sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">{room.label}</Typography>
              <Typography variant="body2" fontWeight={600}>{room.value}%</Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={room.value}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: theme.palette.mode === 'dark' 
                  ? colors.primary[600] 
                  : colors.grey[200],
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
                  backgroundColor: room.color,
                }
              }}
            />
          </Box>
        ))}
      </CardContent>
    </Card>
  );
};

const DashboardContent = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
  const stats = [
    { 
      title: 'TOTAL ROOMS', 
      value: '156', 
      icon: Hotel, 
      change: 12.5, 
      color: colors.blueAccent[500] 
    },
    { 
      title: 'ACTIVE GUESTS', 
      value: '243', 
      icon: People, 
      change: 8.2, 
      color: colors.greenAccent[500] 
    },
    { 
      title: 'TODAY CHECK-INS', 
      value: '42', 
      icon: CalendarToday, 
      change: -3.4, 
      color: colors.redAccent[500] 
    },
    { 
      title: 'DAILY REVENUE', 
      value: '$24,580', 
      icon: AttachMoney, 
      change: 18.7, 
      color: colors.primary[300] 
    },
  ];

  return (
    <Box 
      sx={{ 
        flexGrow: 1,
        p: { xs: 2, sm: 3 },
        backgroundColor: theme.palette.background.default,
        minHeight: '100vh',
      }}
    >
      {/* Welcome Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Welcome back, John 👋
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Here's what's happening with your hotel today.
        </Typography>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatCard {...stat} />
          </Grid>
        ))}
      </Grid>

      {/* Additional Cards Grid */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card 
            sx={{ 
              height: '100%',
              background: theme.palette.mode === 'dark' 
                ? colors.primary[400] 
                : colors.primary[50],
              borderRadius: '12px',
            }}
          >
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Recent Bookings
              </Typography>
              {/* Add booking chart/table here */}
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography color="textSecondary">
                  Booking chart/table component would go here
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <RoomOccupancyCard />
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardContent;