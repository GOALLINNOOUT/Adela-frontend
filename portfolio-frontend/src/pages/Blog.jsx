import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
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
  TextField,
  InputAdornment,
  Stack,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  CardActions,
  Snackbar,
  CircularProgress,
  Fab,
  useTheme,
  ToggleButtonGroup,
  ToggleButton,
  Tooltip,
} from '@mui/material';
import { useThemeContext } from '../context/ThemeContext';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { AccessTime, Share, ArrowForward, ContentCopy, Bookmark, BookmarkBorder } from '@mui/icons-material';
import { motion } from 'framer-motion';
import SectionHeading from '../components/SectionHeading';
import SearchIcon from '@mui/icons-material/Search';
import { getImageUrl, handleImageError } from '../utils/imageHelper';
import { Link as RouterLink } from 'react-router-dom';

const MotionCard = motion(Card);

function Blog() {
  const [loading, setLoading] = useState(false);
  const [blogPosts, setBlogPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('date');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [showBookmarked, setShowBookmarked] = useState(false);
  const theme = useTheme();
  const { toggleColorMode, mode, isBlogPage } = useThemeContext();
  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://portfolio-backend-ckqx.onrender.com/api/blog');
      
      if (!response.ok) {
        throw new Error('Failed to fetch blog posts');
      }
      
      const data = await response.json();
      setBlogPosts(data);
    } catch (error) {
      console.error('Error:', error);
      setSnackbarMessage('Failed to load blog posts');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  
  const handleShare = async (post, event) => {
    
    event.preventDefault();
    event.stopPropagation();
    
    const shareData = {
      title: post.title,
      text: post.excerpt,
      url: window.location.origin + `/blog/${post._id}`
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        setSnackbarMessage('Shared successfully!');
      } else {
        await navigator.clipboard.writeText(shareData.url);
        setSnackbarMessage('Link copied to clipboard!');
      }
    } catch (error) {
      setSnackbarMessage('Error sharing post');
    }
    setSnackbarOpen(true);
  };

  
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  const handleBookmark = (post, event) => {
    event.preventDefault();
    event.stopPropagation();
    
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    let newBookmarks;
    let message;

    if (bookmarks.includes(post._id)) {
      newBookmarks = bookmarks.filter(id => id !== post._id);
      message = 'Article removed from bookmarks';
    } else {
      newBookmarks = [...bookmarks, post._id];
      message = 'Article bookmarked successfully';
    }

    localStorage.setItem('bookmarks', JSON.stringify(newBookmarks));
    setSnackbarMessage(message);
    setSnackbarOpen(true);
    
    setBlogPosts([...blogPosts]);
  };

  const categories = ['All', ...new Set(blogPosts.map(post => post.category))];

  
  const bookmarkedPosts = JSON.parse(localStorage.getItem('bookmarks') || '[]');

  const filteredPosts = blogPosts
    .filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
      const matchesBookmark = showBookmarked ? bookmarkedPosts.includes(post._id) : true;
      return matchesSearch && matchesCategory && matchesBookmark;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      return a.title.localeCompare(b.title);
    });

  // Use shared getImageUrl from utils/imageHelper

  return (
    <>
      <Helmet>
        <title>Blog | Adela Portfolio</title>
        <meta name="description" content="Read insights, updates, and articles from Adela's blog. Stay up to date with web development, design, and technology trends." />
        <meta name="keywords" content="Adela, blog, web development, frontend, backend, portfolio, articles, insights, updates" />
        <meta name="author" content="ADELA" />
        <meta property="og:title" content="Blog | Adela Portfolio" />
        <meta property="og:description" content="Read insights, updates, and articles from Adela's blog. Stay up to date with web development, design, and technology trends." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://adelaportfolio.vercel.app/assets/hero-982354f0.jpg" />
        <meta property="og:url" content="https://adelaportfolio.vercel.app/blog" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Blog | Adela Portfolio" />
        <meta name="twitter:description" content="Read insights, updates, and articles from Adela's blog. Stay up to date with web development, design, and technology trends." />
        <meta name="twitter:image" content="https://adelaportfolio.vercel.app/assets/hero-982354f0.jpg" />
        <link rel="canonical" href="https://adelaportfolio.vercel.app/blog" />
      </Helmet>
      <Container maxWidth="lg">
        <Box my={4} sx={{ bgcolor: mode === 'dark' ? 'background.default' : 'inherit' }}>
          <SectionHeading 
            title="Blog" 
            subtitle="Insights & Updates"
            sx={{ color: mode === 'dark' ? 'text.primary' : 'inherit' }}
          />
          {loading ? (
            <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Box mb={4} display="flex" flexWrap="wrap" gap={2} alignItems="center">
                <TextField
                  label="Search Posts"
                  variant="outlined"
                  size="small"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{ flexGrow: 1 }}
                />
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    label="Category"
                  >
                    {categories.map(category => (
                      <MenuItem key={category} value={category}>{category}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel>Sort By</InputLabel>
                  <Select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    label="Sort By"
                  >
                    <MenuItem value="date">Latest First</MenuItem>
                    <MenuItem value="title">Title</MenuItem>
                  </Select>
                </FormControl>
                <Tooltip title={showBookmarked ? "Show all posts" : "Show bookmarked posts"}>
                  <IconButton 
                    onClick={() => setShowBookmarked(!showBookmarked)}
                    color={showBookmarked ? "primary" : "default"}
                  >
                    {showBookmarked ? <Bookmark /> : <BookmarkBorder />}
                  </IconButton>
                </Tooltip>
              </Box>
              {/* Blog Posts Grid */}
              <Grid container spacing={3}>
                {filteredPosts.map((post) => (
                  <Grid item xs={12} sm={6} md={4} key={post._id}>
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'transform 0.2s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                        },
                      }}
                      component={RouterLink}
                      to={`/blog/${post._id}`}
                    >
                      <CardMedia
                        component="picture"
                        sx={{ height: 200, width: '100%' }}
                      >
                        <source srcSet={getImageUrl(post.image).replace(/\.(jpg|png)$/i, '.webp')} type="image/webp" />
                        <img
                          src={getImageUrl(post.image)}
                          alt={post.title}
                          loading="lazy"
                          style={{ width: '100%', height: 200, objectFit: 'cover', backgroundColor: '#f5f5f5', borderRadius: '4px' }}
                          width="380"
                          height="200"
                          onError={handleImageError}
                        />
                      </CardMedia>
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography
                          variant="overline"
                          color="primary"
                          gutterBottom
                        >
                          {post.category}
                        </Typography>
                        <Typography
                          variant="h6"
                          gutterBottom
                          sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                          }}
                        >
                          {post.title}
                        </Typography>
                        <Typography
                          color="text.secondary"
                          paragraph
                          sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                          }}
                        >
                          {post.excerpt}
                        </Typography>
                        <Box display="flex" alignItems="center" gap={1}>
                          <AccessTime fontSize="small" color="action" />
                          <Typography variant="caption" color="text.secondary">
                            {post.readTime}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
                            {new Date(post.createdAt).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </CardContent>
                      <CardActions sx={{ p: 2 }}>
                        <Button 
                          size="small" 
                          endIcon={<ArrowForward />}
                          sx={{ '&:hover': { textDecoration: 'none' } }}
                        >
                          Read More
                        </Button>
                        <Box sx={{ flexGrow: 1 }} />
                        <Tooltip title="Bookmark">
                          <IconButton 
                            size="small"
                            onClick={(e) => handleBookmark(post, e)}
                            sx={{ 
                              '&:hover': { 
                                backgroundColor: 'action.hover',
                              }
                            }}
                          >
                            {bookmarkedPosts.includes(post._id) ? 
                              <Bookmark fontSize="small" color="primary" /> : 
                              <BookmarkBorder fontSize="small" />
                            }
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Share">
                          <IconButton 
                            size="small"
                            onClick={(e) => handleShare(post, e)}
                            sx={{ 
                              '&:hover': { 
                                backgroundColor: 'action.hover',
                              }
                            }}
                          >
                            <Share fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
              {filteredPosts.length === 0 && (
                <Box textAlign="center" py={4}>
                  <Typography variant="h6" color="text.secondary">
                    No posts found matching your criteria
                  </Typography>
                </Box>
              )}
              <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
                message={snackbarMessage}
              />
            </>
          )}
        </Box>
      </Container>
    </>
  );
}

export default Blog;
