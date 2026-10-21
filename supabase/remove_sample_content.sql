-- Remove only the original seed examples. Review before running against an existing project.
-- These statements never run automatically from the application.
begin;

delete from public.posts
where slug = 'structuring-clean-architecture'
  and title = 'Structuring Clean Architecture in Real-World Projects'
  and excerpt = 'A practical guide to organizing data, domain, and presentation layers for scalable applications.'
  and content like '%When growing a codebase beyond a prototype, separation of concerns is critical%';

delete from public.challenges
where track_slug = 'systems-web'
  and title = 'Understanding Async Request Boundaries in Next.js 16'
  and summary = 'Explored how Next.js 16 enforces asynchronous cookies and headers handling to improve server component streaming.';

delete from public.challenge_tracks t
where ((slug = 'leetcode-60' and title = 'LeetCode & Problem Solving Sprint'
        and description = 'Practicing algorithms and data structures daily to sharpen competitive problem-solving velocity across graphs, dynamic programming, and trees.')
    or (slug = 'flutter-architecture' and title = 'Flutter Production Architecture'
        and description = 'Structuring production Flutter apps with strict clean architecture boundaries, BLoC state management, and offline-first repository synchronization.')
    or (slug = 'systems-web' and title = 'Next.js 16 & Server Systems'
        and description = 'Exploring asynchronous request contracts, streaming partial prerendering, and zero-allocation parser optimizations.'))
  and not exists (select 1 from public.challenges c where c.track_slug = t.slug)
  and not exists (select 1 from public.posts p where p.track_slug = t.slug);

delete from public.now_status
where active_project = 'Mobile & Full-Stack Systems'
  and description = 'Working on Flutter architecture, state management patterns, and full-stack backend integrations.'
  and current_milestone = 'Refactoring API integration layer and offline caching'
  and progress_percent = 70;

commit;
