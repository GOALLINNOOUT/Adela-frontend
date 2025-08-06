import { Box, Container, Grid, Typography, Paper, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import SectionHeading from '../components/SectionHeading';
import CodeIcon from '@mui/icons-material/Code';
import BrushIcon from '@mui/icons-material/Brush';
import DevicesIcon from '@mui/icons-material/Devices';
import { Helmet } from 'react-helmet-async';

import aboutImage from '../assets/images/about.JPG';

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
        <title>About Adela | Full Stack Developer</title>
        <meta name="description" content="Learn more about Adela, a passionate full-stack developer with expertise in frontend and backend technologies, design, and user experience." />
        <meta name="keywords" content="Adela, about, full stack developer, web development, React, Node.js, portfolio" />
        <meta name="author" content="ADELA" />
        <meta property="og:title" content="About Adela | Full Stack Developer" />
        <meta property="og:description" content="Discover Adela's journey, skills, and expertise in web development, design, and technology." />
        <meta property="og:type" content="profile" />
        <meta property="og:image" content="https://adelaportfolio.vercel.app/assets/hero-982354f0.jpg" />
        <meta property="og:url" content="https://adelaportfolio.vercel.app/about" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About Adela | Full Stack Developer" />
        <meta name="twitter:description" content="Learn more about Adela, a passionate full-stack developer with expertise in frontend and backend technologies, design, and user experience." />
        <meta name="twitter:image" content="https://adelaportfolio.vercel.app/assets/hero-982354f0.jpg" />
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
                  Hello! I'm Adela, a passionate full-stack developer with a keen eye for design
                  and a love for creating seamless user experiences. With a year of experience
                  in web development, I've had the pleasure of working on various exciting projects
                  that have helped businesses achieve their goals.
                </Typography>
                <Typography variant="body1" paragraph>
                  My journey in technology began at a young age around 10 years old but my involvement in web development started in 2023. I developed a keen interest in understanding how websites function and perform efficiently.

                However, in 2024, I was overwhelmed with academic commitments as I prepared for life-defining examinations, including WAEC, JAMB, and NECO. To maintain focus, I had to set aside all potential distractions. By August, I had successfully completed my exams, and shortly thereafter, my father enrolled me in an academy JIT Solution that specializes in web development, mobile applications, and various other technical fields.

                During my time at the academy, I learned from experienced mentors, including Mr. Deji and Mr. Abraham, as well as from my colleagues. Since then, I have been continuously learning, adapting to emerging technologies, and strengthening my foundation in software development principles.
                </Typography>
                <Typography variant="body1">
                  When I'm not coding, you can find me sleeping, watching movies, reading, learning.
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
