export type NavItem = {
  href: string;
  label: string;
};

export type SocialLink = {
  label: string;
  href: string;
};

export type SeoDefaults = {
  title: string;
  description: string;
  keywords: string[];
};

export type SiteConfig = {
  name: string;
  fullName: string;
  role: string;
  intro: string;
  location: string;
  email: string;
  phone: string;
  siteUrl: string;
  navItems: NavItem[];
  socialLinks: SocialLink[];
  seo: SeoDefaults;
};

export type Project = {
  slug: string;
  title: string;
  summary: string;
  challenge: string;
  outcome: string;
  story: string[];
  stack: string[];
  image: string;
  gallery?: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured?: boolean;
};

export type SkillGroup = {
  title: string;
  description: string;
  items: string[];
};

export type BlogPostSummary = {
  _id: string;
  title: string;
  excerpt: string;
  content?: string;
  image: string;
  category: string;
  tags: string[];
  author: string;
  readTime: string;
  views: number;
  createdAt: string;
  updatedAt?: string;
};

export type BlogPostDetail = BlogPostSummary & {
  reactions?: {
    like?: string[];
    love?: string[];
    wow?: string[];
    sad?: string[];
  };
};

export type AboutAuthorProfile = {
  _id?: string;
  name: string;
  bio: string;
  updatedAt?: string;
};

export type Testimonial = {
  _id: string;
  name: string;
  position: string;
  rating: number;
  testimonial: string;
  avatar?: string;
  approved: boolean;
  createdAt: string;
};

export type ContactFormInput = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export type ContactRecord = ContactFormInput & {
  _id: string;
  createdAt: string;
};

export type AdminLoginInput = {
  username: string;
  password: string;
};

export type AdminLoginResponse = {
  token: string;
};

export type BlogPayload = {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  author: string;
  readTime: string;
  image?: File | null;
};
