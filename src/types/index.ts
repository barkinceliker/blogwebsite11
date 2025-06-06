import type { LucideIcon } from "lucide-react";

export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  tags: string[];
  dataAiHint?: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  imageUrl: string;
  content: string; // HTML content
  tags: string[];
  dataAiHint?: string;
}

export interface Skill {
  name: string;
  level: number; // Percentage 0-100
  icon: keyof typeof import("lucide-react") | string; // Lucide icon name or path to custom SVG
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  receivedAt: string; // ISO date string
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
