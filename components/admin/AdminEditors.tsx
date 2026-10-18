"use client";

import { useState, type FormEvent } from "react";
import { FiCheck, FiEye, FiFileText, FiSend } from "react-icons/fi";
import { MarkdownRenderer } from "@/components/journal/MarkdownRenderer";
import { StatusBadge } from "@/components/journal/JournalChrome";
import {
  dateRangeDays,
  formatDate,
  readingTime,
  slugify,
  suggestedTarget,
  todayInTimezone,
  trackFrequency,
} from "@/lib/journal";
import type {
  BlogPost,
  Challenge,
  ChallengeTrack,
  NowStatus,
} from "@/lib/types/journal";
import { EditorHeader, Field, Panel, PublicLink } from "./AdminUI";

interface EditorProps {
  pending: boolean;
  onBack: () => void;
  onDirty: () => void;
  onSave: (form: FormData) => void;
}

function submit(
  event: FormEvent<HTMLFormElement>,
  onSave: EditorProps["onSave"],
) {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const button = (event.nativeEvent as SubmitEvent).submitter;
  data.set("intent", button?.getAttribute("value") || "draft");
  onSave(data);
}

export function ArticleEditor({
  post,
  tracks,
  pending,
  onBack,
  onDirty,
  onSave,
}: EditorProps & { post: BlogPost | null; tracks: ChallengeTrack[] }) {
  const [title, setTitle] = useState(post?.title || "");
  const [excerpt, setExcerpt] = useState(post?.excerpt || "");
  const [content, setContent] = useState(post?.content || "");
  const [preview, setPreview] = useState(false);
  const [slug, setSlug] = useState(post?.slug || "");
  const [cover, setCover] = useState(post?.cover_image || "");
  const availableTracks = tracks.filter(
    (track) => track.status !== "archived" || track.slug === post?.track_slug,
  );
  return (
    <form onSubmit={(event) => submit(event, onSave)} onChange={onDirty}>
      <fieldset disabled={pending} className="contents">
        <input type="hidden" name="id" value={post?.id || ""} />
        <EditorHeader
          eyebrow="articles"
          title={post ? "Edit article" : "A new thought starts here."}
          onBack={onBack}
        >
          {post?.published && !post.archived_at && (
            <PublicLink href={`/journal/${post.slug}`}>View live</PublicLink>
          )}
          <button
            type="submit"
            name="intent"
            value="draft"
            disabled={pending}
            className="studio-button"
          >
            <FiCheck aria-hidden="true" />
            {pending
              ? "Saving…"
              : post?.published
                ? "Unpublish & save"
                : "Save draft"}
          </button>
          <button
            type="submit"
            name="intent"
            value="publish"
            disabled={pending}
            className="studio-button studio-button-primary"
          >
            <FiSend aria-hidden="true" />
            {post?.published ? "Update article" : "Publish article"}
          </button>
        </EditorHeader>
        <div className="studio-editor-grid">
          <Panel>
            <label className="sr-only" htmlFor="title">
              Article title
            </label>
            <textarea
              id="title"
              name="title"
              required={!preview}
              maxLength={200}
              rows={2}
              hidden={preview}
              className="studio-editor-input studio-title-input"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Give your idea a title"
            />
            <label className="sr-only" htmlFor="excerpt">
              Excerpt
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              maxLength={600}
              rows={3}
              hidden={preview}
              className="studio-editor-input studio-excerpt-input"
              value={excerpt}
              onChange={(event) => setExcerpt(event.target.value)}
              placeholder="A short introduction that makes someone want to read on…"
            />
            <div className="studio-editor-tabs">
              <div>
                <button
                  type="button"
                  className="studio-filter inline-flex items-center gap-2"
                  aria-pressed={!preview}
                  onClick={() => setPreview(false)}
                >
                  <FiFileText aria-hidden="true" />
                  Write
                </button>
                <button
                  type="button"
                  className="studio-filter inline-flex items-center gap-2"
                  aria-pressed={preview}
                  onClick={() => setPreview(true)}
                >
                  <FiEye aria-hidden="true" />
                  Preview
                </button>
              </div>
              <span>{readingTime(content)}</span>
            </div>
            <label htmlFor="content" className="sr-only">
              Article content in Markdown
            </label>
            <textarea
              id="content"
              name="content"
              hidden={preview}
              value={content}
              onChange={(event) => setContent(event.target.value)}
              className="studio-editor-input studio-markdown-input"
              placeholder="Start writing. Markdown, code blocks, and tables are supported."
              rows={22}
            />
            {preview && (
              <div className="min-h-[450px] pb-6">
                <p className="journal-eyebrow mb-6">Reader preview</p>
                <h2 className="mb-5 text-3xl font-medium tracking-tight">
                  {title || "Untitled article"}
                </h2>
                {excerpt && (
                  <p className="mb-8 border-b border-[var(--j-border)] pb-6 text-base leading-relaxed text-[var(--j-muted)]">
                    {excerpt}
                  </p>
                )}
                {cover && (
                  <div className="mb-8 overflow-hidden rounded-lg">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={cover}
                      alt="Article cover preview"
                      className="max-h-80 w-full object-cover"
                    />
                  </div>
                )}
                {content ? (
                  <MarkdownRenderer content={content} />
                ) : (
                  <p className="text-sm text-[var(--j-muted)]">
                    Your writing will appear here.
                  </p>
                )}
              </div>
            )}
            <div className="mt-6 border-t border-[var(--j-border)] pt-4 text-[11px] text-[var(--j-muted)]">
              {content.trim() ? content.trim().split(/\s+/).length : 0} words{" "}
              <span className="px-2 text-white/20">/</span> Markdown supported
            </div>
          </Panel>
          <aside className="studio-editor-aside">
            <Panel title="Publishing">
              <div className="studio-form-stack">
                <div className="flex items-center justify-between text-xs text-[var(--j-muted)]">
                  <span>Status</span>
                  <StatusBadge
                    status={
                      post?.archived_at
                        ? "archived"
                        : post?.published
                          ? "published"
                          : "draft"
                    }
                  />
                </div>
                <Field
                  label="Article URL"
                  name="slug"
                  hint={
                    post
                      ? "The URL stays the same when you edit."
                      : "Generated from the title. You can customize it before saving."
                  }
                >
                  <div className="mb-1 text-[10px] text-[var(--j-muted)]">
                    /journal/
                  </div>
                  <input
                    id="slug"
                    name="slug"
                    value={post ? post.slug : slug || slugify(title)}
                    onChange={(event) => setSlug(event.target.value)}
                    readOnly={!!post}
                    maxLength={200}
                  />
                </Field>
                <Field
                  label="Challenge"
                  name="track_slug"
                  hint="Optional. Connect this article to a learning challenge."
                >
                  <select
                    id="track_slug"
                    name="track_slug"
                    defaultValue={post?.track_slug || ""}
                  >
                    <option value="">Standalone article</option>
                    {availableTracks.map((track) => (
                      <option value={track.slug} key={track.id}>
                        {track.title}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
            </Panel>
            <Panel title="Details">
              <div className="studio-form-stack">
                <Field
                  label="Topics"
                  name="tags"
                  hint="Separate topics with commas."
                >
                  <input
                    id="tags"
                    name="tags"
                    defaultValue={post?.tags?.join(", ") || ""}
                    placeholder="Add topics"
                    maxLength={500}
                  />
                </Field>
                <Field
                  label="Cover image"
                  name="cover_image"
                  hint="Optional. Your article looks great without one, too."
                >
                  <input
                    id="cover_image"
                    type="url"
                    name="cover_image"
                    value={cover}
                    onChange={(event) => setCover(event.target.value)}
                    placeholder="https://"
                  />
                </Field>
              </div>
            </Panel>
          </aside>
        </div>
      </fieldset>
    </form>
  );
}

export function TrackEditor({
  track,
  pending,
  onBack,
  onDirty,
  onSave,
}: EditorProps & { track: ChallengeTrack | null }) {
  const [title, setTitle] = useState(track?.title || "");
  const [start, setStart] = useState(track?.start_date || "");
  const [end, setEnd] = useState(track?.end_date || "");
  const [frequency, setFrequency] = useState(track ? trackFrequency(track) : 3);
  const [preferred, setPreferred] = useState<number[]>(
    track?.preferred_days || [],
  );
  const [target, setTarget] = useState(track ? String(track.target_count) : "");
  const suggestion =
    start && end ? suggestedTarget(start, end, frequency, preferred) : 1;
  return (
    <form onSubmit={(event) => submit(event, onSave)} onChange={onDirty}>
      <fieldset disabled={pending} className="contents">
        <input name="id" type="hidden" value={track?.id || ""} />
        <EditorHeader
          eyebrow="challenges"
          title={track ? "Shape your challenge." : "Make room for consistency."}
          onBack={onBack}
        >
          <button
            className="studio-button studio-button-primary"
            disabled={pending}
            type="submit"
          >
            <FiCheck aria-hidden="true" />
            {pending
              ? "Saving…"
              : track
                ? "Save challenge"
                : "Create challenge"}
          </button>
        </EditorHeader>
        <div className="studio-editor-grid">
          <div className="studio-form-stack">
            <Panel title="The intention">
              <div className="studio-form-stack">
                <Field label="Challenge title" name="title">
                  <input
                    id="title"
                    name="title"
                    required
                    maxLength={200}
                    placeholder="What do you want to work on?"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                  />
                </Field>
                <Field
                  label="Description"
                  name="description"
                  hint="What are you hoping to learn or build?"
                >
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    required
                    maxLength={2000}
                    defaultValue={track?.description || ""}
                  />
                </Field>
                <Field label="Topic" name="category">
                  <input
                    id="category"
                    name="category"
                    required
                    maxLength={80}
                    defaultValue={track?.category || ""}
                    placeholder="Choose a topic"
                  />
                </Field>
              </div>
            </Panel>
            <Panel title="The commitment">
              <div className="studio-form-stack">
                <div className="studio-form-grid">
                  <Field label="Start date" name="start_date">
                    <input
                      id="start_date"
                      name="start_date"
                      type="date"
                      required
                      value={start}
                      onChange={(event) => setStart(event.target.value)}
                    />
                  </Field>
                  <Field label="End date" name="end_date">
                    <input
                      id="end_date"
                      name="end_date"
                      type="date"
                      required
                      min={start || undefined}
                      value={end}
                      onChange={(event) => setEnd(event.target.value)}
                    />
                  </Field>
                </div>
                <Field
                  label="Days per week"
                  name="days_per_week"
                  hint="Choose a rhythm you can sustain."
                >
                  <select
                    id="days_per_week"
                    name="days_per_week"
                    value={frequency}
                    onChange={(event) => {
                      setFrequency(Number(event.target.value));
                      setPreferred([]);
                    }}
                  >
                    {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                      <option key={day} value={day}>
                        {day === 7
                          ? "Every day"
                          : `${day} ${day === 1 ? "day" : "days"} per week`}
                      </option>
                    ))}
                  </select>
                </Field>
                <fieldset>
                  <legend className="mb-3 text-xs text-[#c1ccda]">
                    Preferred weekdays{" "}
                    <span className="ml-1 text-[var(--j-muted)]">
                      (optional)
                    </span>
                  </legend>
                  <div className="studio-weekdays">
                    {[1, 2, 3, 4, 5, 6, 0].map((day) => (
                      <label className="studio-weekday" key={day}>
                        <input
                          type="checkbox"
                          name="preferred_days"
                          value={day}
                          checked={preferred.includes(day)}
                          onChange={(event) =>
                            setPreferred(
                              event.target.checked
                                ? [...preferred, day]
                                : preferred.filter((value) => value !== day),
                            )
                          }
                        />
                        <span>
                          {
                            ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
                              day
                            ]
                          }
                        </span>
                      </label>
                    ))}
                  </div>
                  <p className="mt-3 text-[11px] leading-relaxed text-[var(--j-muted)]">
                    Choose {frequency} weekdays, or leave them open for a
                    flexible schedule.
                  </p>
                </fieldset>
                <Field
                  label="Total day goal"
                  name="target_count"
                  hint={
                    start && end && dateRangeDays(start, end) > 0
                      ? `${dateRangeDays(start, end)} calendar days. Suggested goal: ${suggestion} completed days.`
                      : "Choose dates to calculate a suggested goal."
                  }
                >
                  <input
                    id="target_count"
                    name="target_count"
                    type="number"
                    min={1}
                    max={
                      start && end
                        ? Math.max(1, dateRangeDays(start, end))
                        : undefined
                    }
                    required
                    value={target || suggestion}
                    onChange={(event) => setTarget(event.target.value)}
                  />
                  {target && (
                    <button
                      type="button"
                      className="studio-text-button self-start"
                      onClick={() => {
                        setTarget("");
                        onDirty();
                      }}
                    >
                      Use suggested goal
                    </button>
                  )}
                </Field>
              </div>
            </Panel>
          </div>
          <aside className="studio-editor-aside">
            <Panel title="Challenge settings">
              <div className="studio-form-stack">
                <Field label="Status" name="status">
                  <select
                    id="status"
                    name="status"
                    defaultValue={track?.status || "active"}
                  >
                    {[
                      "planned",
                      "active",
                      "paused",
                      "completed",
                      "archived",
                    ].map((status) => (
                      <option value={status} key={status}>
                        {status[0].toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field
                  label="Timezone"
                  name="timezone"
                  hint="Dates and weekly progress follow this timezone."
                >
                  <input
                    id="timezone"
                    name="timezone"
                    required
                    defaultValue={track?.timezone || "Africa/Addis_Ababa"}
                    list="timezones"
                  />
                  <datalist id="timezones">
                    <option value="Africa/Addis_Ababa" />
                    <option value="UTC" />
                    <option value="Europe/London" />
                    <option value="America/New_York" />
                  </datalist>
                </Field>
                <Field
                  label="Challenge URL"
                  name="slug"
                  hint={
                    track
                      ? "The URL stays the same when you edit."
                      : "Generated from your title."
                  }
                >
                  <input
                    id="slug"
                    name="slug"
                    readOnly={!!track}
                    defaultValue={track?.slug || ""}
                    placeholder={slugify(title) || "challenge-url"}
                  />
                </Field>
              </div>
            </Panel>
            <Panel>
              <p className="text-xs leading-7 text-[var(--j-muted)]">
                Check in when you work on this topic. Add a quick note or
                publish a related article whenever you have something to share.
              </p>
              <p className="mt-4 text-xs leading-7 text-[var(--j-muted)]">
                Progress counts distinct completed dates. Multiple entries on
                the same day count as one day.
              </p>
            </Panel>
          </aside>
        </div>
      </fieldset>
    </form>
  );
}

export function CheckInEditor({
  track,
  entry,
  pending,
  onBack,
  onDirty,
  onSave,
}: EditorProps & { track: ChallengeTrack; entry: Challenge | null }) {
  const today = todayInTimezone(track.timezone || "Africa/Addis_Ababa");
  const [notes, setNotes] = useState(entry?.learnings || "");
  const [preview, setPreview] = useState(false);
  return (
    <form onSubmit={(event) => submit(event, onSave)} onChange={onDirty}>
      <fieldset disabled={pending} className="contents">
        <input type="hidden" name="id" value={entry?.id || ""} />
        <input type="hidden" name="track_slug" value={track.slug} />
        <EditorHeader
          eyebrow="challenges"
          title={entry ? "Edit your check-in." : "Another step forward."}
          onBack={onBack}
        >
          <button
            className="studio-button studio-button-primary"
            disabled={pending}
            type="submit"
          >
            <FiCheck aria-hidden="true" />
            {pending ? "Saving…" : "Save check-in"}
          </button>
        </EditorHeader>
        <div className="studio-editor-grid">
          <Panel>
            <div className="studio-form-stack">
              <div className="border-b border-[var(--j-border)] pb-5">
                <p className="text-xs text-[var(--j-accent)]">{track.title}</p>
              </div>
              <Field label="What did you work on?" name="title">
                <input
                  id="title"
                  name="title"
                  required
                  maxLength={200}
                  defaultValue={entry?.title || ""}
                  placeholder="Give this session a title"
                />
              </Field>
              <Field
                label="A quick summary"
                name="summary"
                hint="Optional. A sentence or two is enough."
              >
                <textarea
                  id="summary"
                  name="summary"
                  rows={3}
                  maxLength={1000}
                  defaultValue={entry?.summary || ""}
                />
              </Field>
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <label htmlFor="learnings" className="text-xs text-[#c1ccda]">
                    Notes & takeaways{" "}
                    <span className="text-[var(--j-muted)]">(optional)</span>
                  </label>
                  <button
                    className="studio-text-button"
                    type="button"
                    onClick={() => setPreview(!preview)}
                  >
                    <FiEye aria-hidden="true" />
                    {preview ? "Write" : "Preview"}
                  </button>
                </div>
                <textarea
                  id="learnings"
                  name="learnings"
                  rows={12}
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  hidden={preview}
                  className="studio-editor-input studio-markdown-input !min-h-[260px]"
                  placeholder="What clicked? What would you try next? Markdown supported."
                />
                {preview && <MarkdownRenderer content={notes} />}
              </div>
            </div>
          </Panel>
          <aside className="studio-editor-aside">
            <Panel title="Session details">
              <div className="studio-form-stack">
                <Field
                  label="Completed on"
                  name="completed_date"
                  hint={`In ${track.timezone || "Africa/Addis_Ababa"}. You can record an earlier session.`}
                >
                  <input
                    id="completed_date"
                    name="completed_date"
                    type="date"
                    required
                    defaultValue={
                      entry?.completed_date ||
                      (track.end_date && track.end_date < today
                        ? track.end_date
                        : today)
                    }
                    min={track.start_date || undefined}
                    max={
                      track.end_date && track.end_date < today
                        ? track.end_date
                        : today
                    }
                  />
                </Field>
                <Field
                  label="Topics"
                  name="tags"
                  hint="Separate topics with commas."
                >
                  <input
                    id="tags"
                    name="tags"
                    maxLength={500}
                    defaultValue={entry?.tags?.join(", ") || ""}
                    placeholder="Add topics"
                  />
                </Field>
              </div>
            </Panel>
            <Panel>
              <p className="text-xs leading-7 text-[var(--j-muted)]">
                Your check-in appears on the challenge timeline. Write a related
                article separately when you want to explore a topic in depth.
              </p>
            </Panel>
          </aside>
        </div>
      </fieldset>
    </form>
  );
}

export function FocusEditor({
  status,
  pending,
  onBack,
  onDirty,
  onSave,
}: EditorProps & { status: NowStatus | null }) {
  const [progress, setProgress] = useState(status?.progress_percent || 0);
  return (
    <form onSubmit={(event) => submit(event, onSave)} onChange={onDirty}>
      <fieldset disabled={pending} className="contents">
        <EditorHeader
          eyebrow="overview"
          title="What has your attention?"
          onBack={onBack}
        >
          <button
            type="submit"
            className="studio-button studio-button-primary"
            disabled={pending}
          >
            <FiCheck aria-hidden="true" />
            {pending ? "Saving…" : "Save current focus"}
          </button>
        </EditorHeader>
        <div className="studio-editor-grid">
          <Panel title="Currently building">
            <div className="studio-form-stack">
              <Field label="Project or focus" name="active_project">
                <input
                  id="active_project"
                  name="active_project"
                  required
                  maxLength={200}
                  defaultValue={status?.active_project || ""}
                  placeholder="What are you working on?"
                />
              </Field>
              <Field label="Description" name="description">
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  required
                  maxLength={2000}
                  defaultValue={status?.description || ""}
                />
              </Field>
              <Field label="Current milestone" name="current_milestone">
                <input
                  id="current_milestone"
                  name="current_milestone"
                  required
                  maxLength={500}
                  defaultValue={status?.current_milestone || ""}
                />
              </Field>
              <Field
                label="Project link"
                name="project_url"
                hint="Optional. A repository, website, or project page."
              >
                <input
                  id="project_url"
                  name="project_url"
                  type="url"
                  defaultValue={status?.project_url || ""}
                  placeholder="https://"
                />
              </Field>
            </div>
          </Panel>
          <aside className="studio-editor-aside">
            <Panel title="Project status">
              <div className="studio-form-stack">
                <Field label="Status" name="status_label">
                  <select
                    id="status_label"
                    name="status_label"
                    defaultValue={status?.status_label || "Building"}
                  >
                    {["Building", "Exploring", "Shipped", "Paused"].map(
                      (label) => (
                        <option key={label}>{label}</option>
                      ),
                    )}
                  </select>
                </Field>
                <Field
                  label={`Milestone progress · ${progress}%`}
                  name="progress_percent"
                >
                  <input
                    id="progress_percent"
                    name="progress_percent"
                    type="range"
                    min={0}
                    max={100}
                    value={progress}
                    onChange={(event) =>
                      setProgress(Number(event.target.value))
                    }
                  />
                </Field>
              </div>
            </Panel>
            {status && (
              <Panel>
                <p className="text-xs leading-7 text-[var(--j-muted)]">
                  Last updated {formatDate(status.updated_at)}. Saving publishes
                  this update to your journal.
                </p>
              </Panel>
            )}
          </aside>
        </div>
      </fieldset>
    </form>
  );
}
