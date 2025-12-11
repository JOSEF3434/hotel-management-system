// App.jsx - Fixed version
import './App.css'
import { CssBaseline, ThemeProvider, Box } from "@mui/material";
import { ColorModeContext, useMode } from "./theme.js";
import Navbar from "./components/Navbar.jsx";
import HomePage from "./components/HomePage.jsx";
import SettingsPage from "./components/SettingsPage.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/admin/Dashboard';
import ProtectedRoute from './routes/ProtectedRoute';
import AuthProvider from './context/AuthProvider.jsx';
import ForgotPassword from './pages/auth/ForgotPassword';
import GuestHomePage from './components/GuestHomePage.jsx';

function App() {
  const [theme, colorMode] = useMode();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <Router>
              <Navbar />
            {/* CONDITIONAL NAVBAR: Only show for admin routes */}
            <Routes>
              <Route path="/*" element={
                <>
                  {/* Show Navbar only for admin pages */}
                  <Box sx={{ display: 'flex' }}>
                    <Routes>
                      <Route path="/admin/*" element={<Navbar />} />
                      <Route path="/settings/*" element={<Navbar />} />
                      <Route path="/dashboard/*" element={<Navbar />} />
                      {/* Add other admin routes that need navbar */}
                    </Routes>
                    
                    <Box
                      component="main"
                      sx={{
                        flexGrow: 1,
                        width: '100%',
                        // Only add margin for admin routes
                        ml: 0,
                        transition: theme.transitions.create(['width', 'margin'], {
                          easing: theme.transitions.easing.sharp,
                          duration: theme.transitions.duration.leavingScreen,
                        }),
                      }}
                    >
                      <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<GuestHomePage />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signin" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/signup" element={<Register />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        
                        {/* Admin Routes (with navbar) */}
                        <Route path="/admin" element={<HomePage />} />
                        <Route path="/settings" element={<SettingsPage />} />
                        
                        {/* Protected Routes */}
                        <Route element={<ProtectedRoute />}>
                          <Route path="/dashboard" element={<Dashboard />} />
                          {/* Add other protected routes here */}
                        </Route>
                        
                        {/* Fallback */}
                        <Route path="*" element={<GuestHomePage />} />
                      </Routes>
                    </Box>
                  </Box>
                </>
              } />
            </Routes>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  )
}

export default App