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
    title: '🚀 MVP & Full-Stack Product Development',
    description: 'For founders and startups turning ideas into production-ready products.',
    bestFor: 'Startups, solo founders, early-stage products',
    features: [
      'End-to-end React & Node.js applications',
      'Secure authentication & API architecture',
      'Scalable database design (MongoDB)',
      'Real-world experience from projects like MediMate',
    ],
    outcome: 'a production-ready product you can grow with.',
  },
  {
    title: '🎨 Frontend Engineering & UI Systems',
    description: 'For teams that want fast, clean, and intuitive user experiences.',
    bestFor: 'Design-focused teams, UX-first products',
    features: [
      'High-performance React interfaces',
      'Design systems with ShadCN UI & Material UI',
      'Smooth animations with Framer Motion',
      'Fully responsive, accessible layouts',
    ],
    outcome: 'faster load times and better user retention.',
  },
  {
    title: '🔐 Backend, APIs & Integrations',
    description: 'When reliability, security, and scalability matter.',
    bestFor: 'Data-driven products, API-first platforms',
    features: [
      'RESTful APIs with Node.js & Express',
      'JWT & Google OAuth authentication',
      'Database optimization & integration',
      'Third-party services and cloud integrations',
    ],
    outcome: 'a backend that doesn\'t break under scale.',
  },
  {
    title: '🧠 Technical Consulting & Code Review',
    description: 'For teams already building who need direction or optimization.',
    bestFor: 'Growing teams, existing projects needing optimization',
    features: [
      'Architecture planning & system design',
      'Codebase review and refactoring',
      'Performance optimization',
      'Best practices & team guidance',
    ],
    outcome: 'fewer bugs, faster delivery, cleaner systems.',
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
            <Grid item xs={12} md={6} key={service.title}>
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
                      <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
                        {service.title}
                      </Typography>
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        paragraph
                      >
                        {service.description}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ display: 'block', color: 'primary.main', fontWeight: 500, mb: 2 }}
                      >
                        Best for: {service.bestFor}
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

                    <Box sx={{ bgcolor: 'action.hover', p: 2, borderRadius: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Outcome:</strong> {service.outcome}
                      </Typography>
                    </Box>

                    <Button
                      variant="contained"
                      component={RouterLink}
                      to="/contact"
                      size="large"
                      fullWidth
                    >
                      Discuss Your Project
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
            Let's Build Something That Lasts
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            sx={{ mb: 2, maxWidth: 600, mx: 'auto' }}
          >
            If you're looking for a developer who thinks beyond code and focuses on <strong>real outcomes</strong>, let's talk.
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}
          >
            Pricing is flexible and based on project scope.
          </Typography>
          <Button
            variant="contained"
            size="large"
            component={RouterLink}
            to="/contact"
          >
            Start a Conversation
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default Services;
