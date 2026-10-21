import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import test from "node:test";
import ts from "typescript";

const require = createRequire(import.meta.url);
function loadTypeScript(path, mocks = {}) {
  const source = readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  });
  const module = { exports: {} };
  new Function("require", "module", "exports", outputText)(
    (name) => (name in mocks ? mocks[name] : require(name)),
    module,
    module.exports,
  );
  return module.exports;
}

const journal = loadTypeScript("lib/journal.ts");
const databaseErrors = loadTypeScript("lib/supabase/errors.ts");
const track = {
  slug: "test-track",
  target_count: 12,
  days_per_week: 3,
  cadence: "3x / week",
  timezone: "Africa/Addis_Ababa",
  start_date: "2026-10-01",
  end_date: "2026-10-31",
};
const entry = (completed_date) => ({ track_slug: track.slug, completed_date });

test("calendar months and four-week schedules produce different suggestions", () => {
  assert.equal(journal.dateRangeDays("2026-10-01", "2026-10-31"), 31);
  assert.equal(journal.suggestedTarget("2026-10-01", "2026-10-28", 3), 12);
  assert.equal(journal.suggestedTarget("2026-10-01", "2026-10-31", 3), 14);
  assert.equal(journal.suggestedTarget("2026-10-01", "2026-10-31", 7), 31);
});

test("preferred weekdays calculate actual occurrences across partial weeks", () => {
  assert.equal(
    journal.suggestedTarget("2026-10-01", "2026-10-31", 3, [1, 3, 5]),
    13,
  );
  assert.equal(
    journal.suggestedTarget("2026-10-01", "2026-10-28", 3, [1, 3, 5]),
    12,
  );
});

test("multiple check-ins on one date count as one completed day", () => {
  const progress = journal.trackProgress(
    track,
    [
      entry("2026-10-19"),
      entry("2026-10-19"),
      entry("2026-10-20"),
      { ...entry("2026-10-21"), track_slug: "another" },
    ],
    new Date("2026-10-21T12:00:00Z"),
  );
  assert.deepEqual(progress, { completed: 2, weekly: 2, percent: 17 });
});

test("weekly progress follows the challenge timezone at the Monday boundary", () => {
  const entries = [entry("2026-10-18"), entry("2026-10-19")];
  const now = new Date("2026-10-18T22:30:00Z");
  assert.equal(
    journal.todayInTimezone("Africa/Addis_Ababa", now),
    "2026-10-19",
  );
  assert.equal(journal.trackProgress(track, entries, now).weekly, 1);
  assert.equal(
    journal.trackProgress(
      { ...track, timezone: "America/Los_Angeles" },
      entries,
      now,
    ).weekly,
    1,
  );
});

test("progress ignores other challenges and entries outside the challenge dates", () => {
  const progress = journal.trackProgress(
    track,
    [entry("2026-09-30"), entry("2026-11-01"), entry("2026-10-20")],
    new Date("2026-10-21T12:00:00Z"),
  );
  assert.equal(progress.completed, 1);
  assert.equal(
    journal.trackProgress({ ...track, target_count: 1 }, [
      entry("2026-10-19"),
      entry("2026-10-20"),
    ]).percent,
    100,
  );
});

test("editing a check-in date recomputes the derived progress", () => {
  const before = journal.trackProgress(track, [
    entry("2026-10-19"),
    entry("2026-10-20"),
  ]);
  const after = journal.trackProgress(track, [
    entry("2026-10-19"),
    entry("2026-10-19"),
  ]);
  assert.equal(before.completed, 2);
  assert.equal(after.completed, 1);
});

test("publication dates and reading time use real record content", () => {
  assert.equal(
    journal.postDate({ published: false, created_at: "2026-01-01" }),
    null,
  );
  assert.equal(
    journal.postDate({
      published: true,
      published_at: "2026-10-21",
      created_at: "2026-01-01",
    }),
    "2026-10-21",
  );
  assert.equal(journal.readingTime("word ".repeat(441)), "3 min read");
  assert.equal(journal.formatDate("not-a-date"), "");
});

function actions({ authenticated = true, client = null } = {}) {
  return loadTypeScript("app/admin/actions.ts", {
    "next/headers": { cookies: async () => ({ delete() {} }) },
    "next/cache": { revalidatePath() {} },
    "next/navigation": {
      redirect: (value) => {
        throw new Error(`redirect:${value}`);
      },
    },
    "@/lib/admin-auth": { isAdmin: async () => authenticated },
    "@/lib/supabase/server": { createAdminSupabaseClient: async () => client },
    "@/lib/supabase/errors": databaseErrors,
    "@/lib/journal": journal,
  });
}

test("unauthenticated mutations never reach the database", async () => {
  let touched = false;
  const result = await actions({
    authenticated: false,
    client: {
      from() {
        touched = true;
      },
    },
  }).savePostAction(new FormData());
  assert.match(result.error, /session has ended/);
  assert.equal(touched, false);
});

test("a missing database connection cannot report a successful save", async () => {
  const result = await actions().savePostAction(new FormData());
  assert.match(result.error, /not connected/);
  assert.equal("success" in result, false);
});

test("drafts require a title and published posts require content", async () => {
  const action = actions({ client: {} });
  assert.match((await action.savePostAction(new FormData())).error, /title/);
  const form = new FormData();
  form.set("title", "A real title");
  form.set("intent", "publish");
  assert.match((await action.savePostAction(form)).error, /content/);
});

test("challenge schedules reject invalid dates and mismatched weekday commitments", async () => {
  const form = new FormData();
  for (const [key, value] of Object.entries({
    title: "A challenge",
    start_date: "2026-02-30",
    end_date: "2026-03-30",
    days_per_week: "3",
    target_count: "12",
  }))
    form.set(key, value);
  const action = actions({ client: {} });
  assert.match((await action.saveTrackAction(form)).error, /valid date/);
  form.set("start_date", "2026-03-01");
  form.append("preferred_days", "1");
  assert.match(
    (await action.saveTrackAction(form)).error,
    /preferred weekdays/,
  );
});

test("admin sessions are signed, expire, and reject tampered tokens", async () => {
  const originalPassword = process.env.ADMIN_PASSWORD;
  process.env.ADMIN_PASSWORD = "test-password-only";
  let token;
  const auth = loadTypeScript("lib/admin-auth.ts", {
    "server-only": {},
    "next/headers": {
      cookies: async () => ({
        get: () => (token ? { value: token } : undefined),
        set: (_name, value) => {
          token = value;
        },
      }),
    },
  });
  try {
    assert.equal(await auth.isAdmin(), false);
    await auth.createAdminSession();
    assert.equal(token.includes(process.env.ADMIN_PASSWORD), false);
    assert.equal(await auth.isAdmin(), true);
    const valid = token;
    token = token.replace(/^\d+/, "1");
    assert.equal(await auth.isAdmin(), false);
    token = `${valid.slice(0, -1)}${valid.endsWith("a") ? "b" : "a"}`;
    assert.equal(await auth.isAdmin(), false);
    process.env.ADMIN_PASSWORD = "rotated-password";
    token = valid;
    assert.equal(await auth.isAdmin(), false);
  } finally {
    if (originalPassword === undefined) delete process.env.ADMIN_PASSWORD;
    else process.env.ADMIN_PASSWORD = originalPassword;
  }
});

async function withQueries(code, callback) {
  const environment = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  };
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "test-public-key";
  const response = {
    data: null,
    error: { code, message: "Test database response" },
  };
  const client = {
    from() {
      const query = {
        select() {
          return this;
        },
        order() {
          return this;
        },
        eq() {
          return this;
        },
        neq() {
          return this;
        },
        is() {
          return this;
        },
        limit() {
          return this;
        },
        maybeSingle() {
          return Promise.resolve(response);
        },
        then(resolve, reject) {
          return Promise.resolve(response).then(resolve, reject);
        },
      };
      return query;
    },
  };
  const queries = loadTypeScript("lib/supabase/queries.ts", {
    "server-only": {},
    react: { cache: (fn) => fn },
    "@supabase/supabase-js": { createClient: () => client },
    "./server": { createAdminSupabaseClient: async () => client },
    "./errors": databaseErrors,
  });
  try {
    await callback(queries);
  } finally {
    for (const [key, value] of Object.entries(environment)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
}

test("missing journal tables show empty public content without a console overlay", async (t) => {
  const errorLog = t.mock.method(console, "error", () => {});
  const warningLog = t.mock.method(console, "warn", () => {});
  await withQueries("PGRST205", async (queries) => {
    assert.deepEqual(await queries.getJournalData(), {
      posts: [],
      tracks: [],
      challenges: [],
      nowStatus: null,
      error: null,
    });
    assert.equal(await queries.getBlogPostBySlug("not-published"), null);
  });
  assert.equal(errorLog.mock.callCount(), 0);
  assert.equal(warningLog.mock.callCount(), 0);
});

test("admin distinguishes missing tables from a schema needing migration", async (t) => {
  t.mock.method(console, "error", () => {});
  t.mock.method(console, "warn", () => {});
  await withQueries("PGRST205", async (queries) => {
    const data = await queries.getJournalData(true);
    assert.match(data.error, /supabase\/schema\.sql/);
  });
  await withQueries("PGRST204", async (queries) => {
    const data = await queries.getJournalData(true);
    assert.match(data.error, /migrations\/202610210001_journal_studio\.sql/);
  });
});

test("authentication and connection failures remain visible instead of looking empty", async (t) => {
  t.mock.method(console, "warn", () => {});
  for (const code of ["PGRST301", "PGRST003", "42501"]) {
    await withQueries(code, async (queries) => {
      const data = await queries.getJournalData();
      assert.match(data.error, /temporarily unavailable/);
      await assert.rejects(
        queries.getBlogPostBySlug("a-post"),
        /could not be loaded/,
      );
    });
  }
});

for (const mode of ["current", "legacy"]) {
  test(`${mode} Supabase variable names support publishing and public reads`, async () => {
    const names = [
      "SUPABASE_URL",
      "SUPABASE_PUBLISHABLE_KEY",
      "SUPABASE_SECRET_KEY",
      "NEXT_PUBLIC_SUPABASE_URL",
      "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      "SUPABASE_SERVICE_ROLE_KEY",
    ];
    const original = Object.fromEntries(
      names.map((name) => [name, process.env[name]]),
    );
    for (const name of names) delete process.env[name];
    const url = "https://test.supabase.co";
    const publishable = "test-publishable-key";
    const secret = "test-secret-key";
    if (mode === "current") {
      process.env.SUPABASE_URL = url;
      process.env.SUPABASE_PUBLISHABLE_KEY = publishable;
      process.env.SUPABASE_SECRET_KEY = secret;
    } else {
      process.env.NEXT_PUBLIC_SUPABASE_URL = url;
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = publishable;
      process.env.SUPABASE_SERVICE_ROLE_KEY = secret;
    }
    const calls = [];
    const client = {
      from() {
        return {
          select() {
            return this;
          },
          eq() {
            return this;
          },
          is() {
            return this;
          },
          maybeSingle() {
            return Promise.resolve({ data: null, error: null });
          },
        };
      },
    };
    const createClient = (address, key) => {
      calls.push([address, key]);
      return client;
    };
    try {
      const server = loadTypeScript("lib/supabase/server.ts", {
        "server-only": {},
        "@supabase/ssr": { createServerClient: createClient },
        "@supabase/supabase-js": { createClient },
        "next/headers": { cookies: async () => ({ getAll: () => [] }) },
        "@/lib/admin-auth": { isAdmin: async () => true },
      });
      assert.equal(await server.createAdminSupabaseClient(), client);
      assert.equal(await server.createServerSupabaseClient(), client);
      const queries = loadTypeScript("lib/supabase/queries.ts", {
        "server-only": {},
        react: { cache: (fn) => fn },
        "@supabase/supabase-js": { createClient },
        "./server": server,
        "./errors": databaseErrors,
      });
      assert.equal(await queries.getBlogPostBySlug("not-published"), null);
      assert.deepEqual(calls, [
        [url, secret],
        [url, publishable],
        [url, publishable],
      ]);
    } finally {
      for (const [name, value] of Object.entries(original)) {
        if (value === undefined) delete process.env[name];
        else process.env[name] = value;
      }
    }
  });
}
