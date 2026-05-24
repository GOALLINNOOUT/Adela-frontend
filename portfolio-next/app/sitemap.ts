import type { MetadataRoute } from "next";
import { getBlogPosts } from "@/lib/api/public";
import { siteConfig } from "@/lib/site-config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = ["/", "/about", "/projects", "/blog", "/testimonials", "/contact"];
  const blogPosts = await getBlogPosts("?limit=50&sortBy=date");

  return routes
    .map((route) => ({
      url: new URL(route, siteConfig.siteUrl).toString(),
      lastModified: new Date()
    }))
    .concat(
      blogPosts.posts.map((post) => ({
        url: new URL(`/blog/${post._id}`, siteConfig.siteUrl).toString(),
        lastModified: new Date(post.updatedAt || post.createdAt)
      }))
    );
}
