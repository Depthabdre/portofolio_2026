import Link from "next/link";
import Image from "next/image";
import { FiArrowUpRight } from "react-icons/fi";
import { formatDate, postDate, readingTime } from "@/lib/journal";
import type { BlogPost } from "@/lib/types/journal";

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <article className="article-card">
      {post.cover_image && (
        <Link
          href={`/journal/${post.slug}`}
          className="article-card-image"
          tabIndex={-1}
          aria-hidden="true"
        >
          <Image
            src={post.cover_image}
            alt=""
            fill
            unoptimized
            sizes="(max-width: 640px) 100vw, 540px"
          />
        </Link>
      )}
      <div className="article-card-body">
        <div className="article-card-meta">
          {postDate(post) && (
            <time dateTime={postDate(post)!}>{formatDate(postDate(post))}</time>
          )}
          <span aria-hidden="true">/</span>
          <span>{readingTime(post.content)}</span>
        </div>
        <h2>
          <Link href={`/journal/${post.slug}`}>{post.title}</Link>
        </h2>
        <p className="article-card-description line-clamp-3">{post.excerpt}</p>
        <div className="article-card-footer">
          <div className="flex flex-wrap gap-2">
            {post.tags?.slice(0, 2).map((tag) => (
              <span className="journal-tag" key={tag}>
                {tag}
              </span>
            ))}
          </div>
          <Link
            href={`/journal/${post.slug}`}
            className="article-read shrink-0"
            aria-label={`Read ${post.title}`}
          >
            Read article <FiArrowUpRight aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}
