import { useState, useEffect, useRef, useCallback } from 'react';
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
  Skeleton,
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

// Small image component that shows a placeholder while the real image loads
function ImageWithPlaceholder({ src, alt }) {
  // Use an inline SVG data URI with the 🖼 emoji as the placeholder
  const defaultFallback = getImageUrl('uploads/blog/default.jpg');
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='400' viewBox='0 0 800 400'><rect width='100%' height='100%' fill='%23f3f4f6'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='72' font-family='Segoe UI, Roboto, Arial, sans-serif'>🖼</text></svg>`;
  let placeholder;
  try {
    placeholder = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  } catch (e) {
    placeholder = defaultFallback;
  }
  const [displaySrc, setDisplaySrc] = useState(placeholder);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoaded(false);
    setDisplaySrc(placeholder);
    if (!src) return;
    const img = new Image();
    img.src = src;
    img.onload = () => {
      if (!cancelled) {
        setDisplaySrc(src);
        setLoaded(true);
      }
    };
    img.onerror = () => {
      if (!cancelled) {
        setDisplaySrc(placeholder);
        setLoaded(true);
      }
    };
    return () => {
      cancelled = true;
    };
  }, [src]);

  return (
    <Box sx={{ width: '100%', height: 200, overflow: 'hidden' }}>
      {!loaded && <Box className="shimmer" sx={{ width: '100%', height: '100%' }} />}
      <Box
        component="img"
        src={displaySrc}
        alt={alt}
        onError={(e) => handleImageError(e)}
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transition: 'opacity 300ms ease',
          opacity: loaded ? 1 : 0,
          position: 'relative',
        }}
      />
    </Box>
  );
}

function Blog() {
  const [loading, setLoading] = useState(true);
  const [blogPosts, setBlogPosts] = useState([]);
  const [page, setPage] = useState(1);
  const limit = 6;
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('date');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [showBookmarked, setShowBookmarked] = useState(false);
  const theme = useTheme();
  const { toggleColorMode, mode, isBlogPage } = useThemeContext();
  const sentinelRef = useRef(null);
  const abortControllerRef = useRef(null);
  const [observerSupported, setObserverSupported] = useState(typeof window !== 'undefined' && 'IntersectionObserver' in window);
  const minSkeletonMs = 200; // ensure skeleton shows at least this long (ms)

  useEffect(() => {
    // initial load
    setBlogPosts([]);
    setPage(1);
    setHasMore(true);
    fetchBlogPosts(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchBlogPosts = async (pageArg = 1, replace = false) => {
    // Abort any in-flight request before starting a new one
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

  let skeletonStart = 0;
  let aborted = false;
  if (pageArg === 1) skeletonStart = Date.now();

  try {
      if (pageArg === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const params = new URLSearchParams();
      // These params are optional on the backend; if backend doesn't support pagination it will ignore them
      params.append('page', pageArg);
      params.append('limit', limit);
  if (debouncedSearch) params.append('search', debouncedSearch);
      if (selectedCategory && selectedCategory !== 'All') params.append('category', selectedCategory);
      if (sortBy) params.append('sortBy', sortBy);

      const url = `https://portfolio-backend-ckqx.onrender.com/api/blog?${params.toString()}`;
      const response = await fetch(url, { signal: controller.signal });

      if (!response.ok) {
        throw new Error('Failed to fetch blog posts');
      }

      const data = await response.json();

      // Backend might return a full array (no pagination) or an object with posts + meta
      let posts = [];
      let total = null;

      if (Array.isArray(data)) {
        posts = data;
        total = posts.length;
      } else if (data && Array.isArray(data.posts)) {
        posts = data.posts;
        if (typeof data.total === 'number') total = data.total;
      } else if (data) {
        // Unexpected shape: try to coerce
        posts = Array.isArray(data) ? data : (data.posts || []);
      }

      if (replace) {
        setBlogPosts(posts);
      } else {
        setBlogPosts(prev => [
          ...prev,
          ...posts.filter(p => !prev.find(x => x._id === p._id)),
        ]);
      }

      // Determine hasMore:
      // - If backend provides total, compare pages
      // - If backend returned fewer than limit, assume end
      if (typeof total === 'number') {
        const fetched = (pageArg - 1) * limit + posts.length;
        setHasMore(fetched < total);
      } else {
        setHasMore(posts.length === limit);
      }

      if (posts.length > 0) setPage(prev => prev + 1);
    } catch (error) {
      if (error.name === 'AbortError') {
        // Request was aborted; do not show error toast and skip waiting
        aborted = true;
        return;
      }
      console.error('Error:', error);
      setSnackbarMessage('Failed to load blog posts');
      setSnackbarOpen(true);
      setHasMore(false);
    } finally {
      // Ensure skeleton is visible for at least minSkeletonMs on initial load
      if (pageArg === 1 && !aborted && skeletonStart) {
        const elapsed = Date.now() - skeletonStart;
        const remaining = Math.max(0, minSkeletonMs - elapsed);
        if (remaining > 0) {
          await new Promise(resolve => setTimeout(resolve, remaining));
        }
      }

      setLoading(false);
      setLoadingMore(false);
      // clear controller if it's still the current one
      if (abortControllerRef.current === controller) abortControllerRef.current = null;
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

  // Reset and refetch when search, category, sort, or bookmarked toggle changes
  // debounce searchQuery -> debouncedSearch (500ms)
  useEffect(() => {
    setIsSearching(true);
    const t = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
      setIsSearching(false);
    }, 500);
    return () => {
      clearTimeout(t);
      setIsSearching(false);
    };
  }, [searchQuery]);

  useEffect(() => {
    // Cancel any in-flight request for previous filters
    if (abortControllerRef.current) abortControllerRef.current.abort();
    setBlogPosts([]);
    setPage(1);
    setHasMore(true);
    fetchBlogPosts(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, selectedCategory, sortBy, showBookmarked]);

  // IntersectionObserver for infinite scroll
  const handleIntersect = useCallback((entries) => {
    const entry = entries[0];
    if (entry.isIntersecting && hasMore && !loadingMore && !loading) {
      fetchBlogPosts(page);
    }
  }, [hasMore, loadingMore, loading, page]);

  useEffect(() => {
    if (!observerSupported) return;
    const node = sentinelRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(handleIntersect, {
      root: null,
      rootMargin: '200px',
      threshold: 0.1,
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [handleIntersect]);

  // Abort any in-flight fetch on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

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
            <>
              {/* Controls skeleton */}
              <Box mb={4} display="flex" flexWrap="wrap" gap={2} alignItems="center">
                <Skeleton variant="rectangular" width="40%" height={40} />
                <Skeleton variant="rectangular" width={150} height={40} />
                <Skeleton variant="rectangular" width={150} height={40} />
                <Skeleton variant="circular" width={40} height={40} />
              </Box>
              {/* Grid skeleton for posts */}
              <Grid container spacing={3}>
                {Array.from({ length: 6 }).map((_, idx) => (
                  <Grid item xs={12} sm={6} md={4} key={idx}>
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <Skeleton variant="rectangular" height={200} />
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Skeleton variant="text" width="30%" />
                        <Skeleton variant="text" width="80%" />
                        <Skeleton variant="text" width="60%" />
                        <Box display="flex" alignItems="center" gap={1} mt={2}>
                          <Skeleton variant="circular" width={20} height={20} />
                          <Skeleton variant="text" width="20%" />
                          <Box sx={{ flexGrow: 1 }} />
                          <Skeleton variant="text" width="20%" />
                        </Box>
                      </CardContent>
                      <CardActions sx={{ p: 2 }}>
                        <Skeleton variant="rectangular" width={100} height={36} />
                        <Box sx={{ flexGrow: 1 }} />
                        <Skeleton variant="circular" width={36} height={36} />
                        <Skeleton variant="circular" width={36} height={36} />
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </>
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
                {isSearching && (
                  <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                    Searching...
                  </Typography>
                )}
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
                    <MotionCard
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35 }}
                      whileHover={{ y: -4 }}
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'transform 0.2s',
                      }}
                      component={RouterLink}
                      to={`/blog/${post._id}`}
                    >
                      <ImageWithPlaceholder src={getImageUrl(post.image)} alt={post.title} />
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
                    </MotionCard>
                  </Grid>
                ))}
              </Grid>
              {/* Infinite scroll sentinel */}
              <div ref={sentinelRef} />
              {loadingMore && (
                <Box display="flex" justifyContent="center" my={4}>
                  <CircularProgress size={24} />
                </Box>
              )}
              {!observerSupported && hasMore && (
                <Box display="flex" justifyContent="center" my={4}>
                  <Button variant="contained" onClick={() => fetchBlogPosts(page)} disabled={loadingMore}>
                    {loadingMore ? <CircularProgress size={20} color="inherit" /> : 'Load more'}
                  </Button>
                </Box>
              )}
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
