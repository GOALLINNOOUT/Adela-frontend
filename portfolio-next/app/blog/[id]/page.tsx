import type { Metadata } from "next";
import { AboutAuthorDisclosure } from "@/components/about-author-disclosure";
import { BlogCard } from "@/components/blog-card";
import { BlogComments } from "@/components/blog-comments";
import { BlogLinkPreviews } from "@/components/blog-link-previews";
import { BlogPostActions } from "@/components/blog-post-actions";
import { BlogReactions } from "@/components/blog-reactions";
import { BlogReadingProgress } from "@/components/blog-reading-progress";
import { BlogViewLogger } from "@/components/blog-view-logger";
import { Container } from "@/components/container";
import { RichText } from "@/components/rich-text";
import { Section } from "@/components/section";
import { ShowcaseNativeImage } from "@/components/showcase-image";
import { getAboutAuthor, getBlogPost, getBlogPosts } from "@/lib/api/public";
import { absoluteUrl } from "@/lib/seo";
import type { BlogPostDetail, BlogPostSummary } from "@/lib/types";
import { formatDate, getReactionCount } from "@/lib/utils";

const weakSuggestionTerms = new Set([
  "about",
  "after",
  "also",
  "and",
  "are",
  "but",
  "for",
  "from",
  "how",
  "into",
  "the",
  "this",
  "that",
  "with",
  "your"
]);

function getSuggestionTerms(post: Pick<BlogPostSummary, "title" | "excerpt">) {
  return new Set(
    `${post.title} ${post.excerpt}`
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((term) => term.length > 3 && !weakSuggestionTerms.has(term))
  );
}

function scoreSuggestedPost(currentPost: BlogPostDetail, candidate: BlogPostSummary) {
  const currentTags = new Set(currentPost.tags.map((tag) => tag.toLowerCase()));
  const sharedTags = candidate.tags.filter((tag) => currentTags.has(tag.toLowerCase())).length;
  const currentTerms = getSuggestionTerms(currentPost);
  const candidateTerms = getSuggestionTerms(candidate);
  const sharedTerms = Array.from(candidateTerms).filter((term) => currentTerms.has(term)).length;

  return (
    (candidate.category.toLowerCase() === currentPost.category.toLowerCase() ? 8 : 0) +
    sharedTags * 4 +
    Math.min(sharedTerms, 5)
  );
}

function getSuggestedPosts(currentPost: BlogPostDetail, posts: BlogPostSummary[]) {
  return posts
    .filter((candidate) => candidate._id !== currentPost._id)
    .map((candidate) => ({
      post: candidate,
      score: scoreSuggestedPost(currentPost, candidate)
    }))
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return new Date(b.post.createdAt).getTime() - new Date(a.post.createdAt).getTime();
    })
    .slice(0, 2)
    .map(({ post }) => post);
}

function SuggestedPosts({ posts }: { posts: BlogPostSummary[] }) {
  if (posts.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-5xl space-y-5 border-t border-[var(--border)] pt-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[var(--muted)]">Suggested</p>
          <h2 className="mt-2 font-serif text-3xl tracking-tight text-[var(--foreground)]">Read this next</h2>
        </div>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        {posts.map((suggestedPost) => (
          <BlogCard key={suggestedPost._id} post={suggestedPost} />
        ))}
      </div>
    </section>
  );
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const post = await getBlogPost(id);
  const image = post.image || "/images/hero.jpg";

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: absoluteUrl(`/blog/${id}`)
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      url: absoluteUrl(`/blog/${id}`),
      images: [{ url: image.startsWith("http") ? image : absoluteUrl(image) }]
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [image.startsWith("http") ? image : absoluteUrl(image)]
    }
  };
}

export default async function BlogPostPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getBlogPost(id);
  const [blogData, aboutAuthor] = await Promise.all([
    getBlogPosts("?limit=20&sortBy=date"),
    getAboutAuthor()
  ]);
  const suggestedPosts = getSuggestedPosts(post, blogData.posts);
  const articleTargetId = `blog-article-${id}`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.image,
    author: {
      "@type": "Person",
      name: post.author
    },
    datePublished: post.createdAt,
    dateModified: post.updatedAt || post.createdAt,
    mainEntityOfPage: absoluteUrl(`/blog/${id}`)
  };

  return (
    <Section>
      <Container className="space-y-12">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
        <BlogReadingProgress postId={id} targetId={articleTargetId} />
        <BlogViewLogger postId={id} />

        <BlogPostActions postId={id} title={post.title} excerpt={post.excerpt} />

        <div className="space-y-6 border-b border-[var(--border)] pb-10">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-[var(--foreground)] px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-white">
              {post.category}
            </span>
            <span className="text-sm text-[var(--muted)]">{formatDate(post.createdAt)}</span>
          </div>
          <h1 className="max-w-4xl font-sans text-[2.9rem] font-bold uppercase leading-[1.02] tracking-[-0.035em] text-[var(--foreground)] md:text-[4.35rem] md:leading-[0.98]">
            {post.title}
          </h1>
          <p className="max-w-3xl text-base leading-8 text-[var(--muted)] md:text-lg">{post.excerpt}</p>
          <div className="flex flex-wrap items-center gap-4 rounded-[1.5rem] border border-[var(--border)] bg-white/70 p-4 text-sm text-[var(--muted)]">
            <div className="flex items-center gap-3 pr-2">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--foreground)] text-base font-semibold uppercase text-white">
                {post.author.charAt(0) || "A"}
              </span>
              <div>
                <p className="font-semibold text-[var(--foreground)]">{post.author}</p>
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Author</p>
              </div>
            </div>
            <span>{post.readTime}</span>
            <span>{post.views} views</span>
            <span>{getReactionCount(post.reactions)} reactions</span>
          </div>
          {post.tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[var(--border)] bg-white/80 px-3 py-1 text-xs font-medium text-[var(--foreground)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
          <AboutAuthorDisclosure author={aboutAuthor.name || post.author} bio={aboutAuthor.bio} />
        </div>

        <article id={articleTargetId} className="min-w-0 space-y-12 overflow-hidden">
          <div className="relative aspect-[16/8.8] overflow-hidden bg-[var(--media-surface)]">
            <ShowcaseNativeImage src={post.image || "/images/hero.jpg"} alt={post.title} />
          </div>

          <div className="mx-auto min-w-0 max-w-4xl border-t border-[var(--border)] pt-8 md:pt-10">
            <RichText html={post.content || "<p>No content available.</p>"} />
          </div>
          <BlogLinkPreviews targetId={articleTargetId} />
        </article>

        <BlogReactions postId={id} initialReactions={post.reactions} />
        <BlogComments postId={id} />
        <SuggestedPosts posts={suggestedPosts} />
      </Container>
    </Section>
  );
}
