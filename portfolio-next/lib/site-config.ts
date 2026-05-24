import type { Project, SiteConfig, SkillGroup } from "@/lib/types";

export const siteConfig: SiteConfig = {
  name: "Adela",
  fullName: "Faith Adeyekun",
  role: "Full-stack developer building thoughtful digital products",
  intro:
    "I build clean interfaces, durable backend systems, and product experiences that feel intentional from the first interaction.",
  location: "Nigeria",
  email: "adeyekunadelola0@gmail.com",
  phone: "+234 704 312 9502",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  navItems: [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/projects", label: "Projects" },
    { href: "/blog", label: "Blog" },
    { href: "/testimonials", label: "Testimonials" },
    { href: "/contact", label: "Contact" },
    { href: "/admin", label: "Admin" }
  ],
  socialLinks: [
    { label: "GitHub", href: "https://github.com/GOALLINNOOUT" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/faith-adeyekun-14893a363" },
    { label: "X", href: "https://x.com/AdelaAdeyekun" },
    { label: "Instagram", href: "https://www.instagram.com/adeyekunfaith/" },
    { label: "Facebook", href: "https://www.facebook.com/adelola.adeyekun.3" }
  ],
  seo: {
    title: "Adela | Full-stack Developer",
    description:
      "Adela is a full-stack developer building calm, high-performance web products with a strong focus on storytelling, systems, and healthtech.",
    keywords: [
      "Adela",
      "Faith Adeyekun",
      "full-stack developer",
      "Next.js portfolio",
      "React developer",
      "Node.js developer",
      "healthtech",
      "Nigeria developer"
    ]
  }
};

export const projects: Project[] = [
  {
    slug: "medimate",
    title: "MediMate",
    summary: "A healthtech platform designed to make care more accessible, structured, and reassuring.",
    challenge:
      "The goal was to shape a product that could bring telemedicine, medication reminders, and AI-guided insight into one cohesive system.",
    outcome:
      "MediMate became the flagship example of how I think about product systems: technical depth, user empathy, and a clear sense of responsibility.",
    story: [
      "MediMate sits at the center of my portfolio because it reflects the kind of work I want to keep doing. It is not just a dashboard or a feature list. It is a product shaped around the stress, uncertainty, and follow-through that real healthcare journeys demand.",
      "The work combined frontend clarity with backend structure: flows for telemedicine, medication reminders, and AI-driven support had to feel dependable rather than noisy.",
      "It also sharpened my healthtech vision. I care about building products that remove friction, support good decisions, and make complex systems feel calmer for the people using them."
    ],
    stack: ["React", "Node.js", "Express", "MongoDB", "Framer Motion", "JWT"],
    image: "/images/medimate.png",
    gallery: ["/images/medimate.png", "/images/medimate.png", "/images/medimate.png"],
    liveUrl: "https://medimatte.vercel.app/",
    featured: true
  },
  {
    slug: "wia",
    title: "WIA",
    summary:
      "A navigation and operational management platform for campuses, estates, and controlled environments.",
    challenge:
      "The system needed to help users move through complex physical spaces while giving administrators control over routes, visibility layers, access, and operational updates.",
    outcome:
      "WIA became a practical infrastructure product: a smarter way for people to interact with campuses, estates, and controlled environments while operations stay organized.",
    story: [
      "WIA is a navigation and operational management platform designed for campuses, estates, and controlled environments. It helps users move through complex spaces while giving administrators control over routes, visibility layers, access, and operational updates.",
      "As Lead Developer, I contributed to responsive interfaces, scalable frontend architecture, and user-focused experiences across desktop and mobile views. The work required balancing clarity, usability, and performance inside a web app handling real-world navigation and operational workflows.",
      "What made the project exciting was the team of creatives behind it. We set out to solve a common problem together: making complex physical environments easier to move through, manage, and understand.",
      "Focus areas included scalable UI architecture, responsive design, user experience, routing logic, admin workflows, operational workflows, and interface patterns that could support real movement through physical spaces."
    ],
    stack: ["React", "JavaScript", "Tailwind CSS", "Node.js", "MongoDB", "Responsive UI", "Routing Logic"],
    image: "/images/wia.jpg",
    liveUrl: "https://wia-core.vercel.app/"
  },
  {
    slug: "portfolio-platform",
    title: "Portfolio Platform",
    summary: "The original portfolio evolved into a full publishing and contact platform, not just a landing page.",
    challenge:
      "The site needed to present projects, publish blog content, support testimonials, and give me an admin workflow without losing responsiveness.",
    outcome:
      "It proved I can ship an end-to-end experience, then step back and redesign it with stronger architecture and storytelling when the product outgrows the first version.",
    story: [
      "The first portfolio was built as a full React application with a blog, admin tools, testimonials, and a contact workflow.",
      "That version carried a lot of capability, but it also made it obvious where better architecture, performance, and narrative focus would matter.",
      "This new Next.js rebuild turns that lesson into the product itself: fewer distractions, clearer hierarchy, stronger SEO, and a more premium first impression."
    ],
    stack: ["React", "Material UI", "Node.js", "Express", "MongoDB"],
    image: "/images/project2.png",
    liveUrl: "https://adelaportfolio.vercel.app/"
  },
  {
    slug: "jcs-closet",
    title: "JC's Closet",
    summary: "A fashion and fragrance commerce experience shaped around curation, trust, and visual polish.",
    challenge:
      "The product needed to balance commerce features with a more editorial, brand-forward experience.",
    outcome:
      "The result was a richer shopping flow with strong visual presentation, appointment support, and an experience that felt closer to a brand than a template.",
    story: [
      "JC's Closet pushed me to work at the intersection of commerce and presentation. Visitors needed clear browsing paths, but the brand also needed room to feel curated and personal.",
      "That meant building around product display, recommendations, appointments, and operational workflows without letting the UI become cluttered.",
      "It remains a strong example of how I approach user journeys when conversion and visual identity need to coexist."
    ],
    stack: ["React", "Node.js", "Express", "MongoDB", "Paystack"],
    image: "/images/jccloset.png",
    liveUrl: "https://jccloset.vercel.app/"
  },
  {
    slug: "scentsation-by-jc",
    title: "Scentsation by JC",
    summary: "A full-stack ecommerce build focused on the foundations of catalog, checkout, and admin management.",
    challenge:
      "The platform needed to cover the essential mechanics of ecommerce while staying easy to manage and expand.",
    outcome:
      "It became a solid systems project, especially for authentication, product operations, and payment flow design.",
    story: [
      "Scentsation by JC was one of the projects that helped me grow from interface building into fuller product thinking.",
      "It required the practical backbone of ecommerce: authentication, catalog structure, product management, cart logic, and checkout behavior.",
      "Even before launch, it showed how much I enjoy building systems that have to hold together beyond the homepage."
    ],
    stack: ["HTML", "CSS", "JavaScript", "PHP", "MySQL", "Paystack"],
    image: "/images/project1.png",
    githubUrl: "https://github.com/ADELA009/Scentsation-by-jc"
  }
];

export const skillGroups: SkillGroup[] = [
  {
    title: "Frontend Engineering",
    description: "Interfaces that feel light, clear, and deliberate across devices.",
    items: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion", "Responsive UI"]
  },
  {
    title: "Backend and APIs",
    description: "Reliable application logic, integration layers, and data flows.",
    items: ["Node.js", "Express", "MongoDB", "REST APIs", "JWT Auth", "MySQL"]
  },
  {
    title: "Product and Systems Thinking",
    description: "Architecture choices guided by usability, scale, and long-term clarity.",
    items: ["Information Architecture", "Admin Workflows", "SEO", "Performance", "Content Modeling"]
  },
  {
    title: "Tools and Workflow",
    description: "Practical tooling that supports shipping, iteration, and maintainability.",
    items: ["Git", "GitHub", "Postman", "Vercel", "Cloudinary", "Figma Handoff"]
  }
];

export const featuredProjects = projects.filter((project) => project.featured).concat(
  projects.filter((project) => !project.featured).slice(0, 2)
);
