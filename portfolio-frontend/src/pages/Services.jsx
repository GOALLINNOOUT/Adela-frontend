import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
} from '@mui/material';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import SectionHeading from '../components/SectionHeading';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { Link as RouterLink } from 'react-router-dom';

const MotionCard = motion(Card);

const services = [
  {
    title: 'Web Development',
    description: 'Custom web applications tailored to your business needs',
    price: 'Starting at $500',
    features: [
      'Custom Frontend Development',
      'Backend API Development',
      'Database Design & Integration',
      'Responsive Design',
      'Performance Optimization',
      'SEO Best Practices',
    ],
  },
  {
    title: 'Consulting',
    description: 'Technical guidance and solutions for your projects',
    price: '$25/hour',
    features: [
      'Technical Architecture',
      'Code Review',
      'Performance Optimization',
      'Best Practices Implementation',
      'Team Training',
      'Project Planning',
    ],
  },
];

function Services() {
  return (
    <Box>
      <Helmet>
        <title>Services | Adela Portfolio</title>
        <meta name="description" content="Professional web development, consulting, and project services from Adela. Custom web apps, API development, and technical consulting." />
        <meta name="keywords" content="web development, consulting, services, frontend, backend, Adela, adela portfolio, Adeyekun adelola" />
        <link rel="canonical" href="https://adelaportfolio.vercel.app/services" />
      </Helmet>
      <Container sx={{ py: 8 }}>
        <SectionHeading
          title="Services"
          subtitle="Professional web development and design services to help your business grow"
        />

        <Grid container spacing={4}>
          {services.map((service, index) => (
            <Grid item xs={12} md={4} key={service.title}>
              <MotionCard
                elevation={3}
                sx={{ height: '100%' }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <CardContent>
                  <Stack spacing={3}>
                    <Box>
                      <Typography variant="h4" component="h2" gutterBottom>
                        {service.title}
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        color="text.secondary"
                        paragraph
                      >
                        {service.description}
                      </Typography>
                      <Typography
                        variant="h5"
                        color="primary"
                        sx={{ mb: 3 }}
                      >
                        {service.price}
                      </Typography>
                    </Box>

                    <List disablePadding>
                      {service.features.map((feature) => (
                        <ListItem key={feature} disableGutters>
                          <ListItemIcon sx={{ minWidth: 40 }}>
                            <CheckCircleOutlineIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText primary={feature} />
                        </ListItem>
                      ))}
                    </List>

                    <Button
                      variant="contained"
                      component={RouterLink}
                      to="/contact"
                      size="large"
                      fullWidth
                    >
                      Get Started
                    </Button>
                  </Stack>
                </CardContent>
              </MotionCard>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 12 }}>
          <SectionHeading
            title="My Process"
            subtitle="Here's how we'll work together to bring your project to life"
          />
          <Grid container spacing={4}>
            {[
              {
                step: '01',
                title: 'Discovery',
                description:
                  'We start with a detailed discussion about your project requirements, goals, and vision.',
              },
              {
                step: '02',
                title: 'Planning',
                description:
                  'I create a comprehensive project plan including timeline, deliverables, and milestones.',
              },
              {
                step: '03',
                title: 'Development',
                description:
                  'The project is developed iteratively with regular updates and feedback sessions.',
              },
              {
                step: '04',
                title: 'Launch',
                description:
                  'After thorough testing, your project goes live with ongoing support as needed.',
              },
            ].map((phase, index) => (
              <Grid item xs={12} sm={6} md={3} key={phase.step}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                >
                  <Typography
                    variant="h2"
                    color="primary"
                    sx={{ mb: 2, opacity: 0.5 }}
                  >
                    {phase.step}
                  </Typography>
                  <Typography variant="h5" gutterBottom>
                    {phase.title}
                  </Typography>
                  <Typography color="text.secondary">
                    {phase.description}
                  </Typography>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>

       
        <Box
          sx={{
            mt: 12,
            p: 6,
            textAlign: 'center',
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 1,
          }}
        >
          <Typography variant="h3" gutterBottom>
            Ready to Start Your Project?
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}
          >
            Let's discuss how I can help bring your vision to life. Schedule a free
            consultation today.
          </Typography>
          <Button
            variant="contained"
            size="large"
            component={RouterLink}
            to="/contact"
          >
            Schedule Consultation
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default Services;
