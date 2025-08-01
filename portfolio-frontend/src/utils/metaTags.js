export const updateMetaTags = (title, description, image, canonicalUrl) => {

  document.title = title;

  // Helper to get or create a meta tag
  const getOrCreateMeta = (selector, attrs = {}) => {
    let tag = document.querySelector(selector);
    if (!tag) {
      tag = document.createElement('meta');
      Object.entries(attrs).forEach(([k, v]) => tag.setAttribute(k, v));
      document.head.appendChild(tag);
    }
    return tag;
  };

  // Description
  const descMeta = getOrCreateMeta('meta[name="description"]', { name: 'description' });
  if (descMeta) descMeta.setAttribute('content', description);

  // Open Graph
  const ogTitle = getOrCreateMeta('meta[property="og:title"]', { property: 'og:title' });
  if (ogTitle) ogTitle.setAttribute('content', title);
  const ogDesc = getOrCreateMeta('meta[property="og:description"]', { property: 'og:description' });
  if (ogDesc) ogDesc.setAttribute('content', description);
  const ogImg = getOrCreateMeta('meta[property="og:image"]', { property: 'og:image' });
  if (ogImg) ogImg.setAttribute('content', image);
  if (canonicalUrl) {
    const ogUrl = getOrCreateMeta('meta[property="og:url"]', { property: 'og:url' });
    if (ogUrl) ogUrl.setAttribute('content', canonicalUrl);
  }

  // Twitter
  const twTitle = getOrCreateMeta('meta[property="twitter:title"]', { property: 'twitter:title' });
  if (twTitle) twTitle.setAttribute('content', title);
  const twDesc = getOrCreateMeta('meta[property="twitter:description"]', { property: 'twitter:description' });
  if (twDesc) twDesc.setAttribute('content', description);
  const twImg = getOrCreateMeta('meta[property="twitter:image"]', { property: 'twitter:image' });
  if (twImg) twImg.setAttribute('content', image);
  if (canonicalUrl) {
    const twUrl = getOrCreateMeta('meta[property="twitter:url"]', { property: 'twitter:url' });
    if (twUrl) twUrl.setAttribute('content', canonicalUrl);
  }


  const articleMetaTags = [
    { property: 'article:published_time', content: new Date().toISOString() },
    { property: 'article:author', content: 'ADELA' },
    { property: 'article:section', content: 'Technology' }
  ];


  articleMetaTags.forEach(({ property, content }) => {
    let metaTag = document.querySelector(`meta[property="${property}"]`);
    if (!metaTag) {
      metaTag = document.createElement('meta');
      metaTag.setAttribute('property', property);
      document.head.appendChild(metaTag);
    }
    metaTag.setAttribute('content', content);
  });
};

export const resetMetaTags = () => {
  const defaultTitle = "ADELA's Portfolio - Full Stack Developer";
  const defaultDesc = "Professional portfolio showcasing Adela's skills in web development projects, blog posts, and expertise in frontend and backend development. Explore my work in React, Node.js, and modern web technologies.";
  const defaultImage = "https://adelaportfolio.vercel.app/assets/hero-982354f0.jpg";
  const defaultUrl = "https://adelaportfolio.vercel.app";


  ['article:published_time', 'article:author', 'article:section'].forEach(property => {
    const metaTag = document.querySelector(`meta[property="${property}"]`);
    if (metaTag) {
      metaTag.remove();
    }
  });


  const schema = document.querySelector('#blog-post-schema');
  if (schema) {
    schema.remove();
  }


  const canonical = document.querySelector("link[rel='canonical']");
  if (canonical) {
    canonical.remove();
  }


  updateMetaTags(defaultTitle, defaultDesc, defaultImage, defaultUrl);
};
