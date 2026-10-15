import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { FiArrowUpRight } from "react-icons/fi";
import { BackLink, JournalFooter } from "@/components/journal/JournalChrome";
import { MarkdownRenderer } from "@/components/journal/MarkdownRenderer";
import { getBlogPostBySlug, getJournalData } from "@/lib/supabase/queries";
import { formatDate, postDate, readingTime } from "@/lib/journal";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getBlogPostBySlug((await params).slug);
  if (!post) return { title: "Article not found | Abdrehim Misbah" };
  return {
    title: `${post.title} | Abdrehim Misbah`,
    description: post.excerpt,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      publishedTime: postDate(post) || undefined,
      images: post.cover_image ? [post.cover_image] : [],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getBlogPostBySlug((await params).slug);
  if (!post) notFound();
  const data = post.track_slug ? await getJournalData() : null;
  const track = data?.tracks.find((item) => item.slug === post.track_slug);
  return (
    <>
      <main className="article-layout pb-20">
        <BackLink />
        <article>
          <header className="article-heading">
            <div className="article-card-meta">
              {postDate(post) && (
                <time dateTime={postDate(post)!}>
                  {formatDate(postDate(post), true)}
                </time>
              )}
              <span>/</span>
              <span>{readingTime(post.content)}</span>
            </div>
            <h1>{post.title}</h1>
            <p>{post.excerpt}</p>
            <div className="article-author">
              <Image
                src="/profile.jpg"
                alt="Abdrehim Misbah"
                width={36}
                height={36}
              />
              <div>
                <p>Abdrehim Misbah</p>
                <p className="mt-1 text-xs text-[var(--j-muted)]">
                  Software engineer
                </p>
              </div>
            </div>
          </header>
          {track && (
            <Link
              href={`/journal/challenges/${track.slug}`}
              className="journal-notice mb-8 flex items-center justify-between gap-3 !border-[var(--j-border)] !bg-white/[0.02] !text-[var(--j-accent)]"
            >
              <span>Part of {track.title}</span>
              <FiArrowUpRight aria-hidden="true" />
            </Link>
          )}
          {post.cover_image && (
            <div className="article-cover">
              <Image
                src={post.cover_image}
                alt={post.title}
                fill
                priority
                unoptimized
                sizes="(max-width: 800px) 100vw, 760px"
              />
            </div>
          )}
          <MarkdownRenderer content={post.content} />
          <div className="article-bottom">
            <div className="mb-7 flex flex-wrap gap-2">
              {post.tags?.map((tag) => (
                <span className="journal-tag" key={tag}>
                  {tag}
                </span>
              ))}
            </div>
            <BackLink />
          </div>
        </article>
      </main>
      <JournalFooter />
    </>
  );
}
