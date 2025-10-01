import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Rating,
  IconButton,
  Stack,
  Card,
  CardContent,
  Snackbar,
  Alert,
  CircularProgress,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
} from '@mui/material';
import {
  CheckCircle as ApproveIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import SectionHeading from '../components/SectionHeading';
import BlogEditor from '../components/BlogEditor';
import { useAuth } from '../context/AuthContext';

function Admin() {
  const { isAuthenticated, login, logout, token } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [testimonials, setTestimonials] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [isUpdatingPost, setIsUpdatingPost] = useState(false);
  const [isDeletingPost, setIsDeletingPost] = useState(null);
  const [isApprovingTestimonial, setIsApprovingTestimonial] = useState(null);
  const [isDeletingTestimonial, setIsDeletingTestimonial] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [postFormData, setPostFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    tags: [],
    author: '',
    readTime: '',
    image: null
  });

  // Compute approximate read time from HTML content (words / 200 wpm)
  const computeReadTime = (html) => {
    if (!html) return '1 min read';
    // strip tags
    const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const words = text ? text.split(' ').length : 0;
    const minutes = Math.max(1, Math.round(words / 200));
    return `${minutes} min read`;
  };

  // Compute word count from HTML content
  const computeWordCount = (html) => {
    if (!html) return 0;
    const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    if (!text) return 0;
    return text.split(' ').length;
  };
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    if (isAuthenticated()) {
      fetchTestimonials();
      fetchContacts();
      fetchBlogPosts(1, false); // Start fresh from page 1
      setCurrentPage(1); // Reset page counter
      setHasMore(true); // Reset hasMore flag
    }
  }, [isAuthenticated()]);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);      const response = await fetch('https://portfolio-backend-ckqx.onrender.com/api/admin/testimonials', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) throw new Error('Failed to fetch testimonials');
      
      const data = await response.json();
      setTestimonials(data);
    } catch (error) {
      console.error('Error:', error);
      setSnackbar({
        open: true,
        message: 'Failed to load testimonials',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchContacts = async () => {
    try {      const response = await fetch('https://portfolio-backend-ckqx.onrender.com/api/admin/contacts', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) throw new Error('Failed to fetch contacts');
      
      const data = await response.json();
      setContacts(data);
    } catch (error) {
      console.error('Error:', error);
      setSnackbar({
        open: true,
        message: 'Failed to load contact messages',
        severity: 'error',
      });
    }
  };


  const fetchBlogPosts = async (page = 1, append = false) => {
    try {
      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const response = await fetch(`https://portfolio-backend-ckqx.onrender.com/api/blog?page=${page}&limit=6`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) throw new Error('Failed to fetch blog posts');
      
      const data = await response.json();
      
      if (data && Array.isArray(data.posts)) {
        if (append) {
          setBlogPosts(prev => [...prev, ...data.posts]);
        } else {
          setBlogPosts(data.posts);
        }
        // Update pagination state
        setHasMore(data.posts.length > 0 && data.page * data.limit < data.total);
        setCurrentPage(data.page);
      } else {
        // unexpected shape — fall back to empty array and warn in dev
        if (process.env.NODE_ENV !== 'production') {
          console.warn('fetchBlogPosts: unexpected response shape', data);
        }
        if (!append) {
          setBlogPosts([]);
        }
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error:', error);
      setSnackbar({
        open: true,
        message: 'Failed to load blog posts',
        severity: 'error',
      });
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };  const handleCreatePost = async () => {
    try {
      setIsCreatingPost(true);
  // Ensure readTime is computed from content before validation
  const computedReadTime = computeReadTime(postFormData.content);
  postFormData.readTime = computedReadTime;
  const requiredFields = ['title', 'excerpt', 'content', 'category', 'author'];
  const missingFields = requiredFields.filter(field => !postFormData[field]);
      
      if (missingFields.length > 0) {
        setSnackbar({
          open: true,
          message: `Please fill in all required fields: ${missingFields.join(', ')}`,
          severity: 'error',
        });
        return;
      }

      if (!postFormData.image) {
        setSnackbar({
          open: true,
          message: 'Please select an image for the blog post',
          severity: 'error',
        });
        return;
      }

      const formData = new FormData();

     
      console.log('Form data before sending:', {
        ...postFormData,
        image: postFormData.image ? postFormData.image.name : null
      });      
      Object.keys(postFormData).forEach(key => {
        if (key === 'image') return; 
        const value = postFormData[key];
        if (value === null || value === undefined) return;
        
        if (key === 'tags' && Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      });
      
      
      if (postFormData.image instanceof File) {
        formData.append('image', postFormData.image);
      }

      
      for (let [key, value] of formData.entries()) {
        console.log(key, value instanceof File ? `File: ${value.name}` : value);
      }      console.log('Sending request to create blog post...');
      try {
        const response = await fetch('https://portfolio-backend-ckqx.onrender.com/api/blog', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        const contentType = response.headers.get('content-type');
        let responseData;
        if (contentType && contentType.includes('application/json')) {
          responseData = await response.json();
        } else {
          const text = await response.text();
          responseData = { message: text };
        }
        console.log('Server response:', responseData);

        if (!response.ok) {
          throw new Error(responseData.message || 'Failed to create blog post');
        }
      } catch (error) {
        console.error('Request error:', error);
        throw error;
      }

      await fetchBlogPosts();
      setDialogOpen(false);
      setSnackbar({
        open: true,
        message: 'Blog post created successfully',
        severity: 'success',
      });
      resetPostForm();
    } catch (error) {
      console.error('Error:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Failed to create blog post',
        severity: 'error',
      });
    } finally {
      setIsCreatingPost(false);
    }
  };  const handleUpdatePost = async () => {
    try {
      setIsUpdatingPost(true);
  // Ensure readTime is up to date for updates too
  const computedReadTime2 = computeReadTime(postFormData.content);
  postFormData.readTime = computedReadTime2;
  const requiredFields = ['title', 'excerpt', 'content', 'category', 'author'];
  const missingFields = requiredFields.filter(field => !postFormData[field]);
      
      if (missingFields.length > 0) {
        setSnackbar({
          open: true,
          message: `Please fill in all required fields: ${missingFields.join(', ')}`,
          severity: 'error',
        });
        return;
      }

      const formData = new FormData();
      
     
      if (postFormData.image instanceof File) {
        formData.append('image', postFormData.image);
      }

      
      Object.keys(postFormData).forEach(key => {
        if (key === 'image') return;
        
        const value = postFormData[key];
        if (value === null || value === undefined) return;
        
        if (key === 'tags') {
         
          const tagsArray = Array.isArray(value) ? value : [];
          formData.append(key, JSON.stringify(tagsArray));
        } else {
         
          formData.append(key, String(value));
        }
      });

     
      console.log('Updating blog post with data:');
      for (let [key, value] of formData.entries()) {
        console.log(key, value instanceof File ? `File: ${value.name}` : value);
      }

      const response = await fetch(`https://portfolio-backend-ckqx.onrender.com/api/blog/${selectedPost._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      });

      const responseData = await response.json();
      console.log('Server response:', responseData);

      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to update blog post');
      }

      await fetchBlogPosts();
      setDialogOpen(false);
      setSnackbar({
        open: true,
        message: 'Blog post updated successfully',
        severity: 'success',
      });
      resetPostForm();
    } catch (error) {
      console.error('Error:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Failed to update blog post',
        severity: 'error',
      });
    } finally {
      setIsUpdatingPost(false);
    }
  };

  const handleDeletePost = async (id) => {
    try {
      setIsDeletingPost(id);
      const response = await fetch(`https://portfolio-backend-ckqx.onrender.com/api/blog/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to delete blog post');

      await fetchBlogPosts();
      setSnackbar({
        open: true,
        message: 'Blog post deleted successfully',
        severity: 'success',
      });
    } catch (error) {
      console.error('Error:', error);
      setSnackbar({
        open: true,
        message: 'Failed to delete blog post',
        severity: 'error',
      });
    } finally {
      setIsDeletingPost(null);
    }
  };

  const handleEditPost = (post) => {
    setSelectedPost(post);
    // Normalize tags: backend may return tags as JSON string, comma string, or array
    const normalizedTags = (() => {
      if (Array.isArray(post.tags)) return post.tags;
      if (!post.tags) return [];
      if (typeof post.tags === 'string') {
        // try JSON.parse first (e.g. "[\"tag1\",\"tag2\"]")
        try {
          const parsed = JSON.parse(post.tags);
          if (Array.isArray(parsed)) return parsed;
        } catch (e) {
          // ignore parse error and fall back to comma split
        }
        return post.tags.split(',').map(t => t.trim()).filter(t => t.length > 0);
      }
      return [];
    })();

    setPostFormData({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      tags: normalizedTags,
      author: post.author,
      readTime: post.readTime,
      image: null
    });
    setDialogOpen(true);
  };

  const handleNewPost = () => {
    setSelectedPost(null);
    resetPostForm();
    setDialogOpen(true);
  };

  const resetPostForm = () => {
    setPostFormData({
      title: '',
      excerpt: '',
      content: '',
      category: '',
      tags: [],
      author: '',
      readTime: '',
      image: null
    });
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    resetPostForm();
    setSelectedPost(null);
  };

  const handleFileChange = (event) => {
    setPostFormData({
      ...postFormData,
      image: event.target.files[0]
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const success = await login(username, password);
    if (!success) {
      setSnackbar({
        open: true,
        message: 'Invalid credentials',
        severity: 'error',
      });
    }
  };

  const handleApprove = async (id) => {
    try {
      setIsApprovingTestimonial(id);
      const response = await fetch(`https://portfolio-backend-ckqx.onrender.com/api/admin/testimonials/${id}/approve`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to approve testimonial');

      setSnackbar({
        open: true,
        message: 'Testimonial approved successfully',
        severity: 'success',
      });
      fetchTestimonials();
    } catch (error) {
      console.error('Error:', error);
      setSnackbar({
        open: true,
        message: 'Failed to approve testimonial',
        severity: 'error',
      });
    } finally {
      setIsApprovingTestimonial(null);
    }
  };

  const handleDelete = async (id) => {
    try {
      setIsDeletingTestimonial(id);
      const response = await fetch(`https://portfolio-backend-ckqx.onrender.com/api/admin/testimonials/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to delete testimonial');

      setSnackbar({
        open: true,
        message: 'Testimonial deleted successfully',
        severity: 'success',
      });
      fetchTestimonials();
    } catch (error) {
      console.error('Error:', error);
      setSnackbar({
        open: true,
        message: 'Failed to delete testimonial',
        severity: 'error',
      });
    } finally {
      setIsDeletingTestimonial(null);
    }
  };

  if (!isAuthenticated()) {
    return (
      <Container maxWidth="xs">
        <Box my={4}>
          <SectionHeading title="Admin Login" />
          <form onSubmit={handleLogin}>
            <Stack spacing={3}>
              <TextField
                label="Username"
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <TextField
                label="Password"
                type="password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
              >
                Login
              </Button>
            </Stack>
          </form>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <SectionHeading title="Admin Dashboard" subtitle="Manage Testimonials & Messages" />          <Button
            variant="outlined"
            color="primary"
            onClick={() => {
              logout();
              setSnackbar({
                open: true,
                message: 'Logged out successfully',
                severity: 'success',
              });
            }}
          >
            Logout
          </Button>
        </Box>
        
        {loading ? (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            
            <Box mb={6}>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography variant="h6">Blog Posts</Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleNewPost}
                >
                  New Post
                </Button>
              </Box>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Title</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Author</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(Array.isArray(blogPosts) ? blogPosts : []).map((post) => (
                      <TableRow key={post._id}>
                        <TableCell>{post.title}</TableCell>
                        <TableCell>{post.category}</TableCell>
                        <TableCell>{post.author}</TableCell>
                        <TableCell>
                          {new Date(post.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>                          <Stack direction="row" spacing={1}>
                            <IconButton
                              color="primary"
                              onClick={() => handleEditPost(post)}
                              disabled={isDeletingPost === post._id}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              color="error"
                              onClick={() => handleDeletePost(post._id)}
                              disabled={isDeletingPost === post._id}
                            >
                              {isDeletingPost === post._id ? (
                                <CircularProgress size={24} color="inherit" />
                              ) : (
                                <DeleteIcon />
                              )}
                            </IconButton>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              {hasMore && (
                <Box display="flex" justifyContent="center" mt={2}>
                  <Button
                    variant="outlined"
                    onClick={() => fetchBlogPosts(currentPage + 1, true)}
                    disabled={loadingMore}
                    startIcon={loadingMore ? <CircularProgress size={20} /> : null}
                  >
                    {loadingMore ? 'Loading...' : 'Load More'}
                  </Button>
                </Box>
              )}
            </Box>


            <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 2 }}>
              Testimonials
            </Typography>
            <TableContainer component={Paper} sx={{ mb: 6 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Position</TableCell>
                    <TableCell>Rating</TableCell>
                    <TableCell>Testimonial</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(Array.isArray(testimonials) ? testimonials : []).map((testimonial) => (
                    <TableRow key={testimonial._id}>
                      <TableCell>{testimonial.name}</TableCell>
                      <TableCell>{testimonial.position}</TableCell>
                      <TableCell>
                        <Rating value={testimonial.rating} readOnly />
                      </TableCell>
                      <TableCell>{testimonial.testimonial}</TableCell>
                      <TableCell>
                        {testimonial.approved ? 'Approved' : 'Pending'}
                      </TableCell>
                      <TableCell>                        <Stack direction="row" spacing={1}>
                          {!testimonial.approved && (
                            <IconButton
                              color="primary"
                              onClick={() => handleApprove(testimonial._id)}
                              disabled={isApprovingTestimonial === testimonial._id || isDeletingTestimonial === testimonial._id}
                            >
                              {isApprovingTestimonial === testimonial._id ? (
                                <CircularProgress size={24} color="inherit" />
                              ) : (
                                <ApproveIcon />
                              )}
                            </IconButton>
                          )}
                          <IconButton
                            color="error"
                            onClick={() => handleDelete(testimonial._id)}
                            disabled={isApprovingTestimonial === testimonial._id || isDeletingTestimonial === testimonial._id}
                          >
                            {isDeletingTestimonial === testimonial._id ? (
                              <CircularProgress size={24} color="inherit" />
                            ) : (
                              <DeleteIcon />
                            )}
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Typography variant="h6" gutterBottom sx={{ mt: 6, mb: 2 }}>
              Contact Messages
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Subject</TableCell>
                    <TableCell>Message</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(Array.isArray(contacts) ? contacts : []).map((contact) => (
                    <TableRow key={contact._id}>
                      <TableCell>{new Date(contact.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>{contact.name}</TableCell>
                      <TableCell>{contact.email}</TableCell>
                      <TableCell>{contact.subject}</TableCell>
                      <TableCell>{contact.message}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </Box>

      
      <Dialog 
        open={dialogOpen} 
        onClose={handleDialogClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedPost ? 'Edit Blog Post' : 'New Blog Post'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField
              label="Title"
              fullWidth
              value={postFormData.title}
              onChange={(e) => setPostFormData({ ...postFormData, title: e.target.value })}
            />
            <TextField
              label="Excerpt"
              fullWidth
              multiline
              rows={2}
              value={postFormData.excerpt}
              onChange={(e) => setPostFormData({ ...postFormData, excerpt: e.target.value })}
            />
            {/* Rich text editor for content */}
            <div>
              {/* eslint-disable-next-line react/jsx-no-undef */}
              <BlogEditor
                initialData={postFormData.content || ''}
                onChange={(html) => {
                  const readTime = computeReadTime(html);
                  const wordCount = computeWordCount(html);
                  setPostFormData({ ...postFormData, content: html, readTime, wordCount });
                  console.log('Edited HTML:', html);
                }}
              />
              <Box sx={{ mt: 1, mb: 1, display: 'flex', gap: 2, alignItems: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                  Estimated read time: {postFormData.readTime || computeReadTime(postFormData.content)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Word count: {postFormData.wordCount ?? computeWordCount(postFormData.content)}
                </Typography>
              </Box>
            </div>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={postFormData.category}
                onChange={(e) => setPostFormData({ ...postFormData, category: e.target.value })}
                label="Category"
              >
                <MenuItem value="Development">Development</MenuItem>
                <MenuItem value="Design">Design</MenuItem>
                <MenuItem value="Technology">Technology</MenuItem>
                <MenuItem value="Career">Career</MenuItem>
              </Select>
            </FormControl>            <Autocomplete
              multiple
              options={[]}
              freeSolo
              value={postFormData.tags}
              onChange={(event, newValue) => {
                setPostFormData({
                  ...postFormData,
                  tags: Array.isArray(newValue) ? newValue.map(tag => tag.trim()).filter(tag => tag.length > 0) : []
                });
              }}
              renderTags={(value, getTagProps) =>
                (Array.isArray(value) ? value : []).map((option, index) => {
                  const { key, ...chipProps } = getTagProps({ index });
                  return <Chip key={key} {...chipProps} label={option} />;
                })
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Tags"
                  helperText="Press enter after each tag"
                  placeholder={postFormData.tags.length === 0 ? "Enter tags" : ""}
                />
              )}
            />
            <TextField
              label="Author"
              fullWidth
              value={postFormData.author}
              onChange={(e) => setPostFormData({ ...postFormData, author: e.target.value })}
            />
            {/* readTime is computed automatically from content */}
            <Box>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="blog-image-upload"
                type="file"
                onChange={handleFileChange}
              />
              <label htmlFor="blog-image-upload">
                <Button variant="outlined" component="span">
                  Upload Image
                </Button>
              </label>
              {postFormData.image && (
                <Typography variant="caption" sx={{ ml: 2 }}>
                  Selected: {postFormData.image.name}
                </Typography>
              )}
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>          <Button
            onClick={selectedPost ? handleUpdatePost : handleCreatePost}
            variant="contained"
            disabled={isCreatingPost || isUpdatingPost}
          >
            {isCreatingPost || isUpdatingPost ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              selectedPost ? 'Update' : 'Create'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default Admin;
