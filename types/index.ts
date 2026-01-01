export interface UserStreak {
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_activity_at: string | null;
}

export interface User {
  id: string;
  full_name: string;
  username: string;
  email: string;
  avatar_url?: string;
  role: string;
  xp: number;
  level: number;
  created_at?: string;
  is_verified?: boolean;
  is_premium?: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  video_url: string | null;
  created_at: string;
  is_active: boolean;
}

export interface Course {
  id: string;
  title: string;
  thumbnail_url: string | null;
  total_lessons: number;
  completed_lessons: number;
  progress_percentage: number;
  last_accessed: string;
  level: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}