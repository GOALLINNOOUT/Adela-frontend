import { BlogIndex } from "@/components/blog-index";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Blog",
  description: "Writing from Adela on development, product thinking, and lessons from building across the stack.",
  path: "/blog"
});

export default function BlogPage() {
  return <BlogIndex />;
}
