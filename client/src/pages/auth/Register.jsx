import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
//import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import {
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Alert,
  Paper,
  Typography,
  Divider,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Person,
  Email,
  Lock,
  Phone,
  Hotel,
  ArrowBack,
  CheckCircle,
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'guest',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1);
  
  const { register, error } = useAuth();
  const navigate = useNavigate();

  const roles = [
    { value: 'guest', label: 'Guest', description: 'Book rooms and manage reservations' },
    { value: 'receptionist', label: 'Receptionist', description: 'Manage check-ins and guest services' },
    { value: 'housekeeping', label: 'Housekeeping', description: 'Manage room cleaning and maintenance' },
    { value: 'admin', label: 'Administrator', description: 'Full system access and management' },
  ];

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    else if (!/^[\d\s\-+()]{10,20}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Invalid phone number';
    }
    return newErrors;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    return newErrors;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error for this field
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: '',
      });
    }
  };

  const handleNext = () => {
    const step1Errors = validateStep1();
    if (Object.keys(step1Errors).length === 0) {
      setStep(2);
    } else {
      setErrors(step1Errors);
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const step2Errors = validateStep2();
    if (Object.keys(step2Errors).length > 0) {
      setErrors(step2Errors);
      return;
    }

    setLoading(true);
    setErrors({});

    const userData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      role: formData.role,
    };

    const result = await register(userData);
    
    if (result.success) {
      navigate('/dashboard');
    } else if (result.error) {
      setErrors({ submit: result.error });
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
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
              <div className="bg-gradient-to-r from-green-600 to-teal-600 p-3 rounded-full">
                <Hotel className="text-white text-4xl" />
              </div>
            </motion.div>
            <Typography variant="h4" className="font-bold text-gray-800 mb-2">
              Create Account
            </Typography>
            <Typography variant="body2" className="text-gray-600">
              Join our Hotel Management System
            </Typography>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {[1, 2, 3].map((stepNumber) => (
                <React.Fragment key={stepNumber}>
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                        step >= stepNumber
                          ? 'bg-gradient-to-r from-green-600 to-teal-600 text-white'
                          : 'bg-gray-200 text-gray-400'
                      }`}
                    >
                      {step > stepNumber ? <CheckCircle /> : stepNumber}
                    </div>
                    <Typography
                      variant="caption"
                      className={`mt-2 ${
                        step >= stepNumber ? 'text-green-600 font-semibold' : 'text-gray-400'
                      }`}
                    >
                      {stepNumber === 1 ? 'Personal Info' : stepNumber === 2 ? 'Security' : 'Complete'}
                    </Typography>
                  </div>
                  {stepNumber < 3 && (
                    <div
                      className={`flex-1 h-1 mx-4 ${
                        step > stepNumber ? 'bg-green-600' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Error Alert */}
          {(error || errors.submit) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Alert severity="error" className="mb-6 rounded-lg">
                {error || errors.submit}
              </Alert>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
                className="space-y-6"
              >
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  error={!!errors.name}
                  helperText={errors.name}
                  className="bg-white"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person className="text-gray-400" />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  error={!!errors.email}
                  helperText={errors.email}
                  className="bg-white"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email className="text-gray-400" />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  error={!!errors.phone}
                  helperText={errors.phone}
                  className="bg-white"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone className="text-gray-400" />
                      </InputAdornment>
                    ),
                  }}
                />

                <FormControl fullWidth variant="outlined" className="bg-white">
                  <InputLabel>Role</InputLabel>
                  <Select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    label="Role"
                  >
                    {roles.map((role) => (
                      <MenuItem key={role.value} value={role.value}>
                        <div>
                          <div className="font-semibold">{role.label}</div>
                          <div className="text-xs text-gray-500">{role.description}</div>
                        </div>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleNext}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 py-3 rounded-lg text-white font-semibold"
                  endIcon={<ArrowBack className="rotate-180" />}
                >
                  Continue to Security
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="space-y-6"
              >
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  error={!!errors.password}
                  helperText={errors.password}
                  className="bg-white"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock className="text-gray-400" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  label="Confirm Password"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                  className="bg-white"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock className="text-gray-400" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <Typography variant="body2" className="font-semibold mb-2">
                      Password Strength
                    </Typography>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          formData.password.length >= 8
                            ? 'bg-green-500'
                            : formData.password.length >= 6
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        }`}
                        style={{
                          width: `${Math.min((formData.password.length / 12) * 100, 100)}%`,
                        }}
                      />
                    </div>
                    <Typography variant="caption" className="text-gray-600 mt-2 block">
                      {formData.password.length >= 8
                        ? 'Strong password'
                        : formData.password.length >= 6
                        ? 'Moderate password'
                        : 'Weak password'}
                    </Typography>
                  </div>
                )}

                <div className="flex space-x-4">
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={handleBack}
                    className="py-3 rounded-lg"
                    startIcon={<ArrowBack />}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={loading}
                    className="bg-gradient-to-r from-green-600 to-teal-600 py-3 rounded-lg text-white font-semibold"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                        Creating Account...
                      </div>
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                </div>
              </motion.div>
            )}
          </form>

          {/* Divider */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="my-8"
          >
            <Divider>
              <Typography variant="body2" className="text-gray-500 px-4">
                Already have an account?
              </Typography>
            </Divider>
          </motion.div>

          {/* Login Link */}
          <div className="text-center">
            <Button
              component={Link}
              to="/login"
              variant="text"
              className="text-blue-600 hover:text-blue-800"
            >
              Sign in to existing account
            </Button>
          </div>

          {/* Terms */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-6 text-center"
          >
            <Typography variant="caption" className="text-gray-500">
              By creating an account, you agree to our{' '}
              <Link to="/terms" className="text-blue-600 hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-blue-600 hover:underline">
                Privacy Policy
              </Link>
              .
            </Typography>
          </motion.div>
        </Paper>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
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

export default Register;
