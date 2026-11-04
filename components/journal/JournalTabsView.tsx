"use client";

import { useState } from "react";
import Link from "next/link";
import { FiSearch, FiX } from "react-icons/fi";
import type { JournalData } from "@/lib/types/journal";
import { NowStatusCard } from "./NowStatusCard";
import { ChallengeTimeline } from "./ChallengeTimeline";
import { BlogCard } from "./BlogCard";
import { EmptyState } from "./JournalChrome";

export function JournalTabsView({
  posts,
  tracks,
  challenges,
  nowStatus,
  error,
  initialTab,
}: JournalData & { initialTab: "articles" | "challenges" }) {
  const [search, setSearch] = useState("");
  const [topic, setTopic] = useState<string | null>(null);
  const topics = [
    ...new Set(
      initialTab === "articles"
        ? posts.flatMap((post) => post.tags || [])
        : tracks.map((track) => track.category),
    ),
  ].sort();
  const query = search.trim().toLowerCase();
  const filteredPosts = posts.filter(
    (post) =>
      (!topic || post.tags?.includes(topic)) &&
      `${post.title} ${post.excerpt} ${post.tags?.join(" ")}`
        .toLowerCase()
        .includes(query),
  );
  const filteredTracks = tracks.filter(
    (track) =>
      (!topic || track.category === topic) &&
      `${track.title} ${track.description} ${track.category}`
        .toLowerCase()
        .includes(query),
  );
  const hasContent =
    initialTab === "articles" ? posts.length > 0 : tracks.length > 0;
  const hasResults =
    initialTab === "articles"
      ? filteredPosts.length > 0
      : filteredTracks.length > 0;

  return (
    <>
      <div className="journal-toolbar">
        <nav className="journal-tabs" aria-label="Journal sections">
          <Link
            href="/journal"
            scroll={false}
            className="journal-tab"
            aria-current={initialTab === "articles" ? "page" : undefined}
          >
            Articles
            {posts.length > 0 && (
              <span className="journal-tab-count">{posts.length}</span>
            )}
          </Link>
          <Link
            href="/journal?view=challenges"
            scroll={false}
            className="journal-tab"
            aria-current={initialTab === "challenges" ? "page" : undefined}
          >
            Challenges{" "}
            {tracks.length > 0 && (
              <span className="journal-tab-count">{tracks.length}</span>
            )}
          </Link>
        </nav>
        {hasContent && (
          <div
            className="journal-search"
            role="search"
            aria-label={`Search ${initialTab}`}
          >
            <FiSearch aria-hidden="true" />
            <label htmlFor="journal-search" className="sr-only">
              Search {initialTab}
            </label>
            <input
              id="journal-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={`Search ${initialTab}…`}
            />
            {search && (
              <button onClick={() => setSearch("")} aria-label="Clear search">
                <FiX aria-hidden="true" />
              </button>
            )}
          </div>
        )}
      </div>
      {topics.length > 0 && (
        <div className="journal-filter" aria-label="Filter by topic">
          <button
            className="journal-tag"
            aria-pressed={!topic}
            onClick={() => setTopic(null)}
          >
            All topics
          </button>
          {topics.map((tag) => (
            <button
              className="journal-tag"
              key={tag}
              aria-pressed={topic === tag}
              onClick={() => setTopic(topic === tag ? null : tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      )}
      <div className="journal-content">
        {error ? (
          <div role="status" className="journal-notice">
            {error}
          </div>
        ) : hasContent && !hasResults ? (
          <EmptyState title={`No matching ${initialTab}.`}>
            <p>Try another search or choose a different topic.</p>
            <button
              className="journal-reset"
              onClick={() => {
                setSearch("");
                setTopic(null);
                document.getElementById("journal-search")?.focus();
              }}
            >
              Clear search and filters
            </button>
          </EmptyState>
        ) : initialTab === "articles" ? (
          posts.length ? (
            <div className="article-grid">
              {filteredPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <EmptyState title="No articles published yet.">
              Notes from my work and what I’m learning will appear here as I
              publish them.
            </EmptyState>
          )
        ) : (
          <ChallengeTimeline challenges={challenges} tracks={filteredTracks} />
        )}
        {nowStatus && <NowStatusCard status={nowStatus} />}
      </div>
    </>
  );
}
