# Journal Studio setup

The journal shows real database content only. An empty database produces intentional empty states. A failed connection produces an error, never sample content or a successful save.

## Database

- New project: run `schema.sql` in the Supabase SQL editor.
- Existing project using the original schema: run `migrations/202610210001_journal_studio.sql` instead. It adds schedules, article/challenge links, publication dates, and archive support without changing existing URLs. Legacy challenges keep their original dates unset until you edit them.
- If the original seed examples were installed, review and run `remove_sample_content.sql`. It matches the original examples explicitly and keeps challenges that contain other entries or linked articles.

No seed data is included in the application or new-project schema.

### Missing tables (`PGRST205`)

This means the Supabase API cannot find the requested tables in its schema cache. For a new project, run the complete `schema.sql` file in that project's SQL editor. It creates `posts`, `challenge_tracks`, `challenges`, and `now_status` without adding sample content. Make sure this is the same project as `SUPABASE_URL` (or `NEXT_PUBLIC_SUPABASE_URL`) in `.env.local`.

If you already created the tables, verify they are in the `public` schema and run:

```sql
notify pgrst, 'reload schema';
```

Then refresh the journal. The setup and migration scripts also request this reload automatically. Before setup is complete, the public journal shows its empty state; admin displays setup instructions. Unexpected connection and permission failures still display an error.

## Environment

Set these on the server (locally in `.env.local`):

```dotenv
SUPABASE_URL=
SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SECRET_KEY=
ADMIN_PASSWORD=
```

The journal reads its data on the server, so it accepts Supabase's variable names directly. `SUPABASE_JWKS_URL` is not needed for this app. Keep your existing `ADMIN_PASSWORD` value.

The previous names `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` remain supported. The current names take precedence when both are set. Secret keys must never have a `NEXT_PUBLIC_` prefix or be used in browser code. If you use the optional browser client, it requires the `NEXT_PUBLIC_` URL and publishable key names.

The admin uses the existing single-owner password flow. There is no default password. Signing in creates an expiring, signed, HTTP-only session; the password is never stored in the session cookie. Every admin query and mutation checks that session before creating the server-only service client. Public clients have read access to visible content; the old policy that gave every Supabase authenticated user write access is removed by the migration. Add rate limiting at your hosting ingress before exposing the password endpoint publicly.

Restart the dev server after changing environment variables. Visit `/admin/login`, sign in, and check that the header reads **Connected**.

## Writing and challenges

- Articles can stay in drafts, be previewed privately in the editor, published, unpublished, edited, archived, and restored. Reading time is calculated from the content. Original publication dates and saved URLs remain stable when editing.
- A challenge has explicit calendar dates, an IANA timezone, a target number of completed dates, and 1–7 days per week. Preferred weekdays are optional. A calendar month is represented by its actual dates rather than assumed to be four weeks.
- Check-ins have an editable completion date and optional Markdown notes. Multiple check-ins on one date count as one completed day. Weekly progress uses Monday–Sunday in the challenge timezone. Editing a check-in recalculates progress; the old manual `completed_count` is no longer used.
- An article may link to a challenge without creating a check-in. Publishing and practice progress are independent.
- Archive actions retain content. Draft and archived articles are excluded from public queries and protected by database policies.

## Verification

```sh
npm run build
node --test tests/journal.test.mjs
```

To verify the connected workflow, create a draft, preview and publish it, refresh, then create a dated challenge and a backdated check-in. Log a second entry on that date and confirm the total stays at one. Archive and restore the article and challenge. With a missing key or disconnected database, saving must show an error and keep the editor content.
