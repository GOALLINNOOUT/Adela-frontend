import { HomeStoryScroller } from "@/components/home-story-scroller";
import { getBlogPosts } from "@/lib/api/public";
import { buildMetadata } from "@/lib/seo";
import { projects, skillGroups } from "@/lib/site-config";

export const metadata = buildMetadata({
  title: "Adela",
  description:
    "Full-stack developer building clean interfaces, durable backend systems, and thoughtful digital products.",
  path: "/"
});

export default async function HomePage() {
  const blogData = await getBlogPosts("?limit=3&sortBy=date");

  return <HomeStoryScroller projects={projects} skillGroups={skillGroups} posts={blogData.posts} />;
}
