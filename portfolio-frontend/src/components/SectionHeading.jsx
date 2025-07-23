import { Box, Typography, Container } from '@mui/material';
import { motion } from 'framer-motion';

const MotionTypography = motion(Typography);

function SectionHeading({ title, subtitle, align = 'center', sx = {} }) {
  return (
    <Box sx={{ mb: 6, ...sx }}>
      <Container>
        <MotionTypography
          variant="h2"
          align={align}
          gutterBottom
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {title}
        </MotionTypography>
        {subtitle && (
          <MotionTypography
            variant="body1"
            align={align}
            color="text.secondary"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {subtitle}
          </MotionTypography>
        )}
      </Container>
    </Box>
  );
}

export default SectionHeading;
