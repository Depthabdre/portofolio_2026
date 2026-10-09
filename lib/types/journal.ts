export type ProjectStatusLabel =
  "Building" | "Shipped" | "Exploring" | "Paused";
export type TrackStatus =
  "planned" | "active" | "paused" | "completed" | "archived";

export interface NowStatus {
  id: string;
  active_project: string;
  description: string;
  current_milestone: string;
  progress_percent: number;
  status_label: ProjectStatusLabel;
  project_url?: string | null;
  updated_at: string;
}

export interface ChallengeTrack {
  id: string;
  slug: string;
  title: string;
  category: string;
  duration: string;
  cadence: string;
  start_date?: string | null;
  end_date?: string | null;
  days_per_week?: number | null;
  preferred_days?: number[];
  timezone?: string;
  target_count: number;
  completed_count?: number;
  status: TrackStatus;
  description: string;
}

export interface Challenge {
  id: string;
  track_slug?: string | null;
  challenge_name: string;
  category?: string;
  day_number: number;
  title: string;
  summary: string;
  learnings: string;
  code_snippet?: string | null;
  tags: string[];
  completed_date: string;
  created_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image?: string | null;
  tags: string[];
  published: boolean;
  reading_time: string;
  views: number;
  created_at: string;
  updated_at: string;
  published_at?: string | null;
  archived_at?: string | null;
  track_slug?: string | null;
}

export interface JournalData {
  posts: BlogPost[];
  tracks: ChallengeTrack[];
  challenges: Challenge[];
  nowStatus: NowStatus | null;
  error: string | null;
}

export type ActionResult =
  { success: true; id?: string; slug?: string } | { error: string };
