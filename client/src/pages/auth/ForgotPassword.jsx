import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  TextField,
  Button,
  Alert,
  Paper,
  Typography,
  Box,
} from '@mui/material';
import {
  Email,
  ArrowBack,
  CheckCircle,
  Hotel,
} from '@mui/icons-material';
import authService from '../../services/auth.service';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await authService.forgotPassword(email);
      setSuccess(true);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Paper elevation={3} className="p-8 rounded-2xl shadow-xl">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="flex justify-center mb-4"
            >
              <div className="bg-gradient-to-r from-orange-600 to-red-600 p-3 rounded-full">
                <Hotel className="text-white text-4xl" />
              </div>
            </motion.div>
            <Typography variant="h4" className="font-bold text-gray-800 mb-2">
              Forgot Password
            </Typography>
            <Typography variant="body2" className="text-gray-600">
              Enter your email to reset your password
            </Typography>
          </div>

          {/* Success Message */}
          {success && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6"
            >
              <Alert severity="success" icon={<CheckCircle />} className="rounded-lg">
                <div>
                  <Typography variant="body1" className="font-semibold">
                    Reset email sent!
                  </Typography>
                  <Typography variant="body2" className="mt-1">
                    Check your email for password reset instructions.
                  </Typography>
                </div>
              </Alert>
            </motion.div>
          )}

          {/* Error Alert */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6"
            >
              <Alert severity="error" className="rounded-lg">
                {error}
              </Alert>
            </motion.div>
          )}

          {/* Form */}
          {!success && (
            <form onSubmit={handleSubmit}>
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="space-y-6"
              >
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  variant="outlined"
                  className="bg-white"
                  InputProps={{
                    startAdornment: (
                      <Box component="span" className="mr-2">
                        <Email className="text-gray-400" />
                      </Box>
                    ),
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 py-3 rounded-lg text-white font-semibold"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                      Sending...
                    </div>
                  ) : (
                    'Send Reset Link'
                  )}
                </Button>
              </motion.div>
            </form>
          )}

          {/* Back to Login */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-center"
          >
            <Button
              component={Link}
              to="/login"
              variant="text"
              startIcon={<ArrowBack />}
              className="text-blue-600 hover:text-blue-800"
            >
              Back to Sign In
            </Button>
          </motion.div>

          {/* Support Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-6 p-4 bg-gray-50 rounded-lg"
          >
            <Typography variant="body2" className="text-gray-600 text-center">
              Need help? Contact support at{' '}
              <a href="mailto:support@hotel.com" className="text-blue-600 hover:underline">
                support@hotel.com
              </a>
            </Typography>
          </motion.div>
        </Paper>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-center mt-6"
        >
          <Typography variant="caption" className="text-gray-500">
            © {new Date().getFullYear()} Hotel Management System. All rights reserved.
          </Typography>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;