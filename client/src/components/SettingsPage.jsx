// components/SettingsPage.jsx
import React, { useState, useContext } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Switch,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Divider,
  IconButton,
  Paper,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Slider,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  Tabs,
  Tab,
  Radio,
  RadioGroup,
  FormControlLabel,
  Checkbox,
  InputAdornment,
  Tooltip,
  useTheme,
  //FormControlLabel,
  alpha,
  LinearProgress
} from '@mui/material';
import {
  Settings,
  Palette,
  EventNote,
  DateRange,
  Notifications,
  Security,
  AccountCircle,
  Hotel,
  Language,
  Backup,
  Delete,
  Save,
  Refresh,
  CloudUpload,
  Download,
  Visibility,
  VisibilityOff,
  Lock,
  Email,
  Phone,
  LocationOn,
  CreditCard,
  Receipt,
  Business,
  Bed,
  Restaurant,
  Spa,
  Pool,
  Wifi,
  People,
  Schedule,
  CurrencyExchange,
  CalendarToday, // Fixed import
  Cloud,
  HowToReg,
  Login,
} from '@mui/icons-material';
import { tokens } from '../theme.js';
import { ColorModeContext } from '../theme.js';

const SettingsPage = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  
  const [tabValue, setTabValue] = useState(0);
  const [settings, setSettings] = useState({
    // Hotel Settings
    hotelName: 'Grand Hotel & Resort',
    hotelEmail: 'contact@grandhotel.com',
    hotelPhone: '+1 (555) 123-4567',
    hotelAddress: '123 Luxury Avenue, City, Country',
    currency: 'USD',
    timezone: 'America/New_York',
    checkInTime: '15:00',
    checkOutTime: '11:00',
    taxRate: 8.5,
    
    // Theme Settings
    themeMode: theme.palette.mode,
    primaryColor: colors.primary[500],
    accentColor: colors.greenAccent[500],
    
    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    bookingConfirmations: true,
    checkInReminders: true,
    checkOutReminders: true,
    maintenanceAlerts: true,
    marketingEmails: false,
    
    // Security Settings
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordExpiry: 90,
    failedLoginAttempts: 5,
    ipWhitelist: ['192.168.1.1', '10.0.0.1'],
    
    // Room Settings
    autoAssignRooms: true,
    allowEarlyCheckIn: false,
    allowLateCheckOut: false,
    cleaningSchedule: 'auto',
    minBookingDuration: 1,
    maxBookingDuration: 30,
    
    // Payment Settings
    acceptedPaymentMethods: ['credit_card', 'paypal', 'cash'],
    paymentGateway: 'stripe',
    autoCapturePayments: true,
    refundPolicy: 'flexible',
    
    // Integration Settings
    enableCalendarSync: true,
    enableEmailMarketing: false,
    enableSmsGateway: true,
    enableApiAccess: false,
  });

  const [openDialog, setOpenDialog] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [showPassword, setShowPassword] = useState(false);
  const [backupProgress, setBackupProgress] = useState(0);
  const [integrationStatus, setIntegrationStatus] = useState({
    calendar: 'connected',
    payment: 'connected',
    email: 'disconnected',
    sms: 'connected'
  });

  // Currencies
  const currencies = [
    { value: 'USD', label: 'US Dollar ($)' },
    { value: 'EUR', label: 'Euro (€)' },
    { value: 'GBP', label: 'British Pound (£)' },
    { value: 'JPY', label: 'Japanese Yen (¥)' },
    { value: 'CAD', label: 'Canadian Dollar (C$)' },
    { value: 'AUD', label: 'Australian Dollar (A$)' },
  ];

  // Timezones
  const timezones = [
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Asia/Tokyo',
    'Asia/Dubai',
    'Australia/Sydney'
  ];

  // Payment Gateways
  const paymentGateways = [
    { value: 'stripe', label: 'Stripe', status: 'connected' },
    { value: 'paypal', label: 'PayPal', status: 'connected' },
    { value: 'square', label: 'Square', status: 'disconnected' },
    { value: 'authorize', label: 'Authorize.net', status: 'disconnected' },
  ];

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = () => {
    // Simulate API call
    setSnackbar({
      open: true,
      message: 'Settings saved successfully!',
      severity: 'success'
    });
  };

  const handleResetSettings = () => {
    setOpenDialog('reset');
  };

  const handleBackupData = () => {
    setBackupProgress(0);
    const interval = setInterval(() => {
      setBackupProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setSnackbar({
            open: true,
            message: 'Backup completed successfully!',
            severity: 'success'
          });
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleRestoreData = () => {
    setOpenDialog('restore');
  };

  const handleDeleteData = () => {
    setOpenDialog('delete');
  };

  const handleCloseDialog = () => {
    setOpenDialog(null);
  };

  const handleConfirmAction = () => {
    switch (openDialog) {
      case 'reset':
        // Reset settings logic
        setSnackbar({
          open: true,
          message: 'Settings reset to defaults!',
          severity: 'info'
        });
        break;
      case 'restore':
        // Restore data logic
        setSnackbar({
          open: true,
          message: 'Data restored from backup!',
          severity: 'success'
        });
        break;
      case 'delete':
        // Delete data logic
        setSnackbar({
          open: true,
          message: 'Data deleted successfully!',
          severity: 'warning'
        });
        break;
    }
    setOpenDialog(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const TabPanel = ({ children, value, index }) => {
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        style={{ width: '100%' }}
      >
        {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
      </div>
    );
  };

  return (
    <Box sx={{ flexGrow: 1, p: { xs: 2, sm: 3 }, minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Settings sx={{ fontSize: 32, mr: 2, color: colors.primary[300] }} />
          <Box>
            <Typography variant="h4" fontWeight={700}>
              Hotel Settings
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Configure your hotel management system preferences
            </Typography>
          </Box>
        </Box>
        
        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={handleSaveSettings}
            sx={{
              background: `linear-gradient(45deg, ${colors.greenAccent[500]}, ${colors.blueAccent[500]})`,
              '&:hover': {
                background: `linear-gradient(45deg, ${colors.greenAccent[600]}, ${colors.blueAccent[600]})`,
              }
            }}
          >
            Save Changes
          </Button>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={handleResetSettings}
          >
            Reset to Defaults
          </Button>
          <Button
            variant="outlined"
            startIcon={<CloudUpload />}
            onClick={handleBackupData}
          >
            Backup Data
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<Delete />}
            onClick={handleDeleteData}
          >
            Delete Data
          </Button>
        </Box>
      </Box>

      {/* Tabs */}
      <Paper sx={{ borderRadius: '12px', mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            borderBottom: `1px solid ${theme.palette.mode === 'dark' ? colors.primary[600] : colors.grey[200]}`,
            '& .MuiTab-root': {
              minHeight: 64,
            }
          }}
        >
          <Tab icon={<Hotel />} label="Hotel Info" />
          <Tab icon={<Palette />} label="Theme & Display" />
          <Tab icon={<Notifications />} label="Notifications" />
          <Tab icon={<Security />} label="Security" />
          <Tab icon={<Bed />} label="Room Settings" />
          <Tab icon={<CreditCard />} label="Payments" />
          <Tab icon={<Language />} label="Integrations" />
          <Tab icon={<Backup />} label="Backup & Restore" />
        </Tabs>

        {/* Tab 1: Hotel Info */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: '12px' }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <Business sx={{ mr: 1 }} /> Basic Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Hotel Name"
                        value={settings.hotelName}
                        onChange={(e) => handleSettingChange('hotelName', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Email Address"
                        type="email"
                        value={settings.hotelEmail}
                        onChange={(e) => handleSettingChange('hotelEmail', e.target.value)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Email />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Phone Number"
                        value={settings.hotelPhone}
                        onChange={(e) => handleSettingChange('hotelPhone', e.target.value)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Phone />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Address"
                        multiline
                        rows={2}
                        value={settings.hotelAddress}
                        onChange={(e) => handleSettingChange('hotelAddress', e.target.value)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LocationOn />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: '12px' }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <Schedule sx={{ mr: 1 }} /> Operations
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>Currency</InputLabel>
                        <Select
                          value={settings.currency}
                          label="Currency"
                          onChange={(e) => handleSettingChange('currency', e.target.value)}
                          startAdornment={
                            <InputAdornment position="start">
                              <CurrencyExchange />
                            </InputAdornment>
                          }
                        >
                          {currencies.map((currency) => (
                            <MenuItem key={currency.value} value={currency.value}>
                              {currency.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>Timezone</InputLabel>
                        <Select
                          value={settings.timezone}
                          label="Timezone"
                          onChange={(e) => handleSettingChange('timezone', e.target.value)}
                        >
                          {timezones.map((tz) => (
                            <MenuItem key={tz} value={tz}>
                              {tz}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Check-in Time"
                        type="time"
                        value={settings.checkInTime}
                        onChange={(e) => handleSettingChange('checkInTime', e.target.value)}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Check-out Time"
                        type="time"
                        value={settings.checkOutTime}
                        onChange={(e) => handleSettingChange('checkOutTime', e.target.value)}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="body2" sx={{ flexGrow: 1 }}>
                          Tax Rate
                        </Typography>
                        <TextField
                          size="small"
                          type="number"
                          value={settings.taxRate}
                          onChange={(e) => handleSettingChange('taxRate', parseFloat(e.target.value))}
                          InputProps={{
                            endAdornment: <InputAdornment position="end">%</InputAdornment>,
                          }}
                          sx={{ width: 100 }}
                        />
                      </Box>
                      <Slider
                        value={settings.taxRate}
                        onChange={(e, value) => handleSettingChange('taxRate', value)}
                        min={0}
                        max={20}
                        step={0.1}
                        sx={{ mt: 2 }}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Tab 2: Theme & Display */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: '12px' }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Color Theme
                  </Typography>
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Typography>Dark Mode</Typography>
                      <Switch
                        checked={settings.themeMode === 'dark'}
                        onChange={(e) => {
                          handleSettingChange('themeMode', e.target.checked ? 'dark' : 'light');
                          colorMode.toggleColorMode();
                        }}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                      {['primary', 'accent'].map((type) => (
                        <Box key={type} sx={{ flex: 1, minWidth: 120 }}>
                          <Typography variant="caption" color="textSecondary" sx={{ mb: 1, display: 'block' }}>
                            {type === 'primary' ? 'Primary Color' : 'Accent Color'}
                          </Typography>
                          <Box
                            sx={{
                              width: '100%',
                              height: 40,
                              borderRadius: '8px',
                              backgroundColor: type === 'primary' ? settings.primaryColor : settings.accentColor,
                              border: `2px solid ${theme.palette.mode === 'dark' ? colors.primary[600] : colors.grey[300]}`,
                              cursor: 'pointer',
                            }}
                            onClick={() => {/* Color picker dialog would go here */}}
                          />
                        </Box>
                      ))}
                    </Box>
                  </Box>
                  
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Display Preferences
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemText 
                        primary="Show Room Images" 
                        secondary="Display room photos in listings"
                      />
                      <Switch defaultChecked />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Compact View" 
                        secondary="Use compact table layouts"
                      />
                      <Switch />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Animations" 
                        secondary="Enable interface animations"
                      />
                      <Switch defaultChecked />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: '12px' }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Theme Preview
                  </Typography>
                  <Paper
                    sx={{
                      p: 3,
                      borderRadius: '12px',
                      background: theme.palette.background.default,
                      border: `1px solid ${theme.palette.mode === 'dark' ? colors.primary[600] : colors.grey[200]}`,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Avatar sx={{ bgcolor: colors.primary[500], mr: 2 }}>H</Avatar>
                      <Box>
                        <Typography variant="subtitle1" fontWeight={600}>
                          Grand Hotel Dashboard
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          Preview of current theme
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Paper
                          sx={{
                            p: 2,
                            borderRadius: '8px',
                            bgcolor: theme.palette.primary.main,
                            color: 'white',
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="caption">Primary</Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={6}>
                        <Paper
                          sx={{
                            p: 2,
                            borderRadius: '8px',
                            bgcolor: colors.greenAccent[500],
                            color: 'white',
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="caption">Accent</Typography>
                        </Paper>
                      </Grid>
                    </Grid>
                    
                    <Box sx={{ mt: 3 }}>
                      <Button
                        variant="contained"
                        fullWidth
                        sx={{ mb: 1 }}
                      >
                        Primary Button
                      </Button>
                      <Button
                        variant="outlined"
                        fullWidth
                      >
                        Secondary Button
                      </Button>
                    </Box>
                  </Paper>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Tab 3: Notifications */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: '12px' }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Notification Channels
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <Email />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Email Notifications" 
                        secondary="Receive updates via email"
                      />
                      <ListItemSecondaryAction>
                        <Switch
                          checked={settings.emailNotifications}
                          onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Phone />
                      </ListItemIcon>
                      <ListItemText 
                        primary="SMS Notifications" 
                        secondary="Receive updates via SMS"
                      />
                      <ListItemSecondaryAction>
                        <Switch
                          checked={settings.smsNotifications}
                          onChange={(e) => handleSettingChange('smsNotifications', e.target.checked)}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: '12px' }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Notification Types
                  </Typography>
                  <List>
                    {[
                      { key: 'bookingConfirmations', label: 'Booking Confirmations', icon: <Receipt /> },
                      { key: 'checkInReminders', label: 'Check-in Reminders', icon: <Hotel /> },
                      { key: 'checkOutReminders', label: 'Check-out Reminders', icon: <Hotel /> },
                      { key: 'maintenanceAlerts', label: 'Maintenance Alerts', icon: <Spa /> },
                      { key: 'marketingEmails', label: 'Marketing Emails', icon: <Email /> },
                    ].map((item) => (
                      <ListItem key={item.key}>
                        <ListItemIcon>
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText primary={item.label} />
                        <ListItemSecondaryAction>
                          <Switch
                            checked={settings[item.key]}
                            onChange={(e) => handleSettingChange(item.key, e.target.checked)}
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Tab 4: Security */}
        <TabPanel value={tabValue} index={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: '12px' }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <Lock sx={{ mr: 1 }} /> Authentication
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <Security />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Two-Factor Authentication" 
                        secondary="Add an extra layer of security"
                      />
                      <ListItemSecondaryAction>
                        <Switch
                          checked={settings.twoFactorAuth}
                          onChange={(e) => handleSettingChange('twoFactorAuth', e.target.checked)}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                  </List>
                  
                  <Typography variant="subtitle1" fontWeight={600} sx={{ mt: 3, mb: 2 }}>
                    Session Settings
                  </Typography>
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Typography>Session Timeout</Typography>
                      <Typography variant="body2" color="primary">
                        {settings.sessionTimeout} minutes
                      </Typography>
                    </Box>
                    <Slider
                      value={settings.sessionTimeout}
                      onChange={(e, value) => handleSettingChange('sessionTimeout', value)}
                      min={5}
                      max={120}
                      step={5}
                    />
                  </Box>
                  
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Typography>Password Expiry</Typography>
                      <Typography variant="body2" color="primary">
                        {settings.passwordExpiry} days
                      </Typography>
                    </Box>
                    <Slider
                      value={settings.passwordExpiry}
                      onChange={(e, value) => handleSettingChange('passwordExpiry', value)}
                      min={30}
                      max={365}
                      step={30}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: '12px' }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Security Rules
                  </Typography>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography gutterBottom>
                      Failed Login Attempts
                    </Typography>
                    <TextField
                      fullWidth
                      type="number"
                      value={settings.failedLoginAttempts}
                      onChange={(e) => handleSettingChange('failedLoginAttempts', parseInt(e.target.value))}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">attempts</InputAdornment>,
                      }}
                    />
                  </Box>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography gutterBottom>
                      IP Whitelist
                    </Typography>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      value={settings.ipWhitelist.join('\n')}
                      onChange={(e) => handleSettingChange('ipWhitelist', e.target.value.split('\n'))}
                      placeholder="Enter one IP per line"
                    />
                  </Box>
                  
                  <Box>
                    <Typography gutterBottom sx={{ mb: 2 }}>
                      Security Audit Log
                    </Typography>
                    <Paper
                      sx={{
                        p: 2,
                        borderRadius: '8px',
                        bgcolor: theme.palette.mode === 'dark' ? colors.primary[600] : colors.grey[50],
                      }}
                    >
                      <Typography variant="body2" color="textSecondary">
                        Last security audit: Today, 10:30 AM
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        No security issues found
                      </Typography>
                    </Paper>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Tab 5: Room Settings */}
        <TabPanel value={tabValue} index={4}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: '12px' }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Room Management
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemText 
                        primary="Auto-assign Rooms" 
                        secondary="Automatically assign rooms to bookings"
                      />
                      <Switch
                        checked={settings.autoAssignRooms}
                        onChange={(e) => handleSettingChange('autoAssignRooms', e.target.checked)}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Allow Early Check-in" 
                        secondary="Let guests check in before scheduled time"
                      />
                      <Switch
                        checked={settings.allowEarlyCheckIn}
                        onChange={(e) => handleSettingChange('allowEarlyCheckIn', e.target.checked)}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Allow Late Check-out" 
                        secondary="Let guests check out after scheduled time"
                      />
                      <Switch
                        checked={settings.allowLateCheckOut}
                        onChange={(e) => handleSettingChange('allowLateCheckOut', e.target.checked)}
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: '12px' }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Booking Rules
                  </Typography>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography gutterBottom>
                      Minimum Booking Duration
                    </Typography>
                    <TextField
                      fullWidth
                      type="number"
                      value={settings.minBookingDuration}
                      onChange={(e) => handleSettingChange('minBookingDuration', parseInt(e.target.value))}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">nights</InputAdornment>,
                      }}
                    />
                  </Box>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography gutterBottom>
                      Maximum Booking Duration
                    </Typography>
                    <TextField
                      fullWidth
                      type="number"
                      value={settings.maxBookingDuration}
                      onChange={(e) => handleSettingChange('maxBookingDuration', parseInt(e.target.value))}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">nights</InputAdornment>,
                      }}
                    />
                  </Box>
                  
                  <Box>
                    <Typography gutterBottom>
                      Cleaning Schedule
                    </Typography>
                    <FormControl fullWidth>
                      <RadioGroup
                        value={settings.cleaningSchedule}
                        onChange={(e) => handleSettingChange('cleaningSchedule', e.target.value)}
                      >
                        <FormControlLabel value="auto" control={<Radio />} label="Auto-schedule" />
                        <FormControlLabel value="manual" control={<Radio />} label="Manual assignment" />
                        <FormControlLabel value="on-demand" control={<Radio />} label="On-demand only" />
                      </RadioGroup>
                    </FormControl>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Tab 6: Payments */}
        <TabPanel value={tabValue} index={5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: '12px' }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Payment Methods
                  </Typography>
                  <List>
                    {[
                      { value: 'credit_card', label: 'Credit/Debit Cards' },
                      { value: 'paypal', label: 'PayPal' },
                      { value: 'bank_transfer', label: 'Bank Transfer' },
                      { value: 'cash', label: 'Cash' },
                      { value: 'crypto', label: 'Cryptocurrency' },
                    ].map((method) => (
                      <ListItem key={method.value}>
                        <Checkbox
                          checked={settings.acceptedPaymentMethods.includes(method.value)}
                          onChange={(e) => {
                            const newMethods = e.target.checked
                              ? [...settings.acceptedPaymentMethods, method.value]
                              : settings.acceptedPaymentMethods.filter(m => m !== method.value);
                            handleSettingChange('acceptedPaymentMethods', newMethods);
                          }}
                        />
                        <ListItemText primary={method.label} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: '12px' }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Payment Gateway
                  </Typography>
                  
                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel>Select Gateway</InputLabel>
                    <Select
                      value={settings.paymentGateway}
                      label="Select Gateway"
                      onChange={(e) => handleSettingChange('paymentGateway', e.target.value)}
                    >
                      {paymentGateways.map((gateway) => (
                        <MenuItem key={gateway.value} value={gateway.value}>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                            <span>{gateway.label}</span>
                            <Chip
                              label={gateway.status}
                              size="small"
                              color={gateway.status === 'connected' ? 'success' : 'default'}
                              variant="outlined"
                            />
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                      <Typography>Auto-capture Payments</Typography>
                      <Switch
                        checked={settings.autoCapturePayments}
                        onChange={(e) => handleSettingChange('autoCapturePayments', e.target.checked)}
                      />
                    </Box>
                    <Typography variant="caption" color="textSecondary">
                      Automatically capture payments at check-in
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography gutterBottom>
                      Refund Policy
                    </Typography>
                    <FormControl fullWidth>
                      <RadioGroup
                        value={settings.refundPolicy}
                        onChange={(e) => handleSettingChange('refundPolicy', e.target.value)}
                      >
                        <FormControlLabel value="flexible" control={<Radio />} label="Flexible (Full refund up to 24h before)" />
                        <FormControlLabel value="moderate" control={<Radio />} label="Moderate (50% refund up to 48h before)" />
                        <FormControlLabel value="strict" control={<Radio />} label="Strict (No refunds)" />
                      </RadioGroup>
                    </FormControl>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Tab 7: Integrations */}
        <TabPanel value={tabValue} index={6}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card sx={{ borderRadius: '12px' }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Connected Services
                  </Typography>
                  
                  <Grid container spacing={2}>
                    {[
                      { key: 'calendar', label: 'Calendar Sync', icon: <EventNote  />, status: integrationStatus.calendar },
                      { key: 'payment', label: 'Payment Gateway', icon: <CreditCard />, status: integrationStatus.payment },
                      { key: 'email', label: 'Email Service', icon: <Email />, status: integrationStatus.email },
                      { key: 'sms', label: 'SMS Gateway', icon: <Phone />, status: integrationStatus.sms },
                    ].map((service) => (
                      <Grid item xs={12} sm={6} md={3} key={service.key}>
                        <Paper
                          sx={{
                            p: 3,
                            borderRadius: '12px',
                            border: `1px solid ${theme.palette.mode === 'dark' ? colors.primary[600] : colors.grey[200]}`,
                            textAlign: 'center',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: theme.shadows[4],
                            }
                          }}
                        >
                          <Box sx={{ mb: 2 }}>
                            {service.icon}
                          </Box>
                          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                            {service.label}
                          </Typography>
                          <Chip
                            label={service.status}
                            size="small"
                            color={service.status === 'connected' ? 'success' : 'default'}
                            variant="outlined"
                          />
                          <Button
                            size="small"
                            sx={{ mt: 2 }}
                            variant={service.status === 'connected' ? 'outlined' : 'contained'}
                          >
                            {service.status === 'connected' ? 'Disconnect' : 'Connect'}
                          </Button>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                  
                  <Divider sx={{ my: 3 }} />
                  
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    API Access
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Box>
                      <Typography>Enable API Access</Typography>
                      <Typography variant="caption" color="textSecondary">
                        Allow third-party applications to access your data
                      </Typography>
                    </Box>
                    <Switch
                      checked={settings.enableApiAccess}
                      onChange={(e) => handleSettingChange('enableApiAccess', e.target.checked)}
                    />
                  </Box>
                  
                  {settings.enableApiAccess && (
                    <Paper
                      sx={{
                        p: 2,
                        borderRadius: '8px',
                        bgcolor: theme.palette.mode === 'dark' ? colors.primary[600] : colors.grey[50],
                        mt: 2,
                      }}
                    >
                      <Typography variant="subtitle2" gutterBottom>
                        API Key
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TextField
                          fullWidth
                          value="sk_live_************************"
                          type={showPassword ? 'text' : 'password'}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton onClick={() => setShowPassword(!showPassword)}>
                                  {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                        <Button variant="outlined">Regenerate</Button>
                      </Box>
                    </Paper>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Tab 8: Backup & Restore */}
        <TabPanel value={tabValue} index={7}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: '12px' }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <Backup sx={{ mr: 1 }} /> Backup Data
                  </Typography>
                  
                  <Paper
                    sx={{
                      p: 3,
                      borderRadius: '8px',
                      bgcolor: theme.palette.mode === 'dark' ? colors.primary[600] : colors.grey[50],
                      mb: 3,
                    }}
                  >
                    <Typography variant="subtitle2" gutterBottom>
                      Backup Progress
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                      <Box sx={{ flexGrow: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={backupProgress}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                          }}
                        />
                      </Box>
                      <Typography variant="body2">{backupProgress}%</Typography>
                    </Box>
                    <Typography variant="caption" color="textSecondary">
                      Last backup: Today, 02:30 AM
                    </Typography>
                  </Paper>
                  
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      variant="contained"
                      startIcon={<CloudUpload />}
                      onClick={handleBackupData}
                      fullWidth
                    >
                      Create Backup
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Download />}
                      onClick={handleRestoreData}
                      fullWidth
                    >
                      Restore
                    </Button>
                  </Box>
                  
                  <Divider sx={{ my: 3 }} />
                  
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Backup Schedule
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemText 
                        primary="Daily Backups" 
                        secondary="Automatically backup at 2:30 AM"
                      />
                      <Switch defaultChecked />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Cloud Storage" 
                        secondary="Upload backups to cloud storage"
                      />
                      <Switch />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: '12px' }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Backup History
                  </Typography>
                  
                  <List>
                    {[
                      { date: 'Today, 02:30 AM', size: '245 MB', type: 'Automatic' },
                      { date: 'Yesterday, 02:30 AM', size: '240 MB', type: 'Automatic' },
                      { date: 'Jan 13, 02:30 AM', size: '238 MB', type: 'Automatic' },
                      { date: 'Jan 12, 02:30 AM', size: '235 MB', type: 'Automatic' },
                      { date: 'Jan 11, 10:15 AM', size: '230 MB', type: 'Manual' },
                    ].map((backup, index) => (
                      <ListItem
                        key={index}
                        sx={{
                          borderBottom: index < 4 ? `1px solid ${theme.palette.mode === 'dark' ? colors.primary[600] : colors.grey[200]}` : 'none',
                        }}
                      >
                        <ListItemText
                          primary={backup.date}
                          secondary={`${backup.size} • ${backup.type}`}
                        />
                        <IconButton size="small">
                          <Download />
                        </IconButton>
                      </ListItem>
                    ))}
                  </List>
                  
                  <Divider sx={{ my: 3 }} />
                  
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Storage Usage
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2">Backups</Typography>
                      <Typography variant="body2">1.2 GB</Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={60}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        mb: 2,
                      }}
                    />
                  </Box>
                  
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2">Database</Typography>
                      <Typography variant="body2">450 MB</Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={30}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        mb: 2,
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>

      {/* Dialogs */}
      <Dialog open={openDialog === 'reset'} onClose={handleCloseDialog}>
        <DialogTitle>Reset Settings</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            This will reset all settings to their default values. This action cannot be undone.
          </Alert>
          <Typography>
            Are you sure you want to reset all settings?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleConfirmAction} color="warning" variant="contained">
            Reset Settings
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDialog === 'restore'} onClose={handleCloseDialog}>
        <DialogTitle>Restore Data</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            Select a backup file to restore your data. This will overwrite current data.
          </Alert>
          <Button
            variant="outlined"
            component="label"
            fullWidth
            startIcon={<CloudUpload />}
          >
            Select Backup File
            <input type="file" hidden />
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleConfirmAction} variant="contained">
            Restore
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDialog === 'delete'} onClose={handleCloseDialog}>
        <DialogTitle>Delete Data</DialogTitle>
        <DialogContent>
          <Alert severity="error" sx={{ mb: 2 }}>
            This will permanently delete all data. This action cannot be undone!
          </Alert>
          <Typography>
            Type "DELETE" to confirm:
          </Typography>
          <TextField
            fullWidth
            placeholder="DELETE"
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleConfirmAction} color="error" variant="contained">
            Delete All Data
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SettingsPage;