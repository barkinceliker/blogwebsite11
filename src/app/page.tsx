
import HeroSection from '@/components/landing/HeroSection';
import AboutSectionPreview from '@/components/landing/AboutSectionPreview';
import ProjectsSectionPreview from '@/components/landing/ProjectsSectionPreview';
import SkillsSection from '@/components/landing/SkillsSection';
import BlogSectionPreview from '@/components/landing/BlogSectionPreview';
import ContactSection from '@/components/landing/ContactSection';
import { getAboutMeContent, getSkills, getProjects, getBlogPosts } from '@/lib/actions/adminActions';
import type { Skill, Project, BlogPost, AboutMeContent } from '@/types';

export default async function HomePage() {
  const aboutMeData: AboutMeContent = await getAboutMeContent();
  const currentSkillsData: Skill[] = await getSkills();
  const currentProjectsData: Project[] = await getProjects();
  const currentBlogPostsData: BlogPost[] = await getBlogPosts();

  return (
    <>
      <HeroSection aboutMe={aboutMeData} />
      <AboutSectionPreview />
      <ProjectsSectionPreview projects={currentProjectsData} />
      <SkillsSection skills={currentSkillsData} />
      <BlogSectionPreview posts={currentBlogPostsData} />
      <ContactSection />
    </>
  );
}

