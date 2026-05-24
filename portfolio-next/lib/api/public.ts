import { mapBlogDetail, mapBlogSummary, mapTestimonial } from "@/lib/mappers";
import type { AboutAuthorProfile, BlogPostDetail, BlogPostSummary, Testimonial } from "@/lib/types";
import { backendFetch } from "@/lib/api/core";

type BlogListResponse = {
  posts: any[];
  total: number;
  page: number;
  limit: number;
};

export async function getBlogPosts(query = "") {
  const data = await backendFetch<BlogListResponse>(`/api/blog${query}`, {
    next: { revalidate: 300 }
  });

  return {
    ...data,
    posts: Array.isArray(data.posts) ? data.posts.map(mapBlogSummary) : []
  };
}

export async function getBlogPost(id: string) {
  const data = await backendFetch<any>(`/api/blog/${id}`, {
    next: { revalidate: 300 }
  });

  return mapBlogDetail(data);
}

export async function getTestimonials() {
  const data = await backendFetch<any[]>(`/api/testimonials`, {
    next: { revalidate: 300 }
  });

  return Array.isArray(data) ? data.map(mapTestimonial) : [];
}

export async function getAboutAuthor(): Promise<AboutAuthorProfile> {
  try {
    const data = await backendFetch<any>(`/api/about-author`, {
      next: { revalidate: 300 }
    });

    return {
      _id: data?._id,
      name: data?.name || "ADELA",
      bio:
        data?.bio ||
        "ADELA writes about product decisions, web systems, and the practical lessons that show up while building useful digital experiences.",
      updatedAt: data?.updatedAt
    };
  } catch {
    return {
      name: "ADELA",
      bio: "ADELA writes about product decisions, web systems, and the practical lessons that show up while building useful digital experiences."
    };
  }
}
