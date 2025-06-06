
'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { login as loginUser, logout as logoutUser } from '@/lib/auth';
import type { Project, BlogPost, AboutMeContent, Skill, ContactMessage } from '@/types';
import { PROJECTS_DATA, BLOG_POSTS_DATA, ABOUT_ME_CONTENT, SKILLS_DATA, CONTACT_MESSAGES_DATA } from '@/lib/constants';

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

// Project CRUD actions
export async function getProjects(): Promise<Project[]> {
  console.log('[Server Action] getProjects called');
  return PROJECTS_DATA;
}

export async function getProjectById(id: string): Promise<Project | undefined> {
  console.log(`[Server Action] getProjectById called for id: ${id}`);
  return PROJECTS_DATA.find(p => p.id === id);
}

export async function createProject(formData: FormData): Promise<{ success: boolean; error?: string, data?: Project }> {
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const imageUrl = formData.get('imageUrl') as string;
  const tags = formData.get('tags') as string;
  
  if (!title || !description) {
    return { success: false, error: "Title and description are required." };
  }
  const newProject: Project = { 
    id: `project-${Date.now().toString()}`, 
    title, 
    description, 
    imageUrl: imageUrl || 'https://placehold.co/600x400.png', 
    tags: tags ? tags.split(',').map(t => t.trim()) : [], 
    dataAiHint: title.toLowerCase().split(' ').slice(0,2).join(' ') || "new project" 
  };
  PROJECTS_DATA.unshift(newProject); // Add to the beginning
  console.log('[Server Action] createProject called with data:', newProject);
  revalidatePath('/admin/dashboard/projects');
  revalidatePath('/projects');
  revalidatePath('/');
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
  const projectIndex = PROJECTS_DATA.findIndex(p => p.id === id);
  if (projectIndex === -1) {
    return { success: false, error: "Project not found." };
  }
  const updatedProject: Project = { 
    id, 
    title, 
    description, 
    imageUrl: imageUrl || 'https://placehold.co/600x400.png', 
    tags: tags ? tags.split(',').map(t => t.trim()) : [],
    dataAiHint: title.toLowerCase().split(' ').slice(0,2).join(' ') || "updated project" 
  };
  PROJECTS_DATA[projectIndex] = updatedProject;
  console.log(`[Server Action] updateProject called for id: ${id} with data:`, updatedProject);
  revalidatePath('/admin/dashboard/projects');
  revalidatePath(`/admin/dashboard/projects/edit/${id}`);
  revalidatePath('/projects');
  revalidatePath('/');
  return { success: true, data: updatedProject };
}

export async function deleteProject(id: string): Promise<{ success: boolean; error?: string }> {
  const initialLength = PROJECTS_DATA.length;
  const filteredProjects = PROJECTS_DATA.filter(p => p.id !== id);
  if (filteredProjects.length === initialLength) {
     return { success: false, error: "Project not found for deletion." };
  }
  // @ts-ignore
  PROJECTS_DATA = filteredProjects; // Reassign to update the array if it's 'let'
  console.log(`[Server Action] deleteProject called for id: ${id}`);
  revalidatePath('/admin/dashboard/projects');
  revalidatePath('/projects');
  revalidatePath('/');
  return { success: true };
}

// BlogPost CRUD actions
export async function getBlogPosts(): Promise<BlogPost[]> {
  console.log('[Server Action] getBlogPosts called');
  return BLOG_POSTS_DATA;
}

export async function getBlogPostById(id: string): Promise<BlogPost | undefined> {
  console.log(`[Server Action] getBlogPostById called for id: ${id}`);
  return BLOG_POSTS_DATA.find(p => p.id === id);
}

export async function createBlogPost(formData: FormData): Promise<{ success: boolean; error?: string, data?: BlogPost }> {
  const title = formData.get('title') as string;
  const slug = formData.get('slug') as string;
  const date = formData.get('date') as string; // Expecting ISO string or YYYY-MM-DD
  const excerpt = formData.get('excerpt') as string;
  const content = formData.get('content') as string;
  const imageUrl = formData.get('imageUrl') as string;
  const tags = formData.get('tags') as string;

  if (!title || !slug || !content || !date || !excerpt) {
    return { success: false, error: "Title, slug, date, excerpt, and content are required." };
  }
  const newPost: BlogPost = { 
    id: `blog-${Date.now().toString()}`, 
    title, 
    slug, 
    date: new Date(date).toISOString(), 
    excerpt, 
    content, 
    imageUrl: imageUrl || 'https://placehold.co/600x400.png', 
    tags: tags ? tags.split(',').map(t => t.trim()) : [],
    dataAiHint: title.toLowerCase().split(' ').slice(0,2).join(' ') || "new blog"
  };
  BLOG_POSTS_DATA.unshift(newPost);
  console.log('[Server Action] createBlogPost called with data:', newPost);
  revalidatePath('/admin/dashboard/blog');
  revalidatePath('/blog');
  revalidatePath(`/blog/${slug}`);
  revalidatePath('/');
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

  if (!title || !slug || !content || !date || !excerpt) {
    return { success: false, error: "Title, slug, date, excerpt and content are required." };
  }
  const postIndex = BLOG_POSTS_DATA.findIndex(p => p.id === id);
  if (postIndex === -1) {
    return { success: false, error: "Blog post not found." };
  }
  const updatedPost: BlogPost = { 
    id, 
    title, 
    slug, 
    date: new Date(date).toISOString(), 
    excerpt, 
    content, 
    imageUrl: imageUrl || 'https://placehold.co/600x400.png', 
    tags: tags ? tags.split(',').map(t => t.trim()) : [],
    dataAiHint: title.toLowerCase().split(' ').slice(0,2).join(' ') || "updated blog"
  };
  BLOG_POSTS_DATA[postIndex] = updatedPost;
  console.log(`[Server Action] updateBlogPost called for id: ${id} with data:`, updatedPost);
  revalidatePath('/admin/dashboard/blog');
  revalidatePath(`/admin/dashboard/blog/edit/${id}`);
  revalidatePath('/blog');
  revalidatePath(`/blog/${slug}`);
  revalidatePath('/');
  return { success: true, data: updatedPost };
}

export async function deleteBlogPost(id: string): Promise<{ success: boolean; error?: string }> {
  const postToDelete = BLOG_POSTS_DATA.find(p => p.id === id);
  if (!postToDelete) {
    return { success: false, error: "Blog post not found for deletion." };
  }
  const slug = postToDelete.slug;
  // @ts-ignore
  BLOG_POSTS_DATA = BLOG_POSTS_DATA.filter(p => p.id !== id);
  console.log(`[Server Action] deleteBlogPost called for id: ${id}`);
  revalidatePath('/admin/dashboard/blog');
  revalidatePath('/blog');
  revalidatePath(`/blog/${slug}`); // Revalidate specific slug page
  revalidatePath('/');
  return { success: true };
}

// AboutMeContent actions
export async function getAboutMeContent(): Promise<AboutMeContent> {
  console.log('[Server Action] getAboutMeContent called');
  return ABOUT_ME_CONTENT;
}

export async function updateAboutMeContent(formData: FormData): Promise<{ success: boolean; error?: string, data?: AboutMeContent }> {
  const greeting = formData.get('greeting') as string;
  const introduction = formData.get('introduction') as string;
  const mission = formData.get('mission') as string;
  const skillsSummary = formData.get('skillsSummary') as string;
  
  if (!greeting || !introduction || !mission || !skillsSummary) {
    return { success: false, error: "All fields for About Me are required." };
  }
  // @ts-ignore - Directly mutating the imported 'constant' for demo purposes
  ABOUT_ME_CONTENT.greeting = greeting;
  // @ts-ignore
  ABOUT_ME_CONTENT.introduction = introduction;
  // @ts-ignore
  ABOUT_ME_CONTENT.mission = mission;
  // @ts-ignore
  ABOUT_ME_CONTENT.skillsSummary = skillsSummary;
  
  console.log('[Server Action] updateAboutMeContent called with data:', ABOUT_ME_CONTENT);
  revalidatePath('/admin/dashboard/about');
  revalidatePath('/about');
  revalidatePath('/');
  return { success: true, data: { ...ABOUT_ME_CONTENT } };
}

// Contact Messages actions
export async function getContactMessages(): Promise<ContactMessage[]> {
  console.log('[Server Action] getContactMessages called');
  return CONTACT_MESSAGES_DATA;
}

export async function submitContactForm(formData: FormData): Promise<{ success: boolean; error?: string }> {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const message = formData.get('message') as string;

  if (!name || !email || !message) {
    return { success: false, error: "All fields are required." };
  }
  if (!/\S+@\S+\.\S+/.test(email)) {
    return { success: false, error: "Invalid email format." };
  }
  const newMessage: ContactMessage = {
    id: `msg-${Date.now().toString()}`,
    name,
    email,
    message,
    receivedAt: new Date().toISOString()
  };
  CONTACT_MESSAGES_DATA.unshift(newMessage);
  console.log(`[Server Action] New contact message from ${name} (${email}): ${message}`);
  revalidatePath('/admin/dashboard/contact');
  return { success: true };
}

// Skills CRUD Actions
export async function getSkills(): Promise<Skill[]> {
  console.log('[Server Action] getSkills called');
  return SKILLS_DATA;
}

export async function getSkillById(id: string): Promise<Skill | undefined> {
  console.log(`[Server Action] getSkillById called for id: ${id}`);
  return SKILLS_DATA.find(s => s.id === id);
}

export async function createSkill(formData: FormData): Promise<{ success: boolean; error?: string, data?: Skill }> {
  const name = formData.get('name') as string;
  const level = parseInt(formData.get('level') as string, 10);
  const icon = formData.get('icon') as string;

  if (!name || isNaN(level) || !icon) {
    return { success: false, error: "Name, a valid level, and icon are required." };
  }
  if (level < 0 || level > 100) {
    return { success: false, error: "Level must be between 0 and 100." };
  }

  const newSkill: Skill = { 
    id: `skill-${Date.now().toString()}`, 
    name, 
    level, 
    icon: icon as any // Assuming icon is a valid LucideIcon name string
  };
  SKILLS_DATA.push(newSkill);
  console.log('[Server Action] createSkill called with data:', newSkill);
  revalidatePath('/admin/dashboard/skills');
  revalidatePath('/about'); // Skills are on about page
  revalidatePath('/'); // Skills are on home page
  return { success: true, data: newSkill };
}

export async function updateSkill(id: string, formData: FormData): Promise<{ success: boolean; error?: string, data?: Skill }> {
  const name = formData.get('name') as string;
  const level = parseInt(formData.get('level') as string, 10);
  const icon = formData.get('icon') as string;

  if (!name || isNaN(level) || !icon) {
    return { success: false, error: "Name, a valid level, and icon are required." };
  }
   if (level < 0 || level > 100) {
    return { success: false, error: "Level must be between 0 and 100." };
  }

  const skillIndex = SKILLS_DATA.findIndex(s => s.id === id);
  if (skillIndex === -1) {
    return { success: false, error: "Skill not found." };
  }

  const updatedSkill: Skill = { 
    id, 
    name, 
    level, 
    icon: icon as any 
  };
  SKILLS_DATA[skillIndex] = updatedSkill;
  console.log(`[Server Action] updateSkill called for id: ${id} with data:`, updatedSkill);
  revalidatePath('/admin/dashboard/skills');
  revalidatePath(`/admin/dashboard/skills/edit/${id}`);
  revalidatePath('/about');
  revalidatePath('/');
  return { success: true, data: updatedSkill };
}

export async function deleteSkill(id: string): Promise<{ success: boolean; error?: string }> {
  const initialLength = SKILLS_DATA.length;
  // @ts-ignore
  SKILLS_DATA = SKILLS_DATA.filter(s => s.id !== id);
  if (SKILLS_DATA.length === initialLength) {
    return { success: false, error: "Skill not found for deletion." };
  }
  console.log(`[Server Action] deleteSkill called for id: ${id}`);
  revalidatePath('/admin/dashboard/skills');
  revalidatePath('/about');
  revalidatePath('/');
  return { success: true };
}
