'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { login as loginUser, logout as logoutUser } from '@/lib/auth';
import type { Project, BlogPost, AboutMeContent } from '@/types';

export async function handleLogin(formData: FormData) {
  const result = await loginUser(formData);
  if (result.success) {
    redirect('/admin/dashboard');
  }
  return result;
}

export async function handleLogout() {
  await logoutUser();
  redirect('/admin');
}

// Placeholder CRUD actions
export async function getProjects(): Promise<Project[]> {
  // In a real app, fetch from database
  console.log('[Server Action] getProjects called');
  const { PROJECTS_DATA } = await import('@/lib/constants');
  return PROJECTS_DATA;
}

export async function getProjectById(id: string): Promise<Project | undefined> {
  console.log(`[Server Action] getProjectById called for id: ${id}`);
  const { PROJECTS_DATA } = await import('@/lib/constants');
  return PROJECTS_DATA.find(p => p.id === id);
}

export async function createProject(formData: FormData): Promise<{ success: boolean; error?: string, data?: Project }> {
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const imageUrl = formData.get('imageUrl') as string;
  const tags = formData.get('tags') as string;
  
  // Basic validation
  if (!title || !description) {
    return { success: false, error: "Title and description are required." };
  }
  const newProject: Project = { id: Date.now().toString(), title, description, imageUrl, tags: tags.split(',').map(t => t.trim()), dataAiHint: "new project" };
  console.log('[Server Action] createProject called with data:', newProject);
  // In a real app, save to database
  revalidatePath('/admin/dashboard/projects');
  return { success: true, data: newProject };
}

export async function updateProject(id: string, formData: FormData): Promise<{ success: boolean; error?: string, data?: Project }> {
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const imageUrl = formData.get('imageUrl') as string;
  const tags = formData.get('tags') as string;

  if (!title || !description) {
    return { success: false, error: "Title and description are required." };
  }
  const updatedProject: Project = { id, title, description, imageUrl, tags: tags.split(',').map(t => t.trim()), dataAiHint: "updated project" };
  console.log(`[Server Action] updateProject called for id: ${id} with data:`, updatedProject);
  // In a real app, update in database
  revalidatePath('/admin/dashboard/projects');
  revalidatePath(`/admin/dashboard/projects/edit/${id}`);
  return { success: true, data: updatedProject };
}

export async function deleteProject(id: string): Promise<{ success: boolean; error?: string }> {
  console.log(`[Server Action] deleteProject called for id: ${id}`);
  // In a real app, delete from database
  revalidatePath('/admin/dashboard/projects');
  return { success: true };
}


export async function getBlogPosts(): Promise<BlogPost[]> {
  console.log('[Server Action] getBlogPosts called');
  const { BLOG_POSTS_DATA } = await import('@/lib/constants');
  return BLOG_POSTS_DATA;
}

export async function getBlogPostById(id: string): Promise<BlogPost | undefined> {
  console.log(`[Server Action] getBlogPostById called for id: ${id}`);
  const { BLOG_POSTS_DATA } = await import('@/lib/constants');
  return BLOG_POSTS_DATA.find(p => p.id === id);
}

export async function createBlogPost(formData: FormData): Promise<{ success: boolean; error?: string, data?: BlogPost }> {
  const title = formData.get('title') as string;
  const slug = formData.get('slug') as string;
  const date = formData.get('date') as string;
  const excerpt = formData.get('excerpt') as string;
  const content = formData.get('content') as string;
  const imageUrl = formData.get('imageUrl') as string;
  const tags = formData.get('tags') as string;

  if (!title || !slug || !content) {
    return { success: false, error: "Title, slug, and content are required." };
  }
  const newPost: BlogPost = { id: Date.now().toString(), title, slug, date, excerpt, content, imageUrl, tags: tags.split(',').map(t => t.trim()), dataAiHint: "new blog" };
  console.log('[Server Action] createBlogPost called with data:', newPost);
  revalidatePath('/admin/dashboard/blog');
  return { success: true, data: newPost };
}

export async function updateBlogPost(id: string, formData: FormData): Promise<{ success: boolean; error?: string, data?: BlogPost }> {
  const title = formData.get('title') as string;
  const slug = formData.get('slug') as string;
  const date = formData.get('date') as string;
  const excerpt = formData.get('excerpt') as string;
  const content = formData.get('content') as string;
  const imageUrl = formData.get('imageUrl') as string;
  const tags = formData.get('tags') as string;

  if (!title || !slug || !content) {
    return { success: false, error: "Title, slug, and content are required." };
  }
  const updatedPost: BlogPost = { id, title, slug, date, excerpt, content, imageUrl, tags: tags.split(',').map(t => t.trim()), dataAiHint: "updated blog" };
  console.log(`[Server Action] updateBlogPost called for id: ${id} with data:`, updatedPost);
  revalidatePath('/admin/dashboard/blog');
  revalidatePath(`/admin/dashboard/blog/edit/${id}`);
  return { success: true, data: updatedPost };
}

export async function deleteBlogPost(id: string): Promise<{ success: boolean; error?: string }> {
  console.log(`[Server Action] deleteBlogPost called for id: ${id}`);
  revalidatePath('/admin/dashboard/blog');
  return { success: true };
}

export async function getAboutMeContent(): Promise<AboutMeContent> {
  console.log('[Server Action] getAboutMeContent called');
  const { ABOUT_ME_CONTENT } = await import('@/lib/constants');
  return ABOUT_ME_CONTENT;
}

export async function updateAboutMeContent(formData: FormData): Promise<{ success: boolean; error?: string, data?: AboutMeContent }> {
  const greeting = formData.get('greeting') as string;
  const introduction = formData.get('introduction') as string;
  const mission = formData.get('mission') as string;
  const skillsSummary = formData.get('skillsSummary') as string;
  
  if (!greeting || !introduction) {
    return { success: false, error: "Greeting and introduction are required." };
  }
  const updatedContent: AboutMeContent = { greeting, introduction, mission, skillsSummary };
  console.log('[Server Action] updateAboutMeContent called with data:', updatedContent);
  // In a real app, save to database/CMS
  // For now, we might update a constant or log, but this won't persist across sessions with current setup
  // To make it persist for demo, one might write to a local JSON file (not recommended for production)
  // Or, if constants are mutable (not ideal), update them. For now, just log and revalidate.
  revalidatePath('/admin/dashboard/about');
  revalidatePath('/about'); // Revalidate public about page
  return { success: true, data: updatedContent };
}

export async function getContactMessages() {
  console.log('[Server Action] getContactMessages called');
  const { CONTACT_MESSAGES_DATA } = await import('@/lib/constants');
  return CONTACT_MESSAGES_DATA;
}

export async function submitContactForm(formData: FormData): Promise<{ success: boolean; error?: string }> {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const message = formData.get('message') as string;

  if (!name || !email || !message) {
    return { success: false, error: "All fields are required." };
  }
  // Basic email validation
  if (!/\S+@\S+\.\S+/.test(email)) {
    return { success: false, error: "Invalid email format." };
  }

  console.log(`[Server Action] New contact message from ${name} (${email}): ${message}`);
  // In a real app, save to database and/or send an email notification
  // For demo, we could add to CONTACT_MESSAGES_DATA if it were mutable or stored elsewhere
  revalidatePath('/admin/dashboard/contact');
  return { success: true };
}
