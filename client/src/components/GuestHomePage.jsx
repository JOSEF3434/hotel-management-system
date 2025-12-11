// components/GuestHomePage.jsx
import React, { useState, useContext } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Paper,
  Rating,
  Avatar,
  AvatarGroup,
  Stack,
  Divider,
  useTheme,
  alpha,
  useMediaQuery,
  Fab,
  Slide,
  Zoom,
  Fade,
  Tooltip,
  Tabs,
  Tab,
  Badge
} from '@mui/material';
import {
  Search,
  CalendarToday,
  Person,
  KingBed,
  Bathtub,
  Wifi,
  Restaurant,
  Pool,
  FitnessCenter,
  Spa,
  LocalBar,
  CarRental,
  Star,
  Favorite,
  Share,
  LocationOn,
  Phone,
  Email,
  ArrowForward,
  ArrowBack,
  ChevronRight,
  Hotel,
  NightsStay,
  LightMode,
  Facebook,
  Twitter,
  Instagram,
  YouTube,
  PlayArrow,
  CheckCircle,
  Group,
  Event,
  AccessTime,
  CreditCard,
  Security,
  SentimentVerySatisfied,
  LocalOffer,
  WhatsApp
} from '@mui/icons-material';
import { ColorModeContext } from '../theme.js';
import { tokens } from '../theme.js';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const GuestHomePage = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  
  const [searchParams, setSearchParams] = useState({
    checkIn: '',
    checkOut: '',
    guests: 2,
    rooms: 1
  });
  const [tabValue, setTabValue] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [favorites, setFavorites] = useState([]);

  // Hero Images
  const heroImages = [
    { id: 1, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1920', title: 'Luxury Suites', subtitle: 'Experience Unmatched Comfort' },
    { id: 2, image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1920', title: 'Premium Dining', subtitle: 'Gourmet Experiences' },
    { id: 3, image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1920', title: 'Spa & Wellness', subtitle: 'Rejuvenate Your Senses' },
    { id: 4, image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1920', title: 'Poolside Luxury', subtitle: 'Relax in Style' },
  ];

  // Room Types
  const roomTypes = [
    {
      id: 1,
      name: 'Deluxe Suite',
      description: 'Spacious suite with panoramic city views',
      price: 299,
      size: '45 m²',
      capacity: 3,
      beds: 1,
      amenities: ['King Bed', 'Ocean View', 'Jacuzzi', 'Smart TV', 'Mini Bar'],
      rating: 4.8,
      reviews: 124,
      image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800',
      isPopular: true
    },
    {
      id: 2,
      name: 'Executive Suite',
      description: 'Business-class accommodation with work area',
      price: 399,
      size: '55 m²',
      capacity: 2,
      beds: 1,
      amenities: ['King Bed', 'Work Desk', 'Coffee Machine', 'Bathrobe', 'Free WiFi'],
      rating: 4.9,
      reviews: 89,
      image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800',
      isPopular: true
    },
    {
      id: 3,
      name: 'Presidential Suite',
      description: 'Ultimate luxury with private terrace',
      price: 899,
      size: '120 m²',
      capacity: 4,
      beds: 2,
      amenities: ['2 King Beds', 'Private Terrace', 'Butler Service', 'Wine Cellar', 'Home Theater'],
      rating: 5.0,
      reviews: 42,
      image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800',
      isPopular: false
    },
    {
      id: 4,
      name: 'Family Room',
      description: 'Perfect for families with connecting rooms',
      price: 199,
      size: '35 m²',
      capacity: 4,
      beds: 2,
      amenities: ['Queen Beds', 'Kids Corner', 'Board Games', 'Baby Cot', 'Family Movies'],
      rating: 4.7,
      reviews: 156,
      image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800',
      isPopular: true
    },
  ];

  // Hotel Features
  const features = [
    { icon: <Wifi />, title: 'Free High-Speed WiFi', description: 'Unlimited internet access throughout' },
    { icon: <Restaurant />, title: 'Fine Dining', description: '5-star restaurant & 24/7 room service' },
    { icon: <Pool />, title: 'Infinity Pool', description: 'Heated pool with panoramic views' },
    { icon: <FitnessCenter />, title: 'Fitness Center', description: 'State-of-the-art gym equipment' },
    { icon: <Spa />, title: 'Spa & Wellness', description: 'Luxury treatments & massages' },
    { icon: <CarRental />, title: 'Valet Parking', description: 'Secure parking with valet service' },
  ];

  // Testimonials
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Business Traveler',
      avatar: 'SJ',
      rating: 5,
      comment: 'Exceptional service and luxurious rooms. The executive suite was perfect for my business trip.',
      stay: 'Stayed 3 nights in Executive Suite'
    },
    {
      name: 'Michael Chen',
      role: 'Honeymooner',
      avatar: 'MC',
      rating: 5,
      comment: 'The presidential suite was beyond amazing! Perfect romantic getaway with stunning views.',
      stay: 'Stayed 7 nights in Presidential Suite'
    },
    {
      name: 'Emma Wilson',
      role: 'Family Vacation',
      avatar: 'EW',
      rating: 4.5,
      comment: 'Great for families! Kids loved the pool and the family room was spacious and comfortable.',
      stay: 'Stayed 5 nights in Family Room'
    },
  ];

  // Special Offers
  const offers = [
    {
      title: 'Weekend Getaway',
      discount: '30% OFF',
      description: 'Book 2 nights, get 30% off on weekends',
      code: 'WEEKEND30',
      expires: 'Dec 31, 2024'
    },
    {
      title: 'Extended Stay',
      discount: 'Free Night',
      description: 'Stay 7 nights, pay for 6',
      code: 'STAY7PAY6',
      expires: 'Ongoing'
    },
    {
      title: 'Honeymoon Package',
      discount: 'Special Rate',
      description: 'Romantic package with spa treatments',
      code: 'LOVE24',
      expires: 'Dec 31, 2024'
    },
  ];

  // Stats
  const stats = [
    { value: '4.9', label: 'Guest Rating', icon: <Star /> },
    { value: '500+', label: 'Rooms & Suites', icon: <Hotel /> },
    { value: '98%', label: 'Satisfaction Rate', icon: <SentimentVerySatisfied /> },
    { value: '24/7', label: 'Concierge Service', icon: <AccessTime /> },
  ];

  const handleSearchChange = (field, value) => {
    setSearchParams(prev => ({ ...prev, [field]: value }));
  };

  const handleBookNow = (room) => {
    setSelectedRoom(room);
    // Scroll to booking form
    document.getElementById('booking-form').scrollIntoView({ behavior: 'smooth' });
  };

  const toggleFavorite = (roomId) => {
    setFavorites(prev => 
      prev.includes(roomId) 
        ? prev.filter(id => id !== roomId) 
        : [...prev, roomId]
    );
  };

  const RoomCard = ({ room }) => {
    const isFavorite = favorites.includes(room.id);
    
    return (
      <Card 
        sx={{ 
          height: '100%',
          borderRadius: '16px',
          overflow: 'hidden',
          position: 'relative',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: theme.shadows[8],
          }
        }}
      >
        {/* Favorite Button */}
        <IconButton
          onClick={() => toggleFavorite(room.id)}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 2,
            backgroundColor: theme.palette.mode === 'dark' ? alpha('#000', 0.6) : alpha('#fff', 0.9),
            '&:hover': {
              backgroundColor: theme.palette.mode === 'dark' ? alpha('#000', 0.8) : alpha('#fff', 1),
            }
          }}
        >
          <Favorite sx={{ color: isFavorite ? colors.redAccent[500] : 'inherit' }} />
        </IconButton>

        {/* Popular Badge */}
        {room.isPopular && (
          <Chip
            label="Most Popular"
            color="primary"
            size="small"
            sx={{
              position: 'absolute',
              top: 16,
              left: 16,
              zIndex: 2,
              fontWeight: 600,
            }}
          />
        )}

        {/* Room Image */}
        <Box sx={{ position: 'relative', height: 240 }}>
          <CardMedia
            component="img"
            height="240"
            image={room.image}
            alt={room.name}
            sx={{
              transition: 'transform 0.5s ease',
              '&:hover': {
                transform: 'scale(1.05)',
              }
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: `linear-gradient(to top, ${theme.palette.mode === 'dark' ? alpha('#000', 0.8) : alpha('#000', 0.6)}, transparent)`,
              p: 2,
              color: 'white'
            }}
          >
            <Typography variant="h6" fontWeight={700}>
              {room.name}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              {room.size} • Up to {room.capacity} guests
            </Typography>
          </Box>
        </Box>

        <CardContent>
          {/* Rating */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
            <Rating value={room.rating} precision={0.1} readOnly size="small" />
            <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
              {room.rating} ({room.reviews} reviews)
            </Typography>
          </Box>

          {/* Description */}
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2, height: 40 }}>
            {room.description}
          </Typography>

          {/* Amenities */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
            {room.amenities.slice(0, 3).map((amenity, index) => (
              <Chip
                key={index}
                label={amenity}
                size="small"
                variant="outlined"
                sx={{ fontSize: '0.7rem' }}
              />
            ))}
            {room.amenities.length > 3 && (
              <Chip
                label={`+${room.amenities.length - 3}`}
                size="small"
                variant="outlined"
                sx={{ fontSize: '0.7rem' }}
              />
            )}
          </Box>

          {/* Price & Book Button */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="caption" color="textSecondary">
                Starting from
              </Typography>
              <Typography variant="h5" fontWeight={700} color={colors.greenAccent[500]}>
                ${room.price}
                <Typography component="span" variant="body2" color="textSecondary">
                  /night
                </Typography>
              </Typography>
            </Box>
            <Button
              variant="contained"
              endIcon={<ChevronRight />}
              onClick={() => handleBookNow(room)}
              sx={{
                borderRadius: '8px',
                background: `linear-gradient(45deg, ${colors.primary[500]}, ${colors.blueAccent[500]})`,
                '&:hover': {
                  background: `linear-gradient(45deg, ${colors.primary[600]}, ${colors.blueAccent[600]})`,
                }
              }}
            >
              Book Now
            </Button>
          </Box>
        </CardContent>
      </Card>
    );
  };

  const FeatureCard = ({ feature }) => (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: '12px',
        height: '100%',
        textAlign: 'center',
        transition: 'all 0.3s ease',
        border: `1px solid ${theme.palette.mode === 'dark' ? colors.primary[600] : colors.grey[200]}`,
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[4],
          borderColor: colors.blueAccent[500],
        }
      }}
    >
      <Box
        sx={{
          width: 60,
          height: 60,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
          backgroundColor: `${colors.blueAccent[500]}20`,
          color: colors.blueAccent[500],
          fontSize: 28,
        }}
      >
        {feature.icon}
      </Box>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        {feature.title}
      </Typography>
      <Typography variant="body2" color="textSecondary">
        {feature.description}
      </Typography>
    </Paper>
  );

  const TestimonialCard = ({ testimonial }) => (
    <Card
      sx={{
        p: 3,
        borderRadius: '12px',
        height: '100%',
        background: theme.palette.mode === 'dark' ? colors.primary[400] : colors.primary[50],
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Avatar
          sx={{
            width: 56,
            height: 56,
            backgroundColor: colors.primary[500],
            fontSize: '1.2rem',
            mr: 2,
          }}
        >
          {testimonial.avatar}
        </Avatar>
        <Box>
          <Typography variant="subtitle1" fontWeight={600}>
            {testimonial.name}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {testimonial.role}
          </Typography>
        </Box>
      </Box>
      <Rating value={testimonial.rating} readOnly size="small" sx={{ mb: 1.5 }} />
      <Typography variant="body1" sx={{ mb: 1.5, fontStyle: 'italic' }}>
        "{testimonial.comment}"
      </Typography>
      <Typography variant="caption" color="textSecondary">
        {testimonial.stay}
      </Typography>
    </Card>
  );

  const OfferCard = ({ offer }) => (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: '12px',
        height: '100%',
        background: `linear-gradient(135deg, ${colors.greenAccent[400]}, ${colors.greenAccent[600]})`,
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: -20,
          right: -20,
          width: 80,
          height: 80,
          borderRadius: '50%',
          backgroundColor: alpha('#fff', 0.1),
        }}
      />
      <Chip
        label="Special Offer"
        size="small"
        sx={{
          backgroundColor: alpha('#fff', 0.2),
          color: 'white',
          mb: 2,
          fontWeight: 600,
        }}
      />
      <Typography variant="h5" fontWeight={700} gutterBottom>
        {offer.title}
      </Typography>
      <Typography variant="h3" fontWeight={800} sx={{ mb: 1 }}>
        {offer.discount}
      </Typography>
      <Typography variant="body2" sx={{ opacity: 0.9, mb: 2 }}>
        {offer.description}
      </Typography>
      <Box sx={{ mt: 2 }}>
        <Typography variant="caption" sx={{ opacity: 0.8, display: 'block' }}>
          Use code: <strong>{offer.code}</strong>
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.8 }}>
          Expires: {offer.expires}
        </Typography>
      </Box>
    </Paper>
  );

  return (
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
      {/* Hero Section */}
      <Box sx={{ position: 'relative', height: { xs: '70vh', md: '90vh' }, mb: 6 }}>
        <Swiper
          modules={[Navigation, Pagination, Autoplay, EffectFade]}
          spaceBetween={0}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000 }}
          effect="fade"
          loop
          style={{
            height: '100%',
            '--swiper-navigation-color': '#fff',
            '--swiper-pagination-color': '#fff',
          }}
        >
          {heroImages.map((slide) => (
            <SwiperSlide key={slide.id}>
              <Box
                sx={{
                  height: '100%',
                  position: 'relative',
                  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${slide.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Container maxWidth="lg">
                  <Box sx={{ textAlign: 'center', color: 'white' }}>
                    <Fade in timeout={1000}>
                      <Typography
                        variant="h1"
                        sx={{
                          fontSize: { xs: '2.5rem', md: '4rem', lg: '5rem' },
                          fontWeight: 800,
                          mb: 2,
                          textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                        }}
                      >
                        {slide.title}
                      </Typography>
                    </Fade>
                    <Fade in timeout={1500}>
                      <Typography
                        variant="h5"
                        sx={{
                          mb: 4,
                          opacity: 0.9,
                          textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                        }}
                      >
                        {slide.subtitle}
                      </Typography>
                    </Fade>
                    <Fade in timeout={2000}>
                      <Button
                        variant="contained"
                        size="large"
                        endIcon={<ArrowForward />}
                        sx={{
                          px: 4,
                          py: 1.5,
                          fontSize: '1.1rem',
                          borderRadius: '12px',
                          background: `linear-gradient(45deg, ${colors.greenAccent[500]}, ${colors.blueAccent[500]})`,
                          '&:hover': {
                            background: `linear-gradient(45deg, ${colors.greenAccent[600]}, ${colors.blueAccent[600]})`,
                          }
                        }}
                      >
                        Book Your Stay
                      </Button>
                    </Fade>
                  </Box>
                </Container>
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Search Box */}
        <Container maxWidth="lg" sx={{ position: 'relative' }}>
          <Slide direction="up" in timeout={1000}>
            <Paper
              elevation={8}
              sx={{
                position: 'absolute',
                bottom: { xs: -80, md: -60 },
                left: 0,
                right: 0,
                p: { xs: 2, md: 3 },
                borderRadius: '16px',
                background: theme.palette.mode === 'dark' ? colors.primary[500] : '#ffffff',
                zIndex: 10,
              }}
            >
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="Check-in"
                    type="date"
                    value={searchParams.checkIn}
                    onChange={(e) => handleSearchChange('checkIn', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarToday />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="Check-out"
                    type="date"
                    value={searchParams.checkOut}
                    onChange={(e) => handleSearchChange('checkOut', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarToday />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <TextField
                    fullWidth
                    label="Guests"
                    type="number"
                    value={searchParams.guests}
                    onChange={(e) => handleSearchChange('guests', e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <TextField
                    fullWidth
                    label="Rooms"
                    type="number"
                    value={searchParams.rooms}
                    onChange={(e) => handleSearchChange('rooms', e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <KingBed />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    startIcon={<Search />}
                    sx={{
                      height: '56px',
                      borderRadius: '12px',
                      background: `linear-gradient(45deg, ${colors.greenAccent[500]}, ${colors.blueAccent[500]})`,
                      '&:hover': {
                        background: `linear-gradient(45deg, ${colors.greenAccent[600]}, ${colors.blueAccent[600]})`,
                      }
                    }}
                  >
                    Search
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Slide>
        </Container>
      </Box>

      {/* Stats Section */}
      <Container maxWidth="lg" sx={{ mb: 8, mt: { xs: 12, md: 10 } }}>
        <Grid container spacing={3}>
          {stats.map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <Zoom in timeout={500 + index * 200}>
                <Box sx={{ textAlign: 'center' }}>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 16px',
                      backgroundColor: `${colors.primary[500]}20`,
                      color: colors.primary[500],
                      fontSize: 32,
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <Typography variant="h3" fontWeight={800} gutterBottom>
                    {stat.value}
                  </Typography>
                  <Typography variant="h6" color="textSecondary">
                    {stat.label}
                  </Typography>
                </Box>
              </Zoom>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Rooms & Suites Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h2" fontWeight={800} gutterBottom>
            Our Rooms & Suites
          </Typography>
          <Typography variant="h6" color="textSecondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Experience luxury and comfort in our carefully designed accommodations
          </Typography>
        </Box>

        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          centered
          sx={{ mb: 4 }}
        >
          <Tab label="All Rooms" />
          <Tab label="Suites" />
          <Tab label="Family Rooms" />
          <Tab label="Luxury" />
        </Tabs>

        <Grid container spacing={4}>
          {roomTypes.map((room) => (
            <Grid item xs={12} md={6} lg={3} key={room.id}>
              <RoomCard room={room} />
            </Grid>
          ))}
        </Grid>

        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Button
            variant="outlined"
            size="large"
            endIcon={<ArrowForward />}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: '12px',
              borderWidth: 2,
              '&:hover': {
                borderWidth: 2,
              }
            }}
          >
            View All Rooms
          </Button>
        </Box>
      </Container>

      {/* Features Section */}
      <Box sx={{ 
        py: 8, 
        background: theme.palette.mode === 'dark' 
          ? colors.primary[500] 
          : colors.primary[50],
        mb: 8 
      }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h2" fontWeight={800} gutterBottom>
              Hotel Features & Amenities
            </Typography>
            <Typography variant="h6" color="textSecondary" sx={{ maxWidth: 600, mx: 'auto' }}>
              Everything you need for a perfect stay
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <FeatureCard feature={feature} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Special Offers */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h2" fontWeight={800} gutterBottom>
            Special Offers & Packages
          </Typography>
          <Typography variant="h6" color="textSecondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Exclusive deals for our valued guests
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {offers.map((offer, index) => (
            <Grid item xs={12} md={4} key={index}>
              <OfferCard offer={offer} />
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Testimonials */}
      <Box sx={{ 
        py: 8, 
        background: `linear-gradient(135deg, ${colors.primary[500]}, ${colors.primary[700]})`,
        color: 'white',
        mb: 8 
      }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h2" fontWeight={800} gutterBottom>
              What Our Guests Say
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, maxWidth: 600, mx: 'auto' }}>
              Join thousands of satisfied guests who experienced luxury with us
            </Typography>
          </Box>

          <Swiper
            spaceBetween={30}
            slidesPerView={isMobile ? 1 : isTablet ? 2 : 3}
            navigation
            pagination={{ clickable: true }}
            style={{
              padding: '20px 0 40px',
              '--swiper-navigation-color': '#fff',
              '--swiper-pagination-color': '#fff',
            }}
          >
            {testimonials.map((testimonial, index) => (
              <SwiperSlide key={index}>
                <TestimonialCard testimonial={testimonial} />
              </SwiperSlide>
            ))}
          </Swiper>
        </Container>
      </Box>

      {/* Booking Form Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }} id="booking-form">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 6 },
            borderRadius: '16px',
            background: `linear-gradient(135deg, ${colors.greenAccent[400]}, ${colors.blueAccent[500]})`,
            color: 'white',
          }}
        >
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h3" fontWeight={800} gutterBottom>
                Ready to Book Your Stay?
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9, mb: 3 }}>
                Experience luxury at its finest. Book now and enjoy our exclusive benefits.
              </Typography>
              <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                <Chip icon={<CheckCircle />} label="Best Price Guarantee" sx={{ backgroundColor: alpha('#fff', 0.2) }} />
                <Chip icon={<CheckCircle />} label="Free Cancellation" sx={{ backgroundColor: alpha('#fff', 0.2) }} />
                <Chip icon={<CheckCircle />} label="24/7 Support" sx={{ backgroundColor: alpha('#fff', 0.2) }} />
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, borderRadius: '12px', background: alpha('#fff', 0.1) }}>
                <Typography variant="h6" gutterBottom>
                  Quick Booking
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Check-in Date"
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      sx={{
                        '& .MuiInputBase-root': {
                          backgroundColor: 'white',
                          borderRadius: '8px',
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Check-out Date"
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      sx={{
                        '& .MuiInputBase-root': {
                          backgroundColor: 'white',
                          borderRadius: '8px',
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      endIcon={<ArrowForward />}
                      sx={{
                        py: 1.5,
                        borderRadius: '8px',
                        backgroundColor: 'white',
                        color: colors.primary[500],
                        fontWeight: 600,
                        '&:hover': {
                          backgroundColor: alpha('#fff', 0.9),
                        }
                      }}
                    >
                      Book Now
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      </Container>

      {/* Contact Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Grid container spacing={6}>
          <Grid item xs={12} md={6}>
            <Typography variant="h3" fontWeight={800} gutterBottom>
              Contact Us
            </Typography>
            <Typography variant="h6" color="textSecondary" gutterBottom sx={{ mb: 4 }}>
              We're here to help you plan your perfect stay
            </Typography>
            
            <Stack spacing={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ backgroundColor: colors.primary[500] }}>
                  <LocationOn />
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Address
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    123 Luxury Avenue, City, Country 12345
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ backgroundColor: colors.primary[500] }}>
                  <Phone />
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Phone
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    +1 (555) 123-4567
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ backgroundColor: colors.primary[500] }}>
                  <Email />
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Email
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    reservations@grandhotel.com
                  </Typography>
                </Box>
              </Box>
            </Stack>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 4, borderRadius: '12px' }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Send us a Message
              </Typography>
              <Stack spacing={2}>
                <TextField fullWidth label="Your Name" />
                <TextField fullWidth label="Email Address" />
                <TextField fullWidth label="Phone Number" />
                <TextField fullWidth label="Message" multiline rows={4} />
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    borderRadius: '8px',
                    background: `linear-gradient(45deg, ${colors.greenAccent[500]}, ${colors.blueAccent[500]})`,
                  }}
                >
                  Send Message
                </Button>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Footer */}
      <Box sx={{ 
        py: 6, 
        background: theme.palette.mode === 'dark' ? colors.primary[600] : colors.grey[100],
        borderTop: `1px solid ${theme.palette.mode === 'dark' ? colors.primary[500] : colors.grey[200]}`
      }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Hotel sx={{ fontSize: 32, mr: 1, color: colors.greenAccent[500] }} />
                <Typography variant="h5" fontWeight={800}>
                  GRAND HOTEL
                </Typography>
              </Box>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                Experience luxury and comfort at its finest. Your perfect getaway awaits.
              </Typography>
              <Stack direction="row" spacing={1}>
                <IconButton><Facebook /></IconButton>
                <IconButton><Twitter /></IconButton>
                <IconButton><Instagram /></IconButton>
                <IconButton><YouTube /></IconButton>
              </Stack>
            </Grid>
            
            <Grid item xs={12} md={8}>
              <Grid container spacing={4}>
                <Grid item xs={6} sm={3}>
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Quick Links
                  </Typography>
                  <Stack spacing={1}>
                    <Typography variant="body2" color="textSecondary">Rooms & Suites</Typography>
                    <Typography variant="body2" color="textSecondary">Dining</Typography>
                    <Typography variant="body2" color="textSecondary">Spa & Wellness</Typography>
                    <Typography variant="body2" color="textSecondary">Events</Typography>
                  </Stack>
                </Grid>
                
                <Grid item xs={6} sm={3}>
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Support
                  </Typography>
                  <Stack spacing={1}>
                    <Typography variant="body2" color="textSecondary">Contact Us</Typography>
                    <Typography variant="body2" color="textSecondary">FAQ</Typography>
                    <Typography variant="body2" color="textSecondary">Cancellation Policy</Typography>
                    <Typography variant="body2" color="textSecondary">Privacy Policy</Typography>
                  </Stack>
                </Grid>
                
                <Grid item xs={6} sm={3}>
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Services
                  </Typography>
                  <Stack spacing={1}>
                    <Typography variant="body2" color="textSecondary">Room Service</Typography>
                    <Typography variant="body2" color="textSecondary">Concierge</Typography>
                    <Typography variant="body2" color="textSecondary">Airport Transfer</Typography>
                    <Typography variant="body2" color="textSecondary">Car Rental</Typography>
                  </Stack>
                </Grid>
                
                <Grid item xs={6} sm={3}>
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Awards
                  </Typography>
                  <Stack spacing={1}>
                    <Typography variant="body2" color="textSecondary">Luxury Hotel Award 2024</Typography>
                    <Typography variant="body2" color="textSecondary">5-Star Rating</Typography>
                    <Typography variant="body2" color="textSecondary">Traveler's Choice</Typography>
                    <Typography variant="body2" color="textSecondary">Best Service Award</Typography>
                  </Stack>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          
          <Divider sx={{ my: 4 }} />
          
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" color="textSecondary">
              © 2024 Grand Hotel. All rights reserved.
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2" color="textSecondary">
                Switch Theme:
              </Typography>
              <IconButton
                onClick={colorMode.toggleColorMode}
                sx={{
                  backgroundColor: theme.palette.mode === 'dark' ? colors.primary[500] : colors.grey[200],
                }}
              >
                {theme.palette.mode === 'dark' ? <LightMode /> : <NightsStay />}
              </IconButton>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        sx={{
          position: 'fixed',
          bottom: 32,
          right: 32,
          background: `linear-gradient(45deg, ${colors.greenAccent[500]}, ${colors.blueAccent[500]})`,
        }}
      >
        <WhatsApp />
      </Fab>
    </Box>
  );
};

export default GuestHomePage;