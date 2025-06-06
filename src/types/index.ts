
import type { LucideIcon } from "lucide-react";

export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  tags: string[];
  dataAiHint?: string;
  createdAt?: string; // Firestore timestamp as ISO string
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  date: string; // Firestore timestamp as ISO string
  excerpt: string;
  imageUrl: string;
  content: string; // HTML content
  tags: string[];
  dataAiHint?: string;
}

export interface Skill {
  id: string;
  name: string;
  level: number; // Percentage 0-100
  icon: keyof typeof import("lucide-react") | string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  receivedAt: string; // Firestore timestamp as ISO string
}

export interface UserSession {
  email: string;
  name: string;
  isAuthenticated: boolean;
  loginTimestamp?: number;
}

export interface AboutMeContent {
  greeting: string;
  introduction: string;
  mission: string;
  skillsSummary: string;
}

export interface CvInfo {
    filename: string | null;
    exists: boolean;
    downloadUrl: string | null;
    error?: string;
}
