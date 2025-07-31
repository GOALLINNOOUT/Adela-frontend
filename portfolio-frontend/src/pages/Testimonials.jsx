import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Rating,
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import { motion } from 'framer-motion';
import SectionHeading from '../components/SectionHeading';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';

const MotionCard = motion(Card);

function Testimonials() {
  const [openDialog, setOpenDialog] = useState(false);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    rating: 5,
    testimonial: '',
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch('https://portfolio-backend-ckqx.onrender.com/api/testimonials');
      if (!response.ok) {
        throw new Error('Failed to fetch testimonials');
      }
      const data = await response.json();
      setTestimonials(data);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      setSnackbar({
        open: true,
        message: 'Failed to load testimonials',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({
      name: '',
      position: '',
      rating: 5,
      testimonial: '',
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRatingChange = (_, newValue) => {
    setFormData({
      ...formData,
      rating: newValue,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://portfolio-backend-ckqx.onrender.com/api/testimonials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit testimonial');
      }

      setSnackbar({
        open: true,
        message: 'Thank you for your testimonial! It will be visible after approval.',
        severity: 'success',
      });
      handleCloseDialog();
      
      
      fetchTestimonials();
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to submit testimonial. Please try again.',
        severity: 'error',
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
      <Helmet>
        <title>Testimonials | Adela Portfolio</title>
        <meta name="description" content="Read testimonials and reviews about Adela's work and projects. Share your experience and see what others say." />
        <meta name="keywords" content="Adela, testimonials, reviews, feedback, portfolio, web development" />
        <meta name="author" content="ADELA" />
        <meta property="og:title" content="Testimonials | Adela Portfolio" />
        <meta property="og:description" content="Read testimonials and reviews about Adela's work and projects. Share your experience and see what others say." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://adelaportfolio.vercel.app/assets/hero-982354f0.jpg" />
        <meta property="og:url" content="https://adelaportfolio.vercel.app/testimonials" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Testimonials | Adela Portfolio" />
        <meta name="twitter:description" content="Read testimonials and reviews about Adela's work and projects. Share your experience and see what others say." />
        <meta name="twitter:image" content="https://adelaportfolio.vercel.app/assets/hero-982354f0.jpg" />
        <link rel="canonical" href="https://adelaportfolio.vercel.app/testimonials" />
      </Helmet>
      {/* ...existing code... */}
      <Box>
        <Container sx={{ py: 8 }}>
        <SectionHeading
          title="Testimonials"
          subtitle="What people say about me and my projects"
        />

        {loading ? (
          <Box display="flex" justifyContent="center" py={8}>
            <CircularProgress />
          </Box>
        ) : testimonials.length === 0 ? (
          <Box textAlign="center" py={8}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No testimonials yet
            </Typography>
            <Typography color="text.secondary" paragraph>
              Be the first to share your experience!
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={6} key={testimonial._id}>
                <MotionCard
                  elevation={2}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                >
                  <CardContent>
                    <Box sx={{ mb: 2 }}>
                      <FormatQuoteIcon
                        color="primary"
                        sx={{ fontSize: 40, opacity: 0.3 }}
                      />
                    </Box>
                    <Typography variant="body1" paragraph>
                      {testimonial.testimonial}
                    </Typography>
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={2}
                      sx={{ mt: 3 }}
                    >
                      <Avatar
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        sx={{ width: 56, height: 56 }}
                      />
                      <Box>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {testimonial.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {testimonial.position}
                        </Typography>
                        <Rating
                          value={testimonial.rating}
                          readOnly
                          size="small"
                          sx={{ mt: 0.5 }}
                        />
                      </Box>
                    </Stack>
                  </CardContent>
                </MotionCard>
              </Grid>
            ))}
          </Grid>
        )}

        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleOpenDialog}
          >
            Share Your Experience
          </Button>
        </Box>
      </Container>

     
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Share Your Testimonial</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <Stack spacing={3} sx={{ mt: 1 }}>
              <TextField
                required
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
              <TextField
                required
                label="Position"
                name="position"
                value={formData.position}
                onChange={handleChange}
              />
              <Box>
                <Typography component="legend">Rating</Typography>
                <Rating
                  name="rating"
                  value={formData.rating}
                  onChange={handleRatingChange}
                />
              </Box>
              <TextField
                required
                multiline
                rows={4}
                label="Your Testimonial"
                name="testimonial"
                value={formData.testimonial}
                onChange={handleChange}
              />
            </Stack>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
    </>
  );
}

export default Testimonials;
