export type Mood =
  | "happy"
  | "calm"
  | "neutral"
  | "sad"
  | "anxious"
  | "angry"
  | "tired"
  | "empty";

export type Journal = {
  id: string;
  user_id: string;
  mood: Mood;
  intensity: number;
  note: string | null;
  journal_date: string;
  created_at: string;
  updated_at: string;
};

export type Profile = {
  id: string;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type JournalFactor = {
  id: string;
  journal_id: string;
  factor: string;
};

export type JournalTag = {
  id: string;
  journal_id: string;
  tag: string;
};

export type JournalActivity = {
  id: string;
  journal_id: string;
  activity: string;
};
