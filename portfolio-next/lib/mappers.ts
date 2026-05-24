import type {
  BlogPostDetail,
  BlogPostSummary,
  ContactRecord,
  Testimonial
} from "@/lib/types";

function normalizeTags(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }

  return [];
}

export function mapBlogSummary(input: any): BlogPostSummary {
  return {
    _id: input?._id ?? "",
    title: input?.title ?? "",
    excerpt: input?.excerpt ?? "",
    content: input?.content,
    image: input?.image ?? "",
    category: input?.category ?? "General",
    tags: normalizeTags(input?.tags),
    author: input?.author ?? "Adela",
    readTime: input?.readTime ?? "1 min read",
    views: Number(input?.views ?? 0),
    createdAt: input?.createdAt ?? new Date().toISOString(),
    updatedAt: input?.updatedAt
  };
}

export function mapBlogDetail(input: any): BlogPostDetail {
  return {
    ...mapBlogSummary(input),
    reactions: input?.reactions
  };
}

export function mapTestimonial(input: any): Testimonial {
  return {
    _id: input?._id ?? "",
    name: input?.name ?? "",
    position: input?.position ?? "",
    rating: Number(input?.rating ?? 0),
    testimonial: input?.testimonial ?? "",
    avatar: input?.avatar ?? undefined,
    approved: Boolean(input?.approved),
    createdAt: input?.createdAt ?? new Date().toISOString()
  };
}

export function mapContactRecord(input: any): ContactRecord {
  return {
    _id: input?._id ?? "",
    name: input?.name ?? "",
    email: input?.email ?? "",
    subject: input?.subject ?? "",
    message: input?.message ?? "",
    createdAt: input?.createdAt ?? new Date().toISOString()
  };
}
