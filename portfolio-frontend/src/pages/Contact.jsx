import { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  Snackbar,
  CircularProgress,
  Stack,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import SectionHeading from '../components/SectionHeading';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';

const contactInfo = [  {
    icon: <EmailIcon fontSize="large" color="primary" />,
    title: 'Email',
    content: 'adeyekunadelola0@gmail.com',
    link: null,
  },
  {
    icon: <PhoneIcon fontSize="large" color="primary" />,
    title: 'Phone',
    content: '+234 704 312 9502',
    link: 'tel:+2347043129502',
  },
  // {
  //   icon: <LocationOnIcon fontSize="large" color="primary" />,
  //   title: 'Location',
  //   content: 'Akure, Nigeria',
  //   link: null,
  // },
];

function Contact() {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('https://portfolio-backend-ckqx.onrender.com/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }      setSnackbar({
        open: true,
        message: 'Thank you! Your message has been received.',
        severity: 'success',
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {      setSnackbar({
        open: true,
        message: 'Failed to submit message. Please try again.',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };  return (    <Box 
      sx={{ 
        bgcolor: 'background.default',
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        flexDirection: 'column',
        py: { xs: 6, sm: 8, md: 10 },
        background: `linear-gradient(to bottom, ${theme.palette.primary.main}15, ${theme.palette.secondary.light}50)`,
      }}
    >
      <Container 
        maxWidth="lg"
        sx={{ 
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: { xs: 4, sm: 6, md: 8 },
        }}
      >        <SectionHeading
          title="Contact Me"
          subtitle="Fill out the form below to get in touch - I'll review your message and get back to you through other channels"
          sx={{ mb: { xs: 4, sm: 6 } }}
        /><Grid container spacing={{ xs: 3, sm: 4, md: 6 }}>
          {/* Contact Info Cards */}          <Grid item xs={12} lg={4}>
            <Grid container spacing={{ xs: 3, sm: 4 }}>
              {contactInfo.map((info, i) => (
                <Grid item xs={12} sm={6} md={4} lg={12} key={info.title}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                  >
                    <Paper
                    elevation={0}
                    sx={{
                      p: { xs: 4, sm: 5, md: 6 },
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                      bgcolor: 'background.paper',
                      borderRadius: 2,
                      boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                      height: '100%',
                      minHeight: { xs: '200px', sm: '220px', md: '240px' },
                      transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 6px 30px rgba(0,0,0,0.1)',
                      },
                    }}
                  >
                    {info.icon}
                    <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                      {info.title}
                    </Typography>
                    {info.link ? (
                      <Typography
                        component="a"
                        href={info.link}
                        color="primary"
                        sx={{ textDecoration: 'none' }}
                      >
                        {info.content}
                      </Typography>
                    ) : (
                      <Typography color="text.secondary">
                        {info.content}
                      </Typography>                    )}
                  </Paper>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Grid>

          <Grid item xs={12} md={8}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >              <Paper 
                elevation={0}
                sx={{ 
                  p: { xs: 3, sm: 4 },
                  bgcolor: 'background.paper',
                  borderRadius: 2,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                }}
              >
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        fullWidth
                        label="Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        label="Subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        multiline
                        rows={4}
                        label="Message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={loading}
                        fullWidth
                      >
                        {loading ? (
                          <CircularProgress size={24} color="inherit" />
                        ) : (
                          'Send Message'
                        )}
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>
      </Container>

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
  );
}

export default Contact;
