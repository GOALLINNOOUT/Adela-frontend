import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useThemeContext } from '../context/ThemeContext';
import { translateText, translateObject } from '../utils/translate';
import {
  Box,
  Container,
  Typography,
  Chip,
  Button,
  Divider,
  Avatar,
  IconButton,
  Snackbar,
  CircularProgress,
  Fab,
  useTheme,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  LinearProgress,
  Stack,
} from '@mui/material';
import DOMPurify from 'dompurify';
import linkifyHtml from 'linkify-html';
import { 
  ArrowBack, 
  AccessTime, 
  Share, 
  ThumbUp, 
  Favorite, 
  EmojiEmotions, 
  SentimentVeryDissatisfied, 
  Translate, 
  Bookmark, 
  BookmarkBorder,
  Visibility 
} from '@mui/icons-material';
import { getImageUrl, handleImageError } from '../utils/imageHelper';
import { Helmet } from 'react-helmet-async';
import { updateMetaTags, resetMetaTags } from '../utils/metaTags';
import Comments from '../components/Comments';

function BlogPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [translatedPost, setTranslatedPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [translating, setTranslating] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [currentUserReaction, setCurrentUserReaction] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [readProgress, setReadProgress] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [reactions, setReactions] = useState({
    like: [],
    love: [],
    wow: [],
    sad: []
  });
  const [submittingReaction, setSubmittingReaction] = useState(false);
  const [currentUserReactions, setCurrentUserReactions] = useState({
    like: false,
    love: false,
    wow: false,
    sad: false
  });
  const theme = useTheme();
  const { toggleColorMode, mode, isBlogPage } = useThemeContext();
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'yo', name: 'Yoruba' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ru', name: 'Russian' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'zh', name: 'Chinese' },
  ];

  const blogContentRef = useRef(null);
  // track anchors we've already inserted previews for to avoid duplicates
  const processedAnchorsRef = useRef(new WeakSet());

  // derived display object: prefer translated content when available
  const displayPost = translatedPost || post;

  const saveReadingProgress = (progress, scrollPosition) => {
    const readingProgress = JSON.parse(localStorage.getItem('readingProgress') || '{}');
    readingProgress[id] = {
      progress,
      scrollPosition,
      timestamp: Date.now()
    };
    localStorage.setItem('readingProgress', JSON.stringify(readingProgress));
  };

  const loadReadingProgress = () => {
    const readingProgress = JSON.parse(localStorage.getItem('readingProgress') || '{}');
    return readingProgress[id] || null;
  };

 
  useEffect(() => {
    if (id && blogContentRef.current) {
      const savedProgress = loadReadingProgress();
      if (savedProgress) {
        setReadProgress(savedProgress.progress);
       
        const timer = setTimeout(() => {
          window.scrollTo({
            top: savedProgress.scrollPosition,
            behavior: 'smooth'
          });
        }, 500); 
        return () => clearTimeout(timer);
      }
    }
  }, [id, post]); 

  useEffect(() => {
    if (id) {
      fetchPost();
      
      const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
      setIsBookmarked(bookmarks.includes(id));
    }
   
    return () => {
      resetMetaTags();
    };
  }, [id]);

  useEffect(() => {
    if (post) {
  const fullImageUrl = getImageUrl(post.image);
      const canonicalUrl = `${window.location.origin}/blog/${id}`;
      
      
      updateMetaTags(
        `${post.title} - ADELA's Blog`,
        post.excerpt,
        fullImageUrl,
        canonicalUrl
      );

     
      const safeTags = Array.isArray(post.tags) ? post.tags : (post.tags ? String(post.tags).split(',').map(t => t.trim()) : []);
      const wordCount = post.content ? post.content.split(/\s+/).filter(Boolean).length : 0;
      const schema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        // mainEntityOfPage can be a simple URL string
        "mainEntityOfPage": canonicalUrl,
        "headline": post.title,
        "description": post.excerpt,
        "image": {
          "@type": "ImageObject",
          "url": fullImageUrl
        },
        "author": {
          "@type": "Person",
          "name": post.author
        },
        "datePublished": post.createdAt ? new Date(post.createdAt).toISOString() : undefined,
        "dateModified": (post.updatedAt || post.createdAt) ? new Date(post.updatedAt || post.createdAt).toISOString() : undefined,
        "publisher": {
          "@type": "Organization",
          "name": "ADELA's Blog",
          "logo": {
            "@type": "ImageObject",
            "url": `${window.location.origin}/apple-touch-icon.png`
          }
        },
        "url": canonicalUrl,
        "articleSection": post.category || undefined,
        "keywords": safeTags.length ? safeTags.join(',') : undefined,
        "wordCount": wordCount,
        "articleBody": post.content,
        "isAccessibleForFree": "True",
        "interactionStatistic": {
          "@type": "InteractionCounter",
          "interactionType": { "@type": "ViewAction" },
          "userInteractionCount": post.views || 0
        }
      };

      
      let script = document.querySelector('#blog-post-schema');
      if (!script) {
        script = document.createElement('script');
        script.id = 'blog-post-schema';
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(schema);

      
      let canonical = document.querySelector("link[rel='canonical']");
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.rel = 'canonical';
        document.head.appendChild(canonical);
      }
      canonical.href = canonicalUrl;

      // BreadcrumbList structured data
      const breadcrumb = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": window.location.origin
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Blog",
            "item": `${window.location.origin}/blog`
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": post.title,
            "item": canonicalUrl
          }
        ]
      };

      let crumbScript = document.querySelector('#blog-post-breadcrumbs');
      if (!crumbScript) {
        crumbScript = document.createElement('script');
        crumbScript.id = 'blog-post-breadcrumbs';
        crumbScript.type = 'application/ld+json';
        document.head.appendChild(crumbScript);
      }
      crumbScript.textContent = JSON.stringify(breadcrumb);
    }
  }, [post, id]);

  
  useEffect(() => {
    return () => {
      const script = document.querySelector('#blog-post-schema');
      if (script) script.remove();
      const canonical = document.querySelector("link[rel='canonical']");
      if (canonical) canonical.remove();
    };
  }, [blogContentRef, displayPost?.content]);

 
  useEffect(() => {    const handleScroll = () => {
      if (blogContentRef.current) {
        const { top, height } = blogContentRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const contentAbove = -top;
        const scrollableContent = height - windowHeight;
        const progress = (contentAbove / scrollableContent) * 100;
        const currentProgress = Math.min(Math.max(0, progress), 100);
        
        setReadProgress(currentProgress);
        
       
        saveReadingProgress(currentProgress, window.scrollY);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Find external links inside the article and fetch preview metadata for each.
  useEffect(() => {
    if (!blogContentRef.current) return;

    const anchors = Array.from(blogContentRef.current.querySelectorAll('a'));

    anchors.forEach((a) => {
      try {
        // skip if already processed (prevents duplicates on re-renders)
        if (a.dataset.previewInserted === 'true' || processedAnchorsRef.current.has(a)) return;

        const href = a.href;
        if (!href || !href.startsWith('http')) return;

        // if a preview placeholder already exists right after this anchor, mark and skip
        if (a.nextElementSibling && a.nextElementSibling.classList && a.nextElementSibling.classList.contains('link-preview-placeholder')) {
          a.dataset.previewInserted = 'true';
          processedAnchorsRef.current.add(a);
          return;
        }

        // mark early to avoid race conditions
        a.dataset.previewInserted = 'true';
        processedAnchorsRef.current.add(a);

        // create a placeholder node after the link
        const placeholder = document.createElement('div');
        placeholder.className = 'link-preview-placeholder';
        placeholder.style.margin = '8px 0 16px';
        a.insertAdjacentElement('afterend', placeholder);

        // fetch preview metadata from backend
        const apiUrl = `${import.meta.env.VITE_API_URL || ''}/api/preview?url=${encodeURIComponent(href)}`;
        fetch(apiUrl)
          .then(res => res.json())
          .then(data => {
            if (!data || data.error) {
              placeholder.textContent = '';
              return;
            }

            // build a simple card
            const card = document.createElement('a');
            card.href = data.url;
            card.target = '_blank';
            card.rel = 'noopener noreferrer';
            card.style.display = 'flex';
            card.style.gap = '12px';
            card.style.alignItems = 'center';
            card.style.textDecoration = 'none';
            card.style.border = '1px solid rgba(0,0,0,0.08)';
            card.style.padding = '8px';
            card.style.borderRadius = '8px';
            card.style.background = 'var(--link-preview-bg, #fff)';

            const img = document.createElement('img');
            img.src = data.image || '';
            img.alt = data.title || data.domain;
            img.style.width = '120px';
            img.style.height = '70px';
            img.style.objectFit = 'cover';
            img.style.borderRadius = '6px';
            img.style.flex = '0 0 120px';
            if (!data.image) img.style.display = 'none';

            const meta = document.createElement('div');
            meta.style.display = 'flex';
            meta.style.flexDirection = 'column';
            meta.style.justifyContent = 'center';
            meta.style.color = 'inherit';

            const title = document.createElement('div');
            title.textContent = data.title || data.domain;
            title.style.fontWeight = 600;
            title.style.color = 'var(--link-preview-title, #000)';

            const desc = document.createElement('div');
            desc.textContent = data.description || '';
            desc.style.fontSize = '0.9rem';
            desc.style.color = 'var(--link-preview-desc, #444)';
            desc.style.marginTop = '4px';
            desc.style.overflow = 'hidden';
            desc.style.textOverflow = 'ellipsis';
            desc.style.display = '-webkit-box';
            desc.style.webkitLineClamp = '2';
            desc.style.webkitBoxOrient = 'vertical';

            const domain = document.createElement('div');
            domain.textContent = data.domain || new URL(data.url).hostname;
            domain.style.fontSize = '0.8rem';
            domain.style.color = 'var(--link-preview-domain, #777)';
            domain.style.marginTop = '6px';

            meta.appendChild(title);
            if (data.description) meta.appendChild(desc);
            meta.appendChild(domain);

            card.appendChild(img);
            card.appendChild(meta);

            placeholder.appendChild(card);
          })
          .catch(err => {
            placeholder.textContent = '';
            // ignore preview errors
          });
      } catch (e) {
        // ignore
      }
    });
  }, [displayPost, blogContentRef.current]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      console.log('Attempting to fetch blog post with ID:', id);

      // Check localStorage for previously viewed posts. We use this to ensure
      // the backend only increments the view count once per device/browser.
      const viewedRaw = localStorage.getItem('viewedPosts') || '[]';
      let viewed = [];
      try {
        viewed = JSON.parse(viewedRaw);
      } catch (e) {
        viewed = [];
      }

      const isNewView = !viewed.includes(id);

      const fetchUrl = `https://portfolio-backend-ckqx.onrender.com/api/blog/${id}${isNewView ? '?incrementView=true' : ''}`;

      const response = await fetch(fetchUrl);
      console.log('Response status:', response.status);

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Received non-JSON response from server');
      }

      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch blog post');
      }

      if (!data) {
        throw new Error('Blog post not found');
      }      const userId = getUserId();
      if (data.reactions) {
        const userReaction = Object.entries(data.reactions).find(([type, users]) => 
          users.includes(userId)
        )?.[0] || null;
        setCurrentUserReaction(userReaction);
      }
      setPost(data);

      // If this was a new view, persist the viewed id so we don't count it again
      if (isNewView) {
        try {
          viewed.push(id);
          localStorage.setItem('viewedPosts', JSON.stringify(viewed));

          // Also set a simple cookie for clients that prefer cookies. Keep it
          // short-lived (1 year) and small. We store as a JSON string.
          const expiry = new Date();
          expiry.setFullYear(expiry.getFullYear() + 1);
          document.cookie = `viewedPosts=${encodeURIComponent(JSON.stringify(viewed))}; expires=${expiry.toUTCString()}; path=/`;
        } catch (e) {
          console.warn('Failed to persist viewedPosts:', e);
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setSnackbarMessage('Failed to load blog post');
      setSnackbarOpen(true);
      navigate('/blog');
    } finally {
      setLoading(false);
    }
  };
  const handleShare = async () => {
    if (!post) return;

    const contentToShare = selectedLanguage !== 'en' && translatedPost ? translatedPost : post;
    const fullImageUrl = `${window.location.origin}${getImageUrl(post.image)}`;
    const shareData = {
      title: contentToShare.title,
      text: contentToShare.excerpt,
      url: window.location.href
    };

    try {
      if (navigator.share && navigator.canShare) {
        try {
          const response = await fetch(fullImageUrl);
          const blob = await response.blob();
          const file = new File([blob], 'blog-image.jpg', { type: blob.type });
          
          const filesArray = [file];
          const shareDataWithFiles = {
            ...shareData,
            files: filesArray
          };

          if (navigator.canShare(shareDataWithFiles)) {
            await navigator.share(shareDataWithFiles);
            setSnackbarMessage('Shared successfully with image!');
          } else {
           
            await navigator.share(shareData);
            setSnackbarMessage('Shared successfully!');
          }
        } catch (error) {
          
          await navigator.share(shareData);
          setSnackbarMessage('Shared successfully!');
        }
      } else if (navigator.share) {
        await navigator.share(shareData);
        setSnackbarMessage('Shared successfully!');
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setSnackbarMessage('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      setSnackbarMessage('Error sharing post');
    }
    setSnackbarOpen(true);
  };


  const getUserId = () => {
    let userId = localStorage.getItem('userId');
    if (!userId) {
      userId = 'user_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('userId', userId);
    }
    return userId;
  };
  const handleReaction = async (reactionType) => {
    try {
      setSubmittingReaction(true);
      
      const userId = localStorage.getItem('userId') || 
        Math.random().toString(36).substring(2) + Date.now().toString(36);
      localStorage.setItem('userId', userId);

      
      const isRemovingSameReaction = currentUserReactions[reactionType];
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/reactions/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reactionType,
          userId
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update reaction');
      }

      const data = await response.json();
      setPost(prevPost => ({
        ...prevPost,
        reactions: data.reactions
      }));
      setReactions(data.reactions);
      
      
      setCurrentUserReactions({
        like: false,
        love: false,
        wow: false,
        sad: false,
        [reactionType]: !isRemovingSameReaction
      });

      
      let message;
      if (isRemovingSameReaction) {
        message = 'Reaction removed';
      } else {
        message = 'You reacted to this post!';
      }
      setSnackbarMessage(message);
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error updating reaction:', error);
      setSnackbarMessage('Failed to update reaction');
      setSnackbarOpen(true);
    } finally {
      setSubmittingReaction(false);
    }
  };

  useEffect(() => {
    if (post?.reactions) {
      setReactions(post.reactions);
      
      const userId = localStorage.getItem('userId');
      if (userId) {
        const userReactions = {
          like: post.reactions.like.includes(userId),
          love: post.reactions.love.includes(userId),
          wow: post.reactions.wow.includes(userId),
          sad: post.reactions.sad.includes(userId)
        };
        setCurrentUserReactions(userReactions);
      }
    }
  }, [post?.reactions]);

  const handleLanguageChange = async (event) => {
    const newLang = event.target.value;
    setSelectedLanguage(newLang);
    
    if (newLang === 'en') {
      setTranslatedPost(null);
      return;
    }

    setTranslating(true);
    try {
      const translated = await translateObject(post, newLang);
      setTranslatedPost(translated);
    } catch (error) {
      console.error('Translation error:', error);
      setSnackbarMessage('Failed to translate content');
      setSnackbarOpen(true);
    } finally {
      setTranslating(false);
    }
  };

  const handleBookmark = () => {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    let newBookmarks;
    let message;

    if (isBookmarked) {
      newBookmarks = bookmarks.filter(bookmarkId => bookmarkId !== id);
      message = 'Article removed from bookmarks';
    } else {
      newBookmarks = [...bookmarks, id];
      message = 'Article bookmarked successfully';
    }

    localStorage.setItem('bookmarks', JSON.stringify(newBookmarks));
    setIsBookmarked(!isBookmarked);
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="60vh"
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!post) {
    return null;
  }
  const fullImageUrl = getImageUrl(displayPost.image);
  const canonicalUrl = `${window.location.origin}/blog/${id}`;
  return (
    <>
      <Helmet>
        <title>{displayPost.title ? `${displayPost.title} | ADELA's Blog` : "Blog Post | ADELA's Blog"}</title>
        <meta name="description" content={displayPost.excerpt || "Read this blog post on ADELA's Blog."} />
        <meta name="keywords" content={displayPost.tags ? displayPost.tags.join(',') : "blog, web development, ADELA"} />
        <meta name="author" content={displayPost.author || "ADELA"} />
        <meta property="og:title" content={displayPost.title ? `${displayPost.title} | ADELA's Blog` : "Blog Post | ADELA's Blog"} />
        <meta property="og:description" content={displayPost.excerpt || "Read this blog post on ADELA's Blog."} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content={fullImageUrl} />
        <meta property="og:url" content={canonicalUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={displayPost.title ? `${displayPost.title} | ADELA's Blog` : "Blog Post | ADELA's Blog"} />
        <meta name="twitter:description" content={displayPost.excerpt || "Read this blog post on ADELA's Blog."} />
        <meta name="twitter:image" content={fullImageUrl} />
        <link rel="canonical" href={canonicalUrl} />
      </Helmet>
      {/* ...existing code... */}
      <Box sx={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        zIndex: 1100,
        bgcolor: 'background.paper'      }}>
        <Box sx={{ width: '100%', position: 'relative' }}>
          <LinearProgress 
            variant="determinate" 
            value={readProgress} 
            sx={{ 
              height: 17,
              bgcolor: 'rgba(0, 0, 0, 0.1)',
              '& .MuiLinearProgress-bar': {
                bgcolor: 'primary.main'
              }
            }} 
          />
          <Box sx={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'text.primary',
            typography: 'body2',
            fontWeight: 'medium'
          }}>
            Reading progress: {Math.round(readProgress)}%
          </Box>
        </Box>
      </Box>

      <Container maxWidth="lg">
        <Box py={4} sx={{ bgcolor: mode === 'dark' ? 'background.default' : 'inherit', mt: 2 }}>
          <Box display="flex" alignItems="center" mb={4}>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => navigate('/blog')}
              sx={{ mr: 'auto' }}
            >
              Back to Blog
            </Button>
            
            <FormControl sx={{ minWidth: 120, mr: 2 }}>
              <Select
                value={selectedLanguage}
                onChange={handleLanguageChange}
                size="small"
                startAdornment={<Translate sx={{ mr: 1, ml: -0.5 }} />}
                disabled={!post || translating}
              >
                {languages.map((lang) => (
                  <MenuItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Tooltip title={isBookmarked ? "Remove bookmark" : "Bookmark this article"}>
              <IconButton onClick={handleBookmark} sx={{ mr: 1 }}>
                {isBookmarked ? <Bookmark color="primary" /> : <BookmarkBorder />}
              </IconButton>
            </Tooltip>

            <IconButton onClick={handleShare} title="Share this post">
              <Share />
            </IconButton>
          </Box>          {translating ? (
            <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress />
            </Box>
          ) : (
            <Box ref={blogContentRef}>
              <Box
                component="img"
                src={getImageUrl(displayPost.image)}
                alt={displayPost.title}
                onError={handleImageError}
                sx={{
                  width: '100%',
                  height: { xs: '200px', md: '400px' },
                  objectFit: 'cover',
                  borderRadius: 2,
                  mb: 4,
                  backgroundColor: 'grey.100',
                }}
              />

              <Box mb={4}>
                <Chip label={displayPost.category} color="primary" sx={{ mb: 2 }} />
                <Typography variant="h2" gutterBottom>
                  {displayPost.title}
                </Typography>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Avatar>{displayPost.author[0]}</Avatar>
                    <Typography variant="subtitle1">{displayPost.author}</Typography>
                  </Box>
                  <Divider orientation="vertical" flexItem />
                  <Box display="flex" alignItems="center" gap={1}>
                    <AccessTime fontSize="small" color="action" />
                    <Typography variant="subtitle2" color="text.secondary">
                      {displayPost.readTime}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Visibility fontSize="small" />
                    <Typography variant="subtitle2" color="text.secondary">
                      {displayPost.views || 0} views
                    </Typography>
                  </Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    {new Date(displayPost.createdAt).toLocaleDateString(selectedLanguage === 'en' ? 'en-US' : selectedLanguage, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </Typography>
                </Box>
                <Box display="flex" gap={1} flexWrap="wrap">
                  {displayPost.tags.map((tag) => (
                    <Chip key={tag} label={tag} size="small" variant="outlined" />
                  ))}
                </Box>
              </Box>

              <Typography variant="subtitle1" paragraph>
                {displayPost.excerpt}
              </Typography>
              <Box
                component="article"
                sx={{
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  mb: 4,
                  // Ensure images included in the HTML content are responsive and never exceed viewport width
                  '& img': {
                    maxWidth: '90vw',
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    objectFit: 'contain',
                  },
                  // Constrain embedded iframes or videos
                  '& iframe, & video': {
                    maxWidth: '90vw',
                    width: '100%',
                    height: 'auto'
                  }
                }}
                ref={blogContentRef}
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(linkifyHtml(displayPost.content || '', {
                  defaultProtocol: 'https',
                  target: '_blank',
                  attributes: { rel: 'noopener noreferrer' },
                  ignoreTags: ['a']
                })) }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Tooltip title={currentUserReactions.like ? "Remove Like" : "Like"}>
                    <span>
                      <IconButton 
                        onClick={() => handleReaction('like')}
                        color={currentUserReactions.like ? "primary" : "default"}
                        disabled={submittingReaction || (!currentUserReactions.like && Object.values(currentUserReactions).some(Boolean))}
                      >
                        <ThumbUp />
                        <Typography variant="caption" sx={{ ml: 0.5 }}>
                          {reactions.like?.length || 0}
                        </Typography>
                      </IconButton>
                      </span>
                    </Tooltip>

                  <Tooltip title={currentUserReactions.love ? "Remove Love" : "Love"}>
                    <span>
                      <IconButton 
                        onClick={() => handleReaction('love')}
                        color={currentUserReactions.love ? "error" : "default"}
                        disabled={submittingReaction || (!currentUserReactions.love && Object.values(currentUserReactions).some(Boolean))}
                      >
                        <Favorite />
                        <Typography variant="caption" sx={{ ml: 0.5 }}>
                          {reactions.love?.length || 0}
                        </Typography>
                      </IconButton>
                    </span>
                  </Tooltip>

                  <Tooltip title={currentUserReactions.wow ? "Remove Wow" : "Wow"}>
                    <span>
                      <IconButton 
                        onClick={() => handleReaction('wow')}
                        color={currentUserReactions.wow ? "warning" : "default"}
                        disabled={submittingReaction || (!currentUserReactions.wow && Object.values(currentUserReactions).some(Boolean))}
                      >
                        <EmojiEmotions />
                        <Typography variant="caption" sx={{ ml: 0.5 }}>
                          {reactions.wow?.length || 0}
                        </Typography>
                      </IconButton>
                    </span>
                  </Tooltip>

                  <Tooltip title={currentUserReactions.sad ? "Remove Sad" : "Sad"}>
                    <span>
                      <IconButton 
                        onClick={() => handleReaction('sad')}
                        color={currentUserReactions.sad ? "info" : "default"}
                        disabled={submittingReaction || (!currentUserReactions.sad && Object.values(currentUserReactions).some(Boolean))}
                      >
                        <SentimentVeryDissatisfied />
                        <Typography variant="caption" sx={{ ml: 0.5 }}>
                          {reactions.sad?.length || 0}
                        </Typography>
                      </IconButton>
                    </span>
                  </Tooltip>
                </Box>

                {submittingReaction && (
                  <CircularProgress size={20} sx={{ ml: 2 }} />
                )}
              </Box>

              <Comments blogPostId={id} />
            </Box>
          )}

          <Divider sx={{ my: 3 }} />
        </Box>
      </Container>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </>
  );
}

export default BlogPost;
