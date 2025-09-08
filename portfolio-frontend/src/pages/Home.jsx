import { Box, Container, Typography, Button, Grid, Card, CardContent, CardMedia, Chip, Avatar } from '@mui/material';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CodeIcon from '@mui/icons-material/Code';
import StorageIcon from '@mui/icons-material/Storage';
import BrushIcon from '@mui/icons-material/Brush';
import BuildIcon from '@mui/icons-material/Build';
import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import SpotifyPlaylist from '../components/SpotifyPlaylist';
import heroImage from '../assets/images/hero.jpg';
import project1Image from '../assets/images/project1.png'; 
import project2Image from '../assets/images/project2.png';
import jcclosetImage from '../assets/images/jccloset.png';

const MotionBox = motion(Box);
const MotionTypography = motion(Typography);

function Home() {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/testimonials`);
        if (!response.ok) throw new Error('Failed to fetch testimonials');
        const data = await response.json();
        
        const approvedTestimonials = data.filter(t => t.approved).slice(-4);
        setTestimonials(approvedTestimonials);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      }
    };

    fetchTestimonials();
  }, []);

  return (
    <Box component="main">
      <Helmet>
        <title>Adela - Full Stack Developer | Affordable Web Development</title>
        <meta name="description" content="Experienced Full Stack Developer. Specializing in affordable web development, modern web applications, and creative solutions. Young and innovative developer delivering quality results." />
        <meta name="keywords" content="Adela, Full Stack Developer, Web Developer, Affordable Web Developer, Young Web Developer, React Developer, Nigeria, Node.js Developer, MongoDB, JavaScript, TypeScript, Web Development, UI/UX Design, Portfolio, Modern Web Applications, API Development, Database Management, Git, Docker, Postman, VS Code, GitHub, Framer Motion, Material-UI, CSS3, HTML5, PHP, MySQL, Express.js, RESTful APIs, Frontend, Backend, Designer, Creative Developer, Software Engineer, Client Testimonials, Skills, Projects, Contact" />
        <meta name="author" content="ADELA" />
        <meta property="og:title" content="Adela - Full Stack Developer" />
        <meta property="og:description" content="Young and innovative Full Stack Developer, offering affordable web development services with modern technologies." />
        <meta property="og:image" content={heroImage} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://adelaportfolio.vercel.app/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Adela - Full Stack Developer" />
        <meta name="twitter:description" content="Experienced Full Stack Developer. Specializing in affordable web development, modern web applications, and creative solutions." />
        <meta name="twitter:image" content={heroImage} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://adelaportfolio.vercel.app/" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "http://schema.org",
            "@type": "Person",
            "name": "Adela",
            "jobTitle": "Full Stack Developer & Designer",
            "description": "Young and innovative Full Stack Developer, offering affordable web development services",
            "priceRange": "$$",
            "knowsAbout": [
              "React",
              "JavaScript",
              "TypeScript",
              "Node.js",
              "MongoDB",
              "Web Development",
              "UI/UX Design",
              "Affordable Web Development",
              "Full Stack Development"
            ],
            "skills": [
              "Frontend Development",
              "Backend Development",
              "Web Design",
              "Database Management",
              "API Development",
              "Affordable Web Solutions",
              "Modern Web Applications"
            ]
          })}
        </script>
      </Helmet>
      <Box
        sx={{
          background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
          color: 'white',
          py: { xs: 8, sm: 10, md: 12 },
          mb: { xs: 4, sm: 5, md: 6 },
          borderRadius: { sm: '0 0 2rem 2rem' },
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        }}
      >        <Container>
          <Grid container spacing={{ xs: 4, sm: 6, md: 8 }} alignItems="center">
            <Grid item xs={12} sm={12} md={6}>
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <MotionTypography
                  variant="h1"
                  sx={{
                    fontWeight: 700,
                    mb: 2,
                  }}
                >
                  Hello, I'm Adela
                </MotionTypography>
                <Typography variant="h4" sx={{ mb: 4 }}>
                  Full Stack Developer & Designer
                </Typography>                <Typography variant="body1" sx={{ mb: 4 }}>
                  As a young and innovative Full Stack Developer, I specialize in creating modern web applications that are both beautiful and functional. 
                  I create beautiful and functional web applications at affordable rates. 
                  My modern tech stack and best practices ensure quality results for clients across the Globe.
                </Typography>
                <Button
                  component={RouterLink}
                  to="/portfolio"
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    bgcolor: 'white',
                    color: 'primary.main',
                    '&:hover': {
                      bgcolor: 'grey.100',
                    },
                  }}
                >
                  View My Work
                </Button>
              </MotionBox>            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <MotionBox
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                             <Box
                  component="img"
                  src={heroImage}
                  alt="Adela - Full Stack Developer and Designer"
                  sx={{
                    maxWidth: '100%',
                    height: 'auto',
                    borderRadius: 2,
                  }}
                />
              </MotionBox>
            </Grid>
          </Grid>
        </Container>
      </Box>     
      <Container sx={{ py: 8 }} component="section" aria-label="Featured Projects">
        <Typography variant="h2" align="center" gutterBottom>
          Featured Projects
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary" paragraph>
          Here are some of my recent works
        </Typography>
        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
          <Grid item xs={12} sm={6} lg={4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Card sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.3s ease-in-out',
                '&:hover': { transform: 'translateY(-8px)' },
              }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={project1Image}
                  alt="Modern E-commerce Platform Project - Full Stack Development"
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" component="h3" gutterBottom>
                    E-commerce Platform
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    A full-stack e-commerce solution with modern design.
                  </Typography>
                </CardContent>
                <Box sx={{ p: 2 }}>
                  <Button
                    component={RouterLink}
                    to="/portfolio"
                    variant="outlined"
                    fullWidth
                    aria-label="Learn more about E-commerce Platform"
                  >
                    Learn More about E-commerce Platform
                  </Button>
                </Box>
              </Card>
            </motion.div>
          </Grid>

          <Grid item xs={12} sm={6} lg={4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.3s ease-in-out',
                '&:hover': { transform: 'translateY(-8px)' },
              }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={project2Image}
                  alt="Modern Portfolio Website Built with React and Material-UI"
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" component="h3" gutterBottom>
                    Portfolio Website
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    A modern portfolio built with React and Material-UI.
                  </Typography>
                </CardContent>
                <Box sx={{ p: 2 }}>
                  <Button
                    component={RouterLink}
                    to="/portfolio"
                    variant="outlined"
                    fullWidth
                    aria-label="Learn more about Portfolio Website"
                  >
                    Learn More about Portfolio Website
                  </Button>
                </Box>
              </Card>
            </motion.div>
          </Grid>

          <Grid item xs={12} sm={6} lg={4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.3s ease-in-out',
                '&:hover': { transform: 'translateY(-8px)' },
              }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={jcclosetImage}
                  alt="JC's Closet - Fashion and Fragrance E-commerce"
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" component="h3" gutterBottom>
                    JC's Closet
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    A modern fashion and fragrance e-commerce site with personalized style guidance.
                  </Typography>
                </CardContent>
                <Box sx={{ p: 2 }}>
                  <Button
                    component={RouterLink}
                    to="/portfolio"
                    variant="outlined"
                    fullWidth
                    aria-label="Learn more about JC's Closet"
                  >
                    Learn More about JC's Closet
                  </Button>
                </Box>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </Container>

      {testimonials.length > 0 && (
        <Container sx={{ py: 8 }} component="section" aria-label="Client Testimonials">
          <Typography variant="h2" align="center" gutterBottom>
            Client Testimonials
          </Typography>
          <Typography variant="body1" align="center" color="text.secondary" paragraph>
            What my clients say about working with me
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} sm={6} md={4} key={testimonial._id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card
                    sx={{
                      // fixed height across breakpoints, responsive width via grid + maxWidth
                      height: 260,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      p: 3,
                      overflow: 'hidden',
                      width: '100%',
                      maxWidth: { xs: '100%', sm: 520, md: 560 },
                      mx: 'auto',
                    }}
                  >
                    <Avatar
                      src={testimonial.image}
                      alt={testimonial.name}
                      sx={{
                        width: 80,
                        height: 80,
                        mb: 2,
                        border: '2px solid',
                        borderColor: 'primary.main',
                      }}
                    />
                    <Typography variant="h6" gutterBottom>
                      {testimonial.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {testimonial.position} - {testimonial.rating} Stars
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontStyle: 'italic',
                        mb: 2,
                        // clamp long testimonials so cards keep the same height
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      "{testimonial.testimonial}"
                    </Typography>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      )}      <Container sx={{ py: 8 }} component="section" aria-label="Skills">
        <Typography variant="h2" align="center" gutterBottom>
          My Skills
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary" paragraph>
          Technologies and tools I work with
        </Typography>
        
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Card sx={{ height: 220, p: 3, overflow: 'hidden', mx: 'auto', maxWidth: { xs: '100%', sm: 520, md: 520 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CodeIcon color="primary" sx={{ fontSize: 40, mr: 1 }} />
                  <Typography variant="h6">Frontend</Typography>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  <Chip label="React" color="primary" />
                  <Chip label="TypeScript" color="primary" />
                  <Chip label="JavaScript" color="primary" />
                  <Chip label="HTML5" color="primary" />
                  <Chip label="CSS3" color="primary" />
                  <Chip label="Material-UI" color="primary" />
                  <Chip label="Framer Motion" color="primary" />
                </Box>
              </Card>
            </motion.div>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card sx={{ height: 220, p: 3, overflow: 'hidden', mx: 'auto', maxWidth: { xs: '100%', sm: 520, md: 520 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <StorageIcon color="primary" sx={{ fontSize: 40, mr: 1 }} />
                  <Typography variant="h6">Backend</Typography>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  <Chip label="Node.js" color="primary" />
                  <Chip label="Express.js" color="primary" />
                  <Chip label="MongoDB" color="primary" />
                  <Chip label="RESTful APIs" color="primary" />
                  <Chip label="PHP" color="primary" />
                  <Chip label="MySQL" color="primary" />
                </Box>
              </Card>
            </motion.div>
          </Grid>

          {/* Design skill card removed as per user request */}

          <Grid item xs={12} sm={6} md={4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Card sx={{ height: 220, p: 3, overflow: 'hidden', mx: 'auto', maxWidth: { xs: '100%', sm: 520, md: 520 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <BuildIcon color="primary" sx={{ fontSize: 40, mr: 1 }} />
                  <Typography variant="h6">Tools & Others</Typography>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  <Chip label="Git" color="primary" />
                  <Chip label="Docker" color="primary" />
                  <Chip label="Postman" color="primary" />
                  <Chip label="VS Code" color="primary" />
                  <Chip label="GitHub" color="primary" />

                </Box>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </Container>

      <Box
        component="section"
        sx={{          background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
          color: 'white',
          py: { xs: 8, sm: 10, md: 12 },
          mt: 4,
          mb: { xs: 6, sm: 8, md: 10 },
          borderRadius: { sm: '2rem 2rem 2rem 2rem' },
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        }}
      >
        <Container>
          <Grid container spacing={4} alignItems="center" justifyContent="center">
            <Grid item xs={12} md={8} textAlign="center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <Typography variant="h2" gutterBottom>
                  Let's Work Together
                </Typography>
                <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
                  Have a project in mind? I'd love to help bring your ideas to life.
                </Typography>
                <Button
                  component={RouterLink}
                  to="/contact"
                  variant="contained"
                  size="large"
                  sx={{
                    bgcolor: 'white',
                    color: 'primary.main',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    '&:hover': {
                      bgcolor: 'grey.100',
                    },
                  }}
                >
                  Get in Touch
                </Button>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>


    </Box>
  );
}

export default Home;
