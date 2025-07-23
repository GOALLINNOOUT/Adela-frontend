export const updateMetaTags = (title, description, image, canonicalUrl) => {

  document.title = title;
  

  document.querySelector('meta[name="description"]').setAttribute('content', description);

 
  document.querySelector('meta[property="og:title"]').setAttribute('content', title);
  document.querySelector('meta[property="og:description"]').setAttribute('content', description);
  document.querySelector('meta[property="og:image"]').setAttribute('content', image);
  if (canonicalUrl) {
    document.querySelector('meta[property="og:url"]').setAttribute('content', canonicalUrl);
  }


  document.querySelector('meta[property="twitter:title"]').setAttribute('content', title);
  document.querySelector('meta[property="twitter:description"]').setAttribute('content', description);
  document.querySelector('meta[property="twitter:image"]').setAttribute('content', image);
  if (canonicalUrl) {
    document.querySelector('meta[property="twitter:url"]').setAttribute('content', canonicalUrl);
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
  const defaultImage = "https://portfolio-frontend-wheat-ten.vercel.app/assets/hero-982354f0.jpg";
  const defaultUrl = "https://portfolio-frontend-wheat-ten.vercel.app";


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
