import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './context/ThemeContext';
import { useMemo } from 'react';
import { AuthProvider } from './context/AuthContext';
import { SpotifyProvider } from './context/SpotifyContext';
import { useState, useEffect } from 'react';
import { inject } from '@vercel/analytics';
import { SpeedInsights } from '@vercel/speed-insights/react';
import ScrollToTop from './components/ScrollToTop';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import NotFound from './components/NotFound';
import DarkModeToggle from './components/DarkModeToggle';
import PersistentSpotifyPlayer from './components/PersistentSpotifyPlayer';
import RestoreSpotifyPlayer from './components/RestoreSpotifyPlayer';

import Home from './pages/Home';
import About from './pages/About';
import Portfolio from './pages/Portfolio';
import Services from './pages/Services';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Contact from './pages/Contact';
import Testimonials from './pages/Testimonials';
import Admin from './pages/Admin';

function App() {
  inject();

  const [showAdmin, setShowAdmin] = useState(false);

  // Detect system theme preference
  const systemPrefersDark = useMemo(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'Meta') {
        setShowAdmin(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <HelmetProvider>
      <Router>
        <ThemeProvider defaultMode={systemPrefersDark ? 'dark' : 'light'}>
          <CssBaseline />
          <AuthProvider>
            <SpotifyProvider>
              <div className="app">
                <ScrollToTop />
                <Navbar showAdmin={showAdmin} />
                <main>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/portfolio" element={<Portfolio />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/blog/:id" element={<BlogPost />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/testimonials" element={<Testimonials />} />
                    <Route path="/admin/*" element={showAdmin ? <Admin /> : <NotFound />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                <PersistentSpotifyPlayer />
                <Footer />
                <RestoreSpotifyPlayer />
                <DarkModeToggle setShowAdmin={setShowAdmin} title="Toggle dark mode" />
                <SpeedInsights />
              </div>
            </SpotifyProvider>
          </AuthProvider>
        </ThemeProvider>
      </Router>
    </HelmetProvider>
  );
}

export default App;
