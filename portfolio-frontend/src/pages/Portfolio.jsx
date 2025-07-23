import { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
} from '@mui/material';
import { motion } from 'framer-motion';
import SectionHeading from '../components/SectionHeading';
import LinkIcon from '@mui/icons-material/Link';
import GitHubIcon from '@mui/icons-material/GitHub';
import project1Image from '../assets/images/project1.png';
import project2Image from '../assets/images/project2.png';
import jcclosetImage from '../assets/images/jccloset.png';
const MotionCard = motion(Card);




const projects = [
  {
    id: 1,
    title: 'Scentsation by JC',
    description: 'A full-stack e-commerce platform with JavaScript, PHP, and MySQL',
    image: project1Image,
    technologies: ['HTML', 'PHP', 'MySQL', 'CSS', 'JavaScript'],
    liveUrl: 'not available',
    githubUrl: 'https://github.com/ADELA009/Scentsation-by-jc',
    details: 'Built a complete e-commerce solution with user authentication, product management, shopping cart, and payment integration. The website is yet to be launched but includes all essential features for a modern e-commerce platform.',
    features: [
      'User authentication and authorization',
      'Product catalog with search and filters',
      'Shopping cart and checkout process',
      'Admin dashboard for product management',
      'Payment integration with paystack',
    ],
  },
  {
    id: 2,
    title: ' Adela\'s Portfolio Website',
    description: 'A modern portfolio built with React, Material-UI, and Framer Motion',
    image: project2Image,
    technologies: ['React', 'Material-UI', 'Framer Motion', 'Node.js', 'Express', 'MongoDB', 'CSS', 'JavaScript', 'HTML'],
    liveUrl: 'https://adelaportfolio.vercel.app/',
    githubUrl: 'https://github.com/PHILIPADELA/portfolio-backend',
    details: 'Designed and developed a modern portfolio website showcasing my projects and skills. The website features a clean, responsive design with smooth animations and a full-featured blog and admin dashboard.',
    features: [
      'Responsive Material-UI design with custom theme',
      'Smooth page transitions and animations with Framer Motion',
      'Dynamic blog with content management system',
      'Contact form with email integration',
      'Testimonials section with admin approval system',
      'Project showcase with detailed project pages',
      'Full-stack implementation with Node.js backend',
    ],
  },
  {
    id: 3,
    title: "JC's Closet",
    description: 'A modern fashion and fragrance e-commerce site with personalized style guidance.',
    image: jcclosetImage,
    technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Material-UI', 'Framer Motion', 'Paystack', 'CSS', 'JavaScript', 'HTML',],
    liveUrl: 'https://jccloset.vercel.app/',
    githubUrl: 'https://github.com/GOALLINNOOUT/frontend',
    details: "JC's Closet is a curated platform for fashion and luxury perfumes, offering a seamless shopping experience, personalized style advice, and expert consultations. Features include a perfume collection, fashion portfolio, style guide, blog, appointment booking, and admin dashboard.",
    features: [
      'Curated perfume and fashion collections',
      'Personalized style and scent recommendations',
      'Blog with style tips and fragrance trends',
      'Appointment booking for styling and consultations',
      'Admin dashboard for product and order management',
      'Secure payments with Paystack',
      'Responsive design and user-friendly interface',
    ],
  },
];

function Portfolio() {
  const [selectedProject, setSelectedProject] = useState(null);

  const handleOpenDialog = (project) => {
    setSelectedProject(project);
  };

  const handleCloseDialog = () => {
    setSelectedProject(null);
  };

  return (
    <Box>
      <Container sx={{ py: 8 }}>
        <SectionHeading
          title="My Portfolio"
          subtitle="Here are some of the projects I've worked on"
        />

        <Grid container spacing={4}>
          {projects.map((project, index) => (
            <Grid item xs={12} md={6} lg={4} key={project.id}>
              <MotionCard
                elevation={2}
                sx={{ height: '100%' }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={project.image}
                  alt={project.title}
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {project.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {project.description}
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
                    {project.technologies.map((tech) => (
                      <Chip
                        key={tech}
                        label={tech}
                        size="small"
                        sx={{ mb: 1 }}
                      />
                    ))}
                  </Stack>
                  <Stack direction="row" spacing={2}>
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => handleOpenDialog(project)}
                    >
                      Learn More
                    </Button>
                    {project.liveUrl && (
                      <Button
                        size="small"
                        startIcon={<LinkIcon />}
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Live Demo
                      </Button>
                    )}
                    {project.githubUrl && (
                      <Button
                        size="small"
                        startIcon={<GitHubIcon />}
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Code
                      </Button>
                    )}
                  </Stack>
                </CardContent>
              </MotionCard>
            </Grid>
          ))}
        </Grid>
      </Container>


      <Dialog
        open={Boolean(selectedProject)}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedProject && (
          <>
            <DialogTitle>{selectedProject.title}</DialogTitle>
            <DialogContent>
              <Box
                component="img"
                src={selectedProject.image}
                alt={selectedProject.title}
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 1,
                  mb: 2,
                }}
              />
              <Typography variant="body1" paragraph>
                {selectedProject.details}
              </Typography>
              <Typography variant="h6" gutterBottom>
                Key Features:
              </Typography>
              <ul>
                {selectedProject.features.map((feature) => (
                  <Typography
                    component="li"
                    variant="body1"
                    key={feature}
                    sx={{ mb: 1 }}
                  >
                    {feature}
                  </Typography>
                ))}
              </ul>
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Technologies Used:
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {selectedProject.technologies.map((tech) => (
                    <Chip key={tech} label={tech} sx={{ mb: 1 }} />
                  ))}
                </Stack>
              </Box>
            </DialogContent>
            <DialogActions>
              {selectedProject.liveUrl && (
                <Button
                  startIcon={<LinkIcon />}
                  href={selectedProject.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Live
                </Button>
              )}
              {selectedProject.githubUrl && (
                <Button
                  startIcon={<GitHubIcon />}
                  href={selectedProject.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Code
                </Button>
              )}
              <Button onClick={handleCloseDialog}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}

export default Portfolio;
