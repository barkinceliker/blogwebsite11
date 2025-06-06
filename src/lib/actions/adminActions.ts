
'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { login as loginUser, logout as logoutUser } from '@/lib/auth';
import type { Project, BlogPost, AboutMeContent, Skill, ContactMessage } from '@/types';
import { firestore } from '@/lib/firebase';
import {
  collection, getDocs, getDoc, doc, addDoc, updateDoc, deleteDoc, query, where, orderBy, Timestamp, setDoc
} from 'firebase/firestore';
import { DEFAULT_ABOUT_ME_CONTENT } from '@/lib/constants';

// Helper to convert Firestore Timestamps to ISO strings if they exist
const convertTimestamps = (data: any) => {
  const newData = { ...data };
  for (const key in newData) {
    if (newData[key] instanceof Timestamp) {
      newData[key] = (newData[key] as Timestamp).toDate().toISOString();
    }
  }
  return newData;
};

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
  try {
    const projectsCol = collection(firestore, 'projects');
    const q = query(projectsCol, orderBy('createdAt', 'desc'));
    const projectsSnapshot = await getDocs(q);
    const projectsList = projectsSnapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...convertTimestamps(docSnap.data()),
    } as Project));
    return projectsList;
  } catch (error) {
    console.error("[Server Action] Error fetching projects from Firestore:", error);
    return [];
  }
}

export async function getProjectById(id: string): Promise<Project | undefined> {
  try {
    const projectDocRef = doc(firestore, 'projects', id);
    const docSnap = await getDoc(projectDocRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...convertTimestamps(docSnap.data()) } as Project;
    }
    return undefined;
  } catch (error) {
    console.error(`[Server Action] Error fetching project ${id} from Firestore:`, error);
    return undefined;
  }
}

export async function createProject(formData: FormData): Promise<{ success: boolean; error?: string, data?: Project }> {
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const imageUrl = formData.get('imageUrl') as string;
  const tags = formData.get('tags') as string;

  if (!title || !description) {
    return { success: false, error: "Title and description are required." };
  }
  const newProjectData = {
    title,
    description,
    imageUrl: imageUrl || 'https://placehold.co/600x400.png',
    tags: tags ? tags.split(',').map(t => t.trim()) : [],
    dataAiHint: title.toLowerCase().split(' ').slice(0,2).join(' ') || "new project",
    createdAt: Timestamp.now()
  };
  try {
    const docRef = await addDoc(collection(firestore, 'projects'), newProjectData);
    const createdProject = { id: docRef.id, ...newProjectData, createdAt: newProjectData.createdAt.toDate().toISOString() } as Project;
    revalidatePath('/admin/dashboard/projects');
    revalidatePath('/projects');
    revalidatePath('/');
    return { success: true, data: createdProject };
  } catch (error: any) {
    console.error("[Server Action] Error creating project in Firestore:", error);
    return { success: false, error: error.message || `Failed to create project in Firestore. Details: ${error.toString()}` };
  }
}

export async function updateProject(id: string, formData: FormData): Promise<{ success: boolean; error?: string, data?: Project }> {
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const imageUrl = formData.get('imageUrl') as string;
  const tags = formData.get('tags') as string;

  if (!title || !description) {
    return { success: false, error: "Title and description are required." };
  }
  const projectDocRef = doc(firestore, 'projects', id);
  const updatedProjectData = {
    title,
    description,
    imageUrl: imageUrl || 'https://placehold.co/600x400.png',
    tags: tags ? tags.split(',').map(t => t.trim()) : [],
    dataAiHint: title.toLowerCase().split(' ').slice(0,2).join(' ') || "updated project"
  };
  try {
    await updateDoc(projectDocRef, updatedProjectData);
    const updatedProject = {id, ...updatedProjectData } as Project;
    revalidatePath('/admin/dashboard/projects');
    revalidatePath(`/admin/dashboard/projects/edit/${id}`);
    revalidatePath('/projects');
    revalidatePath('/');
    return { success: true, data: updatedProject };
  } catch (error: any) {
    console.error(`[Server Action] Error updating project ${id} in Firestore:`, error);
    return { success: false, error: error.message || `Failed to update project ${id} in Firestore. Details: ${error.toString()}` };
  }
}

export async function deleteProject(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const projectDocRef = doc(firestore, 'projects', id);
    await deleteDoc(projectDocRef);
    revalidatePath('/admin/dashboard/projects');
    revalidatePath('/projects');
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    console.error(`[Server Action] Error deleting project ${id} from Firestore:`, error);
    return { success: false, error: error.message || `Failed to delete project ${id} from Firestore. Details: ${error.toString()}` };
  }
}

// BlogPost CRUD actions
export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const postsCol = collection(firestore, 'blogPosts');
    const q = query(postsCol, orderBy('date', 'desc'));
    const postsSnapshot = await getDocs(q);
    const postsList = postsSnapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...convertTimestamps(docSnap.data()),
    } as BlogPost));
    return postsList;
  } catch (error) {
    console.error("[Server Action] Error fetching blog posts from Firestore:", error);
    return [];
  }
}

export async function getBlogPostById(id: string): Promise<BlogPost | undefined> {
 try {
    const postDocRef = doc(firestore, 'blogPosts', id);
    const docSnap = await getDoc(postDocRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...convertTimestamps(docSnap.data()) } as BlogPost;
    }
    return undefined;
  } catch (error) {
    console.error(`[Server Action] Error fetching blog post ${id} from Firestore:`, error);
    return undefined;
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  try {
    const postsCol = collection(firestore, 'blogPosts');
    const q = query(postsCol, where('slug', '==', slug));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const docSnap = querySnapshot.docs[0];
      return { id: docSnap.id, ...convertTimestamps(docSnap.data()) } as BlogPost;
    }
    return undefined;
  } catch (error) {
    console.error(`[Server Action] Error fetching blog post by slug ${slug} from Firestore:`, error);
    return undefined;
  }
}


export async function createBlogPost(formData: FormData): Promise<{ success: boolean; error?: string, data?: BlogPost }> {
  const title = formData.get('title') as string;
  const slug = formData.get('slug') as string;
  const dateString = formData.get('date') as string;
  const excerpt = formData.get('excerpt') as string;
  const content = formData.get('content') as string;
  const imageUrl = formData.get('imageUrl') as string;
  const tags = formData.get('tags') as string;

  if (!title || !slug || !content || !dateString || !excerpt) {
    return { success: false, error: "Title, slug, date, excerpt, and content are required." };
  }
  let parsedDate;
  try {
    parsedDate = new Date(dateString);
    if (isNaN(parsedDate.getTime())) {
        throw new Error('Invalid date format');
    }
  } catch(e) {
    return { success: false, error: "Invalid date format provided for blog post."};
  }

  const newPostData = {
    title,
    slug,
    date: Timestamp.fromDate(parsedDate),
    excerpt,
    content,
    imageUrl: imageUrl || 'https://placehold.co/600x400.png',
    tags: tags ? tags.split(',').map(t => t.trim()) : [],
    dataAiHint: title.toLowerCase().split(' ').slice(0,2).join(' ') || "new blog"
  };
  try {
    const docRef = await addDoc(collection(firestore, 'blogPosts'), newPostData);
    const createdPost = { ...newPostData, id: docRef.id, date: newPostData.date.toDate().toISOString() } as BlogPost;
    revalidatePath('/admin/dashboard/blog');
    revalidatePath('/blog');
    revalidatePath(`/blog/${slug}`);
    revalidatePath('/');
    return { success: true, data: createdPost };
  } catch (error: any) {
    console.error("[Server Action] Error creating blog post in Firestore:", error);
    return { success: false, error: error.message || `Failed to create blog post in Firestore. Details: ${error.toString()}` };
  }
}

export async function updateBlogPost(id: string, formData: FormData): Promise<{ success: boolean; error?: string, data?: BlogPost }> {
  const title = formData.get('title') as string;
  const slug = formData.get('slug') as string;
  const dateString = formData.get('date') as string;
  const excerpt = formData.get('excerpt') as string;
  const content = formData.get('content') as string;
  const imageUrl = formData.get('imageUrl') as string;
  const tags = formData.get('tags') as string;

  if (!title || !slug || !content || !dateString || !excerpt) {
    return { success: false, error: "Title, slug, date, excerpt and content are required." };
  }
  let parsedDate;
  try {
    parsedDate = new Date(dateString);
    if (isNaN(parsedDate.getTime())) {
        throw new Error('Invalid date format');
    }
  } catch(e) {
    return { success: false, error: "Invalid date format provided for blog post update."};
  }

  const postDocRef = doc(firestore, 'blogPosts', id);
  const updatedPostData = {
    title,
    slug,
    date: Timestamp.fromDate(parsedDate),
    excerpt,
    content,
    imageUrl: imageUrl || 'https://placehold.co/600x400.png',
    tags: tags ? tags.split(',').map(t => t.trim()) : [],
    dataAiHint: title.toLowerCase().split(' ').slice(0,2).join(' ') || "updated blog"
  };
  try {
    await updateDoc(postDocRef, updatedPostData);
    const updatedPost = { ...updatedPostData, id, date: updatedPostData.date.toDate().toISOString() } as BlogPost;
    revalidatePath('/admin/dashboard/blog');
    revalidatePath(`/admin/dashboard/blog/edit/${id}`);
    revalidatePath('/blog');
    revalidatePath(`/blog/${slug}`);
    revalidatePath('/');
    return { success: true, data: updatedPost };
  } catch (error: any) {
    console.error(`[Server Action] Error updating blog post ${id} in Firestore:`, error);
    return { success: false, error: error.message || `Failed to update blog post ${id} in Firestore. Details: ${error.toString()}` };
  }
}

export async function deleteBlogPost(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const postDocRef = doc(firestore, 'blogPosts', id);
    const postSnap = await getDoc(postDocRef);
    const slug = postSnap.exists() ? (postSnap.data() as BlogPost).slug : undefined;

    await deleteDoc(postDocRef);
    revalidatePath('/admin/dashboard/blog');
    revalidatePath('/blog');
    if (slug) revalidatePath(`/blog/${slug}`);
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    console.error(`[Server Action] Error deleting blog post ${id} from Firestore:`, error);
    return { success: false, error: error.message || `Failed to delete blog post ${id} from Firestore. Details: ${error.toString()}` };
  }
}

// AboutMeContent actions
const ABOUT_ME_DOC_ID = 'aboutMeDetails';
const SITE_CONFIG_COLLECTION = 'siteConfig';


export async function getAboutMeContent(): Promise<AboutMeContent> {
  try {
    const aboutMeDocRef = doc(firestore, SITE_CONFIG_COLLECTION, ABOUT_ME_DOC_ID);
    const docSnap = await getDoc(aboutMeDocRef);
    if (docSnap.exists()) {
      return docSnap.data() as AboutMeContent;
    }
    // If it doesn't exist, create it with default content
    console.log(`[Server Action] AboutMeContent not found, creating with default for ${SITE_CONFIG_COLLECTION}/${ABOUT_ME_DOC_ID}`);
    await setDoc(aboutMeDocRef, DEFAULT_ABOUT_ME_CONTENT);
    return DEFAULT_ABOUT_ME_CONTENT;
  } catch (error: any) {
    console.error("[Server Action] Error fetching/creating AboutMeContent from Firestore:", error);
    if (error.code === 'permission-denied' || error.code === 'PERMISSION_DENIED') {
      console.error("[Server Action] Firestore permission denied for AboutMeContent. Check rules for path:", `${SITE_CONFIG_COLLECTION}/${ABOUT_ME_DOC_ID}`);
    }
    return DEFAULT_ABOUT_ME_CONTENT;
  }
}

export async function updateAboutMeContent(formData: FormData): Promise<{ success: boolean; error?: string, data?: AboutMeContent }> {
  const greeting = formData.get('greeting') as string;
  const introduction = formData.get('introduction') as string;
  const mission = formData.get('mission') as string;
  const skillsSummary = formData.get('skillsSummary') as string;

  if (!greeting || !introduction || !mission || !skillsSummary) {
    return { success: false, error: "All fields for About Me are required." };
  }
  const aboutMeData: AboutMeContent = { greeting, introduction, mission, skillsSummary };
  try {
    const aboutMeDocRef = doc(firestore, SITE_CONFIG_COLLECTION, ABOUT_ME_DOC_ID);
    await setDoc(aboutMeDocRef, aboutMeData, { merge: true });
    revalidatePath('/admin/dashboard/about');
    revalidatePath('/about');
    revalidatePath('/');
    return { success: true, data: aboutMeData };
  } catch (error: any) {
    console.error("[Server Action] Error updating AboutMeContent in Firestore:", error);
    return { success: false, error: error.message || `Failed to update About Me content in Firestore. Details: ${error.toString()}` };
  }
}

// Contact Messages actions
export async function getContactMessages(): Promise<ContactMessage[]> {
  try {
    const messagesCol = collection(firestore, 'contactMessages');
    const q = query(messagesCol, orderBy('receivedAt', 'desc'));
    const messagesSnapshot = await getDocs(q);
    const messagesList = messagesSnapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...convertTimestamps(docSnap.data()),
    } as ContactMessage));
    return messagesList;
  } catch (error) {
    console.error("[Server Action] Error fetching contact messages from Firestore:", error);
    return [];
  }
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
  const newMessageData = {
    name,
    email,
    message,
    receivedAt: Timestamp.now()
  };
  try {
    await addDoc(collection(firestore, 'contactMessages'), newMessageData);
    revalidatePath('/admin/dashboard/contact');
    return { success: true };
  } catch (error: any) {
    console.error("[Server Action] Error submitting contact form to Firestore:", error);
    return { success: false, error: error.message || `Failed to submit contact message to Firestore. Details: ${error.toString()}` };
  }
}

// Skills CRUD Actions
export async function getSkills(): Promise<Skill[]> {
  try {
    const skillsCol = collection(firestore, 'skills');
    const q = query(skillsCol, orderBy('name', 'asc'));
    const skillsSnapshot = await getDocs(q);
    const skillsList = skillsSnapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data(),
    } as Skill));
    return skillsList;
  } catch (error) {
    console.error("[Server Action] Error fetching skills from Firestore:", error);
    return [];
  }
}

export async function getSkillById(id: string): Promise<Skill | undefined> {
  try {
    const skillDocRef = doc(firestore, 'skills', id);
    const docSnap = await getDoc(skillDocRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Skill;
    }
    return undefined;
  } catch (error) {
    console.error(`[Server Action] Error fetching skill ${id} from Firestore:`, error);
    return undefined;
  }
}

export async function createSkill(formData: FormData): Promise<{ success: boolean; error?: string, data?: Skill }> {
  const name = formData.get('name') as string;
  const levelStr = formData.get('level') as string;
  const icon = formData.get('icon') as string;

  if (!name || !levelStr || !icon) {
    return { success: false, error: "Name, level, and icon are required." };
  }
  const level = parseInt(levelStr, 10);
  if (isNaN(level) || level < 0 || level > 100) {
    return { success: false, error: "Level must be a number between 0 and 100." };
  }

  const newSkillData: Omit<Skill, 'id'> = {
    name,
    level,
    icon: icon as any
  };
  try {
    const docRef = await addDoc(collection(firestore, 'skills'), newSkillData);
    const createdSkill = { ...newSkillData, id: docRef.id } as Skill;
    revalidatePath('/admin/dashboard/skills');
    revalidatePath('/about');
    revalidatePath('/');
    return { success: true, data: createdSkill };
  } catch (error: any) {
    console.error("[Server Action] Error creating skill in Firestore:", error);
    return { success: false, error: error.message || `Failed to create skill in Firestore. Details: ${error.toString()}` };
  }
}

export async function updateSkill(id: string, formData: FormData): Promise<{ success: boolean; error?: string, data?: Skill }> {
  const name = formData.get('name') as string;
  const levelStr = formData.get('level') as string;
  const icon = formData.get('icon') as string;

  if (!name || !levelStr || !icon) {
    return { success: false, error: "Name, level, and icon are required." };
  }
  const level = parseInt(levelStr, 10);
  if (isNaN(level) || level < 0 || level > 100) {
    return { success: false, error: "Level must be a number between 0 and 100." };
  }

  const skillDocRef = doc(firestore, 'skills', id);
  const updatedSkillData: Omit<Skill, 'id'> = {
    name,
    level,
    icon: icon as any
  };
  try {
    await updateDoc(skillDocRef, updatedSkillData);
    const updatedSkill = { ...updatedSkillData, id } as Skill;
    revalidatePath('/admin/dashboard/skills');
    revalidatePath(`/admin/dashboard/skills/edit/${id}`);
    revalidatePath('/about');
    revalidatePath('/');
    return { success: true, data: updatedSkill };
  } catch (error: any) {
    console.error(`[Server Action] Error updating skill ${id} in Firestore:`, error);
    return { success: false, error: error.message || `Failed to update skill ${id} in Firestore. Details: ${error.toString()}` };
  }
}

export async function deleteSkill(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const skillDocRef = doc(firestore, 'skills', id);
    await deleteDoc(skillDocRef);
    revalidatePath('/admin/dashboard/skills');
    revalidatePath('/about');
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    console.error(`[Server Action] Error deleting skill ${id} from Firestore:`, error);
    return { success: false, error: error.message || `Failed to delete skill ${id} from Firestore. Details: ${error.toString()}` };
  }
}
