"use client";

import { useEffect, useState, useTransition, type ReactNode } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  FiArchive,
  FiArrowRight,
  FiArrowUpRight,
  FiBookOpen,
  FiCheckCircle,
  FiChevronRight,
  FiEdit2,
  FiExternalLink,
  FiFileText,
  FiGrid,
  FiLogOut,
  FiPause,
  FiPlay,
  FiPlus,
  FiSearch,
  FiTarget,
  FiX,
  FiZap,
} from "react-icons/fi";
import {
  changePostStatusAction,
  changeTrackStatusAction,
  logoutAdmin,
  saveCheckInAction,
  saveNowStatusAction,
  savePostAction,
  saveTrackAction,
} from "@/app/admin/actions";
import { StatusBadge } from "@/components/journal/JournalChrome";
import {
  cadenceLabel,
  formatDate,
  todayInTimezone,
  trackFrequency,
  trackProgress,
} from "@/lib/journal";
import type {
  ActionResult,
  BlogPost,
  Challenge,
  ChallengeTrack,
  JournalData,
} from "@/lib/types/journal";
import {
  ArticleEditor,
  CheckInEditor,
  FocusEditor,
  TrackEditor,
} from "./AdminEditors";
import { Panel } from "./AdminUI";

type Tab = "overview" | "articles" | "challenges" | "focus";
type Editor =
  | { kind: "article"; value: BlogPost | null }
  | { kind: "challenge"; value: ChallengeTrack | null }
  | { kind: "checkin"; track: ChallengeTrack; value: Challenge | null };
type Notice = { text: string; error?: boolean } | null;
const tabNames = {
  overview: "Overview",
  articles: "Articles",
  challenges: "Challenges",
  focus: "Current focus",
};

function Blank({
  title,
  children,
  action,
  icon = <FiFileText />,
}: {
  title: string;
  children: ReactNode;
  action?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="studio-empty">
      {icon}
      <h3>{title}</h3>
      <p>{children}</p>
      {action}
    </div>
  );
}

function RowButton({
  label,
  children,
  onClick,
  disabled,
}: {
  label: string;
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      className="studio-icon-button"
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export function AdminDashboard({
  data,
  configured,
}: {
  data: JournalData;
  configured: boolean;
}) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("overview");
  const [editor, setEditor] = useState<Editor | null>(null);
  const [notice, setNotice] = useState<Notice>(null);
  const [dirty, setDirty] = useState(false);
  const [pending, startTransition] = useTransition();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const { posts, tracks, challenges, nowStatus } = data;
  const published = posts.filter((post) => post.published && !post.archived_at);
  const drafts = posts.filter((post) => !post.published && !post.archived_at);
  const active = tracks.filter((track) => track.status === "active");

  useEffect(() => {
    if (!dirty) return;
    const handleUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, [dirty]);

  function canLeave() {
    return (
      !pending &&
      (!dirty ||
        window.confirm("You have unsaved changes. Discard them and continue?"))
    );
  }
  function navigate(next: Tab) {
    if (!canLeave()) return;
    setTab(next);
    setEditor(null);
    setDirty(false);
    setNotice(null);
    setSearch("");
    setFilter("all");
  }
  function open(next: Editor) {
    if (!canLeave()) return;
    setTab(next.kind === "article" ? "articles" : "challenges");
    setEditor(next);
    setDirty(false);
    setNotice(null);
  }
  function close() {
    if (!canLeave()) return;
    if (editor) setTab(editor.kind === "article" ? "articles" : "challenges");
    setEditor(null);
    setDirty(false);
    setNotice(null);
  }
  function run(
    action: () => Promise<ActionResult>,
    success: string,
    closeEditor = false,
  ) {
    startTransition(async () => {
      setNotice(null);
      try {
        const result = await action();
        if ("error" in result) {
          setNotice({ text: result.error, error: true });
          return;
        }
        setNotice({ text: success });
        setDirty(false);
        if (closeEditor) {
          if (editor)
            setTab(editor.kind === "article" ? "articles" : "challenges");
          setEditor(null);
          setDirty(false);
        }
        router.refresh();
      } catch {
        setNotice({
          text: "The connection was interrupted. Your changes are still here. Please try again.",
          error: true,
        });
      }
    });
  }
  function archivePost(post: BlogPost) {
    if (
      !window.confirm(
        `Archive “${post.title}”? It will be removed from the public journal. You can restore it later.`,
      )
    )
      return;
    run(() => changePostStatusAction(post.id, "archived"), "Article archived.");
  }
  const query = search.trim().toLowerCase();
  const visiblePosts = posts.filter(
    (post) =>
      `${post.title} ${post.tags?.join(" ")}`.toLowerCase().includes(query) &&
      (filter === "all"
        ? !post.archived_at
        : filter === "archived"
          ? !!post.archived_at
          : filter === "published"
            ? post.published && !post.archived_at
            : !post.published && !post.archived_at),
  );
  const visibleTracks = tracks.filter(
    (track) =>
      `${track.title} ${track.category}`.toLowerCase().includes(query) &&
      (filter === "all"
        ? track.status !== "archived"
        : track.status === filter),
  );
  const editorProps = { pending, onBack: close, onDirty: () => setDirty(true) };
  const nav = [
    { id: "overview", label: "Overview", icon: FiGrid },
    {
      id: "articles",
      label: "Articles",
      icon: FiFileText,
      count: posts.filter((post) => !post.archived_at).length,
    },
    {
      id: "challenges",
      label: "Challenges",
      icon: FiTarget,
      count: tracks.filter((track) => track.status !== "archived").length,
    },
    { id: "focus", label: "Current focus", icon: FiZap },
  ] as const;

  return (
    <div className="studio-layout" aria-busy={pending}>
      <aside className="studio-sidebar">
        <div className="studio-brand">
          <div className="studio-brand-mark">a.</div>
          <div>
            <p>Journal Studio</p>
            <span>Your publishing workspace</span>
          </div>
        </div>
        <p className="studio-nav-label">Workspace</p>
        <nav className="studio-nav" aria-label="Admin sections">
          {nav.map((item) => (
            <button
              type="button"
              className="studio-nav-button"
              key={item.id}
              aria-label={item.label}
              aria-current={tab === item.id ? "page" : undefined}
              onClick={() => navigate(item.id)}
              disabled={pending}
            >
              <item.icon aria-hidden="true" />
              <span>{item.label}</span>
              {"count" in item && (
                <span className="studio-nav-count">{item.count}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="studio-sidebar-bottom">
          <a
            href="/journal"
            target="_blank"
            rel="noreferrer"
            className="studio-nav-button"
            aria-label="View public journal"
          >
            <FiExternalLink aria-hidden="true" />
            <span>View journal</span>
          </a>
          <form
            action={logoutAdmin}
            onSubmit={(event) => {
              if (!canLeave()) event.preventDefault();
            }}
          >
            <button
              className="studio-nav-button"
              disabled={pending}
              aria-label="Sign out"
            >
              <FiLogOut aria-hidden="true" />
              <span>Sign out</span>
            </button>
          </form>
          <div className="studio-account">
            <Image src="/profile.jpg" width={30} height={30} alt="" />
            <div>
              <p>Abdrehim Misbah</p>
              <span>Owner</span>
            </div>
          </div>
        </div>
      </aside>
      <div className="studio-main">
        <header className="studio-topbar">
          <p>
            Workspace <FiChevronRight aria-hidden="true" />
            <span>
              {editor
                ? editor.kind === "article"
                  ? "Article editor"
                  : editor.kind === "challenge"
                    ? "Challenge editor"
                    : "Check-in"
                : tabNames[tab]}
            </span>
          </p>
          <div
            className="studio-connection"
            data-connected={configured && !data.error}
          >
            <i aria-hidden="true" />
            {dirty
              ? "Unsaved changes"
              : configured && !data.error
                ? "Connected"
                : "Setup needed"}
          </div>
        </header>
        <main className="studio-body" id="studio-content">
          {data.error && (
            <div className="studio-notice" data-error="true" role="status">
              <div>
                <p>{data.error}</p>
                <p className="mt-1 text-[11px] opacity-75">
                  Setup instructions: supabase/README.md
                </p>
              </div>
            </div>
          )}
          {notice && (
            <div
              className="studio-notice"
              data-error={!!notice.error}
              role={notice.error ? "alert" : "status"}
            >
              <span>{notice.text}</span>
              <button
                aria-label="Dismiss notification"
                onClick={() => setNotice(null)}
              >
                <FiX />
              </button>
            </div>
          )}
          {editor?.kind === "article" ? (
            <ArticleEditor
              key={`article-${editor.value?.id || "new"}`}
              {...editorProps}
              post={editor.value}
              tracks={tracks}
              onSave={(form) =>
                run(
                  () => savePostAction(form),
                  form.get("intent") === "publish"
                    ? "Article published. Your journal is up to date."
                    : "Draft saved.",
                  true,
                )
              }
            />
          ) : editor?.kind === "challenge" ? (
            <TrackEditor
              key={`challenge-${editor.value?.id || "new"}`}
              {...editorProps}
              track={editor.value}
              onSave={(form) =>
                run(() => saveTrackAction(form), "Challenge saved.", true)
              }
            />
          ) : editor?.kind === "checkin" ? (
            <CheckInEditor
              key={`checkin-${editor.value?.id || editor.track.id}`}
              {...editorProps}
              track={editor.track}
              entry={editor.value}
              onSave={(form) =>
                run(
                  () => saveCheckInAction(form),
                  "Check-in saved. Your progress is up to date.",
                  true,
                )
              }
            />
          ) : tab === "focus" ? (
            <FocusEditor
              key={nowStatus?.id || "new-focus"}
              {...editorProps}
              onBack={() => navigate("overview")}
              status={nowStatus}
              onSave={(form) =>
                run(() => saveNowStatusAction(form), "Current focus updated.")
              }
            />
          ) : (
            <>
              <div className="studio-page-header">
                <div>
                  <h1>
                    {tab === "overview"
                      ? "A space for your next idea."
                      : tabNames[tab]}
                  </h1>
                  <p>
                    {tab === "overview"
                      ? "Write, build a rhythm, and keep moving forward."
                      : tab === "articles"
                        ? "Thoughtful writing, from first draft to published."
                        : "Small commitments. Meaningful progress."}
                  </p>
                </div>
                <button
                  type="button"
                  className="studio-button studio-button-primary"
                  onClick={() =>
                    open(
                      tab === "challenges"
                        ? { kind: "challenge", value: null }
                        : { kind: "article", value: null },
                    )
                  }
                >
                  <FiPlus aria-hidden="true" />
                  {tab === "challenges" ? "New challenge" : "Write article"}
                </button>
              </div>
              {tab === "overview" && (
                <>
                  <div className="studio-stats">
                    <button
                      className="studio-stat"
                      onClick={() => {
                        navigate("articles");
                        setFilter("published");
                      }}
                    >
                      <div>
                        Published articles
                        <FiBookOpen aria-hidden="true" />
                      </div>
                      <strong>{data.error ? "—" : published.length}</strong>
                      <p>Live on your journal</p>
                    </button>
                    <button
                      className="studio-stat"
                      onClick={() => {
                        navigate("articles");
                        setFilter("draft");
                      }}
                    >
                      <div>
                        In drafts
                        <FiFileText aria-hidden="true" />
                      </div>
                      <strong>{data.error ? "—" : drafts.length}</strong>
                      <p>Ideas taking shape</p>
                    </button>
                    <button
                      className="studio-stat"
                      onClick={() => {
                        navigate("challenges");
                        setFilter("active");
                      }}
                    >
                      <div>
                        Active challenges
                        <FiTarget aria-hidden="true" />
                      </div>
                      <strong>{data.error ? "—" : active.length}</strong>
                      <p>Commitments in motion</p>
                    </button>
                  </div>
                  <div className="studio-overview-grid">
                    <Panel>
                      <div className="studio-section-heading">
                        <h2>Recent writing</h2>
                        <button
                          className="studio-text-button"
                          onClick={() => navigate("articles")}
                        >
                          View all <FiArrowRight aria-hidden="true" />
                        </button>
                      </div>
                      {posts.filter((post) => !post.archived_at).length ? (
                        [...posts]
                          .filter((post) => !post.archived_at)
                          .sort((a, b) =>
                            b.updated_at.localeCompare(a.updated_at),
                          )
                          .slice(0, 5)
                          .map((post) => (
                            <button
                              className="studio-recent-item"
                              key={post.id}
                              onClick={() =>
                                open({ kind: "article", value: post })
                              }
                            >
                              <div>
                                <h3>{post.title}</h3>
                                <p>Edited {formatDate(post.updated_at)}</p>
                              </div>
                              <StatusBadge
                                status={post.published ? "published" : "draft"}
                              />
                            </button>
                          ))
                      ) : (
                        <Blank
                          title="Your next idea belongs here."
                          action={
                            <button
                              className="studio-text-button !text-[var(--j-accent)]"
                              onClick={() =>
                                open({ kind: "article", value: null })
                              }
                            >
                              Write your first article <FiArrowUpRight />
                            </button>
                          }
                        >
                          Start with a thought, a lesson, or something you’ve
                          been building.
                        </Blank>
                      )}
                    </Panel>
                    <Panel>
                      <div className="studio-section-heading">
                        <h2>This week’s rhythm</h2>
                        <FiTarget
                          className="text-[var(--j-muted)]"
                          aria-hidden="true"
                        />
                      </div>
                      {active.length ? (
                        active.map((track) => {
                          const progress = trackProgress(track, challenges);
                          return (
                            <div
                              className="border-b border-[var(--j-border)] py-5 last:border-b-0"
                              key={track.id}
                            >
                              <div className="flex items-center justify-between gap-4">
                                <h3 className="text-xs leading-relaxed">
                                  {track.title}
                                </h3>
                                <span className="shrink-0 font-mono text-xs text-[var(--j-accent)]">
                                  {progress.weekly}/{trackFrequency(track)}
                                </span>
                              </div>
                              <p className="mt-2 text-[11px] text-[var(--j-muted)]">
                                {cadenceLabel(track)} · {progress.completed}{" "}
                                total days
                              </p>
                              <button
                                className="studio-text-button mt-4"
                                onClick={() =>
                                  open({ kind: "checkin", track, value: null })
                                }
                              >
                                <FiPlus aria-hidden="true" />
                                Log progress
                              </button>
                            </div>
                          );
                        })
                      ) : (
                        <Blank
                          title="Find your rhythm."
                          icon={<FiTarget />}
                          action={
                            <button
                              className="studio-text-button !text-[var(--j-accent)]"
                              onClick={() =>
                                open({ kind: "challenge", value: null })
                              }
                            >
                              Create a challenge <FiArrowUpRight />
                            </button>
                          }
                        >
                          Choose a topic and a weekly goal. Every check-in is a
                          step forward.
                        </Blank>
                      )}
                    </Panel>
                  </div>
                  <Panel className="mt-6">
                    <div className="flex flex-wrap items-center justify-between gap-6">
                      <div>
                        <p className="journal-eyebrow !text-[10px]">
                          Current focus
                        </p>
                        <h2 className="mt-4 text-lg font-medium tracking-tight">
                          {nowStatus?.active_project ||
                            "What are you building?"}
                        </h2>
                        <p className="mt-2 max-w-xl text-xs leading-7 text-[var(--j-muted)]">
                          {nowStatus?.description ||
                            "Let readers know what has your attention right now."}
                        </p>
                      </div>
                      <button
                        className="studio-button"
                        onClick={() => navigate("focus")}
                      >
                        <FiEdit2 aria-hidden="true" />
                        {nowStatus ? "Update focus" : "Add current focus"}
                      </button>
                    </div>
                  </Panel>
                </>
              )}
              {tab === "articles" && (
                <Panel className="!p-0">
                  <div className="studio-table-toolbar">
                    <div
                      className="studio-filters"
                      aria-label="Filter articles"
                    >
                      {["all", "published", "draft", "archived"].map(
                        (value) => (
                          <button
                            className="studio-filter capitalize"
                            key={value}
                            aria-pressed={filter === value}
                            onClick={() => setFilter(value)}
                          >
                            {value === "all"
                              ? "All articles"
                              : value === "draft"
                                ? "Drafts"
                                : value}
                          </button>
                        ),
                      )}
                    </div>
                    <label className="studio-search">
                      <FiSearch aria-hidden="true" />
                      <span className="sr-only">Search articles</span>
                      <input
                        placeholder="Search articles…"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                      />
                    </label>
                  </div>
                  {!visiblePosts.length ? (
                    <Blank
                      title={
                        posts.length
                          ? "No articles match."
                          : "Your first article starts here."
                      }
                    >
                      {posts.length
                        ? "Try a different search or filter."
                        : "Save a draft, take your time, and publish when you’re ready."}
                    </Blank>
                  ) : (
                    <div className="studio-table-scroll">
                      <table className="studio-table">
                        <thead>
                          <tr>
                            <th scope="col">Article</th>
                            <th scope="col">Status</th>
                            <th scope="col" className="studio-hide-mobile">
                              Last edited
                            </th>
                            <th scope="col">
                              <span className="sr-only">Actions</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {visiblePosts.map((post) => (
                            <tr key={post.id}>
                              <td>
                                <button
                                  className="studio-table-title"
                                  onClick={() =>
                                    open({ kind: "article", value: post })
                                  }
                                >
                                  {post.title}
                                </button>
                                {post.tags?.length > 0 && (
                                  <p className="mt-2 text-[10px] text-[var(--j-muted)]">
                                    {post.tags.slice(0, 3).join(" · ")}
                                  </p>
                                )}
                              </td>
                              <td>
                                <StatusBadge
                                  status={
                                    post.archived_at
                                      ? "archived"
                                      : post.published
                                        ? "published"
                                        : "draft"
                                  }
                                />
                              </td>
                              <td className="studio-hide-mobile whitespace-nowrap !text-[11px] !text-[var(--j-muted)]">
                                {formatDate(post.updated_at)}
                              </td>
                              <td>
                                <div className="studio-row-actions">
                                  <RowButton
                                    label={`Edit ${post.title}`}
                                    onClick={() =>
                                      open({ kind: "article", value: post })
                                    }
                                    disabled={pending}
                                  >
                                    <FiEdit2 />
                                  </RowButton>
                                  {post.published && !post.archived_at && (
                                    <a
                                      className="studio-icon-button"
                                      href={`/journal/${post.slug}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      title="View article"
                                      aria-label={`View ${post.title}`}
                                    >
                                      <FiExternalLink />
                                    </a>
                                  )}
                                  {post.archived_at ? (
                                    <RowButton
                                      label="Restore as draft"
                                      onClick={() =>
                                        run(
                                          () =>
                                            changePostStatusAction(
                                              post.id,
                                              "draft",
                                            ),
                                          "Article restored as a draft.",
                                        )
                                      }
                                      disabled={pending}
                                    >
                                      <FiPlay />
                                    </RowButton>
                                  ) : (
                                    <>
                                      <RowButton
                                        label={
                                          post.published
                                            ? "Unpublish article"
                                            : "Publish article"
                                        }
                                        onClick={() =>
                                          run(
                                            () =>
                                              changePostStatusAction(
                                                post.id,
                                                post.published
                                                  ? "draft"
                                                  : "published",
                                              ),
                                            post.published
                                              ? "Article moved to drafts."
                                              : "Article published.",
                                          )
                                        }
                                        disabled={pending}
                                      >
                                        {post.published ? (
                                          <FiPause />
                                        ) : (
                                          <FiSendIcon />
                                        )}
                                      </RowButton>
                                      <RowButton
                                        label="Archive article"
                                        onClick={() => archivePost(post)}
                                        disabled={pending}
                                      >
                                        <FiArchive />
                                      </RowButton>
                                    </>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </Panel>
              )}
              {tab === "challenges" && (
                <>
                  <Panel className="!p-0">
                    <div className="studio-table-toolbar">
                      <div
                        className="studio-filters"
                        aria-label="Filter challenges"
                      >
                        {[
                          "all",
                          "active",
                          "planned",
                          "paused",
                          "completed",
                          "archived",
                        ].map((value) => (
                          <button
                            className="studio-filter capitalize"
                            key={value}
                            aria-pressed={filter === value}
                            onClick={() => setFilter(value)}
                          >
                            {value}
                          </button>
                        ))}
                      </div>
                      <label className="studio-search">
                        <FiSearch aria-hidden="true" />
                        <span className="sr-only">Search challenges</span>
                        <input
                          placeholder="Search challenges…"
                          value={search}
                          onChange={(event) => setSearch(event.target.value)}
                        />
                      </label>
                    </div>
                    {!visibleTracks.length ? (
                      <Blank
                        title={
                          tracks.length
                            ? "No challenges match."
                            : "Start with a small commitment."
                        }
                        icon={<FiTarget />}
                      >
                        {tracks.length
                          ? "Try a different search or filter."
                          : "Choose your topic, set your dates, and decide how many days a week you want to show up."}
                      </Blank>
                    ) : (
                      <div className="studio-table-scroll">
                        <table className="studio-table">
                          <thead>
                            <tr>
                              <th scope="col">Challenge</th>
                              <th scope="col">Status</th>
                              <th scope="col" className="studio-hide-mobile">
                                Progress
                              </th>
                              <th scope="col">
                                <span className="sr-only">Actions</span>
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {visibleTracks.map((track) => {
                              const progress = trackProgress(track, challenges);
                              const today = todayInTimezone(
                                track.timezone || "Africa/Addis_Ababa",
                              );
                              const canCheckIn =
                                track.status !== "archived" &&
                                (!track.start_date ||
                                  track.start_date <= today);
                              return (
                                <tr key={track.id}>
                                  <td>
                                    <button
                                      className="studio-table-title"
                                      onClick={() =>
                                        open({
                                          kind: "challenge",
                                          value: track,
                                        })
                                      }
                                    >
                                      {track.title}
                                    </button>
                                    <p className="mt-2 text-[10px] text-[var(--j-muted)]">
                                      {track.category} · {cadenceLabel(track)}
                                    </p>
                                  </td>
                                  <td>
                                    <StatusBadge status={track.status} />
                                  </td>
                                  <td className="studio-hide-mobile">
                                    <p className="mb-3 whitespace-nowrap text-[11px] text-[var(--j-muted)]">
                                      {progress.completed}/{track.target_count}{" "}
                                      days
                                    </p>
                                    <div className="challenge-progress min-w-20">
                                      <span
                                        style={{
                                          width: `${progress.percent}%`,
                                        }}
                                      />
                                    </div>
                                  </td>
                                  <td>
                                    <div className="studio-row-actions">
                                      <RowButton
                                        label="Edit challenge"
                                        onClick={() =>
                                          open({
                                            kind: "challenge",
                                            value: track,
                                          })
                                        }
                                        disabled={pending}
                                      >
                                        <FiEdit2 />
                                      </RowButton>
                                      {canCheckIn && (
                                        <RowButton
                                          label="Log progress"
                                          onClick={() =>
                                            open({
                                              kind: "checkin",
                                              track,
                                              value: null,
                                            })
                                          }
                                          disabled={pending}
                                        >
                                          <FiPlus />
                                        </RowButton>
                                      )}
                                      {track.status !== "archived" && (
                                        <a
                                          className="studio-icon-button"
                                          href={`/journal/challenges/${track.slug}`}
                                          target="_blank"
                                          rel="noreferrer"
                                          title="View challenge"
                                          aria-label={`View ${track.title}`}
                                        >
                                          <FiExternalLink />
                                        </a>
                                      )}
                                      <RowButton
                                        label={
                                          track.status === "archived"
                                            ? "Restore challenge"
                                            : "Archive challenge"
                                        }
                                        disabled={pending}
                                        onClick={() => {
                                          if (
                                            track.status === "archived" ||
                                            window.confirm(
                                              `Archive “${track.title}”? Its check-ins will be preserved.`,
                                            )
                                          )
                                            run(
                                              () =>
                                                changeTrackStatusAction(
                                                  track.id,
                                                  track.status === "archived"
                                                    ? "paused"
                                                    : "archived",
                                                ),
                                              track.status === "archived"
                                                ? "Challenge restored."
                                                : "Challenge archived.",
                                            );
                                        }}
                                      >
                                        {track.status === "archived" ? (
                                          <FiPlay />
                                        ) : (
                                          <FiArchive />
                                        )}
                                      </RowButton>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </Panel>
                  {challenges.length > 0 && (
                    <Panel title="Recent check-ins" className="mt-6">
                      {challenges.slice(0, 12).map((entry) => {
                        const track = tracks.find(
                          (item) => item.slug === entry.track_slug,
                        );
                        return (
                          <div className="studio-checkin-row" key={entry.id}>
                            <div>
                              <h3>{entry.title}</h3>
                              <p>
                                {formatDate(entry.completed_date)} ·{" "}
                                {track?.title || entry.challenge_name}
                              </p>
                            </div>
                            {track && track.status !== "archived" && (
                              <RowButton
                                label={`Edit ${entry.title}`}
                                disabled={pending}
                                onClick={() =>
                                  open({ kind: "checkin", track, value: entry })
                                }
                              >
                                <FiEdit2 />
                              </RowButton>
                            )}
                          </div>
                        );
                      })}
                    </Panel>
                  )}
                </>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

function FiSendIcon() {
  return <FiCheckCircle />;
}
