import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  Divider,
  Paper,
  CircularProgress,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
} from '@mui/material';
import { useThemeContext } from '../context/ThemeContext';
import { Delete, Reply, SubdirectoryArrowRight } from '@mui/icons-material';

function Comments({ blogPostId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({ author: '', content: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const theme = useTheme();
  const { mode } = useThemeContext();

  useEffect(() => {
    fetchComments();
  }, [blogPostId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://portfolio-backend-ckqx.onrender.com/api/blog/${blogPostId}/comments`
      );
      if (!response.ok) throw new Error('Failed to fetch comments');
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.author.trim() || !newComment.content.trim()) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setSubmitting(true);
      const commentData = {
        ...newComment,
        replyTo: replyingTo ? replyingTo._id : null
      };      const response = await fetch(
        `https://portfolio-backend-ckqx.onrender.com/api/blog/${blogPostId}/comments`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(commentData),
        }
      );

      if (!response.ok) throw new Error('Failed to post comment');
      
      const comment = await response.json();
      
     
      if (comment._id && comment.deleteKey) {
        const commentKeys = JSON.parse(localStorage.getItem('commentKeys') || '{}');
        commentKeys[comment._id] = comment.deleteKey;
        localStorage.setItem('commentKeys', JSON.stringify(commentKeys));
      }

      
      setNewComment({ author: '', content: '' });
      setReplyingTo(null);
      setError('');
      await fetchComments(); 
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClick = (comment) => {
    setCommentToDelete(comment);
    setDeleteDialogOpen(true);
  };  const handleDeleteConfirm = async () => {
    if (!commentToDelete) return;
    try {      const url = `https://portfolio-backend-ckqx.onrender.com/api/blog/${blogPostId}/comments/${commentToDelete._id}?deleteKey=${commentToDelete.deleteKey}`;
      console.log('Attempting to delete comment with URL:', url);
      
      const response = await fetch(url, {
        method: 'DELETE',
      });

      const data = await response.text();
      console.log('Delete response:', response.status, data);

      if (!response.ok) {
        throw new Error(`Failed to delete comment: ${response.status} ${data}`);
      }

      await fetchComments();
      setDeleteDialogOpen(false);
      setCommentToDelete(null);
    } catch (error) {
      console.error('Error deleting comment:', error);
      setError(`Failed to delete comment: ${error.message}`);
    }
  };

  const handleReply = (comment) => {
    setReplyingTo(comment);
   
    document.getElementById('comment-form').scrollIntoView({ behavior: 'smooth' });
  };

  const CommentComponent = ({ comment, depth = 0 }) => (
    <Box>          <Box 
        sx={{ 
          ml: { xs: depth * 2, sm: depth * 4 },
          pl: { xs: 2, sm: 3 },
          borderLeft: depth > 0 ? '2px solid' : 'none',
          borderColor: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'divider'
        }}
      >
        <Box display="flex" gap={2} mb={2}>
          <Avatar sx={{ width: 40, height: 40 }}>{comment.author[0]}</Avatar>
          <Box flex={1}>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  {comment.author}
                </Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(comment.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </Typography>
                  {comment.replyTo && comment.parentAuthor && (
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <SubdirectoryArrowRight sx={{ fontSize: 14, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary">
                        Replied to {comment.parentAuthor}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
              <Box display="flex" alignItems="start" gap={1}>
                <IconButton
                  size="small"
                  onClick={() => handleReply(comment)}
                  sx={{
                    '&:hover': { color: 'primary.main' },
                  }}
                >
                  <Reply fontSize="small" />
                </IconButton>
                {(() => {
                  const commentKeys = JSON.parse(localStorage.getItem('commentKeys') || '{}');
                  return commentKeys[comment._id] ? (
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteClick({ ...comment, deleteKey: commentKeys[comment._id] })}
                      sx={{
                        '&:hover': { color: 'error.main' },
                      }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  ) : null;
                })()}
              </Box>
            </Box>
            <Typography 
              variant="body1" 
              sx={{
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
                maxWidth: '100%',
                whiteSpace: 'pre-line',
                mb: 1
              }}
            >
              {comment.content}
            </Typography>
          </Box>
        </Box>
      </Box>
      
      {comment.replies && comment.replies.map((reply) => (
        <CommentComponent key={reply._id} comment={reply} depth={depth + 1} />
      ))}
    </Box>
  );

  return (
    <Box mt={6}>            <Typography 
        variant="h5" 
        gutterBottom
        color={theme => theme.palette.mode === 'dark' ? 'text.primary' : 'inherit'}
      >
        Comments
      </Typography>

       <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          mb: 4, 
          bgcolor: theme => theme.palette.mode === 'dark' ? 'background.paper' : 'grey.50',
          borderRadius: 2
        }} 
        id="comment-form">
        {replyingTo && (
          <Box mb={2} display="flex" alignItems="center" gap={1}>
            <Typography variant="body2" color="text.secondary">
              Replying to {replyingTo.author}'s comment
            </Typography>
            <Button
              size="small"
              onClick={() => setReplyingTo(null)}
              color="primary"
            >
              Cancel
            </Button>
          </Box>
        )}
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Your Name"
            value={newComment.author}
            onChange={(e) =>
              setNewComment({ ...newComment, author: e.target.value })
            }
            margin="normal"
            required
            error={error && !newComment.author.trim()}
          />
          <TextField
            fullWidth
            label="Your Comment"
            value={newComment.content}
            onChange={(e) =>
              setNewComment({ ...newComment, content: e.target.value })
            }
            margin="normal"
            required
            multiline
            rows={3}
            error={error && !newComment.content.trim()}
          />
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 2 }}
            disabled={submitting}
          >
            {submitting ? <CircularProgress size={24} /> : replyingTo ? 'Post Reply' : 'Post Comment'}
          </Button>
        </form>
      </Paper>

     
      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : comments.length > 0 ? (
        <Box>
          {comments.map((comment, index) => (
            <Box key={comment._id}>
              <CommentComponent comment={comment} />
              {index < comments.length - 1 && <Divider sx={{ my: 3 }} />}
            </Box>
          ))}
        </Box>
      ) : (
        <Typography color="text.secondary" textAlign="center">
          No comments yet. Be the first to comment!
        </Typography>
      )}

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Comment?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this comment? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Comments;
