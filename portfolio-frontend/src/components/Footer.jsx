import { Box, Container, Typography, IconButton, Stack, Link, Grid } from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import TwitterIcon from '@mui/icons-material/Twitter';
import { Link as RouterLink } from 'react-router-dom';

function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { title: 'Home', path: '/' },
    { title: 'About', path: '/about' },
    { title: 'Portfolio', path: '/portfolio' },
    { title: 'Services', path: '/services' },
    { title: 'Blog', path: '/blog' },
    { title: 'Contact', path: '/contact' },
  ];

  const socialLinks = [
    { icon: <LinkedInIcon />, url: 'https://www.linkedin.com/in/faith-adeyekun-14893a363', label: 'LinkedIn' },
    { icon: <GitHubIcon />, url: 'https://github.com/GOALLINNOOUT', label: 'GitHub' },
    { icon: <TwitterIcon />, url: 'https://x.com/AdelaAdeyekun', label: 'Twitter' },
  ];

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'primary.main',
        color: 'white',
        py: { xs: 4, sm: 6, md: 8 },
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">        <Grid container spacing={{ xs: 4, sm: 6, md: 6 }}>
          
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: { xs: 2, sm: 3 } }}>
              ADELA
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
              Creating beautiful and functional web experiences with modern technologies.
            </Typography>
          </Grid>          
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Quick Links
            </Typography>
            <Stack spacing={1}>
              {footerLinks.map((link) => (
                <Link
                  key={link.title}
                  component={RouterLink}
                  to={link.path}
                  sx={{
                    color: 'inherit',
                    textDecoration: 'none',
                    opacity: 0.9,
                    '&:hover': {
                      opacity: 1,
                      textDecoration: 'underline',
                    },
                  }}
                >
                  {link.title}
                </Link>
              ))}
            </Stack>
          </Grid>         
          <Grid item xs={12} sm={12} md={4}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Connect With Me
            </Typography>
            <Stack direction="row" spacing={1}>
              {socialLinks.map((social) => (
                <IconButton
                  key={social.label}
                  component="a"
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  sx={{
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Stack>
          </Grid>
        </Grid>

        <Typography 
          variant="body2" 
          align="center" 
          sx={{ 
            mt: { xs: 4, sm: 6 },
            pt: 2,
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            opacity: 0.9
          }}
        >
          © {currentYear} ADELA. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}

export default Footer;
