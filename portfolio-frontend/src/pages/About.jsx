import { Box, Container, Grid, Typography, Paper, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import SectionHeading from '../components/SectionHeading';
import CodeIcon from '@mui/icons-material/Code';
import BrushIcon from '@mui/icons-material/Brush';
import DevicesIcon from '@mui/icons-material/Devices';
import { Helmet } from 'react-helmet-async';

import aboutImage from '../assets/images/about.jpeg';

const skills = [
  {
    icon: <CodeIcon fontSize="large" color="primary" />,
    title: "Frontend Development",
    description: "Building responsive and interactive user interfaces using modern frameworks.",
    technologies: ["React", "JavaScript", "HTML", "CSS", "Vite", "MUI", "Typescript"],
  },
  {
    icon: <DevicesIcon fontSize="large" color="primary" />,
    title: "Backend Development",
    description: "Creating robust server-side applications and APIs.",
    technologies: ["Node.js", "Express", "MongoDB", "REST API", "PHP", "MySQL"],
  },
 
];

const MotionPaper = motion(Paper);
function About() {
  return (
    <>
      <Helmet>
        <title>About Adelola Faith | MERN Stack Developer</title>
        <meta name="description" content="Adelola Faith — MERN stack developer building modern, scalable, and user-friendly web applications. Experienced with MongoDB, Express, React, Node.js and tools like MUI, Framer Motion and JWT." />
        <meta name="keywords" content="Adelola Faith, Adelola, MERN, full stack developer, React, Node.js, MongoDB, portfolio" />
        <meta name="author" content="Adelola Faith" />
        <meta property="og:title" content="About Adelola Faith | MERN Stack Developer" />
        <meta property="og:description" content="Meet Adelola Faith — a MERN stack developer focused on building scalable, user-friendly web apps. Projects include portfolio sites, dashboards and MediMate, a health-tech platform." />
        <meta property="og:type" content="profile" />
        <meta property="og:image" content="https://adelaportfolio.vercel.app/assets/about-cac83981.jpeg" />
        <meta property="og:url" content="https://adelaportfolio.vercel.app/about" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About Adelola Faith | MERN Stack Developer" />
        <meta name="twitter:description" content="Adelola Faith — MERN stack developer building modern, scalable, and user-friendly web applications. Experienced with MongoDB, Express, React, Node.js and tools like MUI, Framer Motion and JWT." />
        <meta name="twitter:image" content="https://adelaportfolio.vercel.app/assets/about-cac83981.jpeg" />
        <link rel="canonical" href="https://adelaportfolio.vercel.app/about" />
      </Helmet>
      {/* ...existing code... */}
      <Box>
        <Container sx={{ py: 8 }}>
          <Grid container spacing={6}>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Typography variant="h1" gutterBottom>
                  About Me
                </Typography>
                <Typography variant="body1" paragraph>
                  Hi, I’m Adelola Faith, a MERN stack developer passionate about building modern,
                  scalable, and user-friendly web applications. I love turning ideas into real product from clean, responsive interfaces to secure and efficient backends.
                </Typography>
                <Typography variant="body1" paragraph>
                  I’ve worked on projects ranging from portfolio websites and dashboards to MediMate,
                  a health-tech platform that combines telemedicine, medication reminders, and AI-driven
                  insights to make healthcare more accessible. My stack includes MongoDB, Express,
                  React, Node.js, and supporting tools like Material UI, ShadCN UI, Framer Motion, and JWT
                  authentication.
                </Typography>
                <Typography variant="body1">
                  Beyond coding, you’ll often find me on the football pitch, experimenting with new food
                  ideas, or imagining how to one day build solutions that stand shoulder to shoulder with
                  giants like Microsoft and Google. For me, it’s not just about writing code it’s about
                  creating impact, pushing boundaries, and constantly improving.
                </Typography>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Box
                  component="img"
                  src={aboutImage}
                  alt="About Me"
                  sx={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: 2,
                    boxShadow: 3,
                  }}
                />
              </motion.div>
            </Grid>
          </Grid>
        </Container>

        <Box sx={{ bgcolor: 'background.paper', py: 8 }}>
          <Container>
            <SectionHeading
              title="What I Do"
              subtitle="Here are the main areas of my expertise"
            />
            <Grid container spacing={4}>
              {skills.map((skill, index) => (
                <Grid item xs={12} md={4} key={skill.title}>
                  <MotionPaper
                    elevation={2}
                    sx={{ p: 4, height: '100%' }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                  >
                    <Stack spacing={2} alignItems="center" textAlign="center">
                      {skill.icon}
                      <Typography variant="h5" component="h3">
                        {skill.title}
                      </Typography>
                      <Typography color="text.secondary">
                        {skill.description}
                      </Typography>
                      <Box>
                        {skill.technologies.map((tech) => (
                          <Typography
                            key={tech}
                            variant="body2"
                            component="span"
                            sx={{
                              bgcolor: 'primary.main',
                              color: 'white',
                              px: 1,
                              py: 0.5,
                              borderRadius: 1,
                              mr: 1,
                              mb: 1,
                              display: 'inline-block',
                            }}
                          >
                            {tech}
                          </Typography>
                        ))}
                      </Box>
                    </Stack>
                  </MotionPaper>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      </Box>
    </>
  );
}

export default About;
