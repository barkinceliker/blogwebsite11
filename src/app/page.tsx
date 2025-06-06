
import HeroSection from '@/components/landing/HeroSection';
import AboutSectionPreview from '@/components/landing/AboutSectionPreview';
import ProjectsSectionPreview from '@/components/landing/ProjectsSectionPreview';
import SkillsSection from '@/components/landing/SkillsSection';
import BlogSectionPreview from '@/components/landing/BlogSectionPreview';
import ContactSection from '@/components/landing/ContactSection';
import { SKILLS_DATA, PROJECTS_DATA, BLOG_POSTS_DATA } from '@/lib/constants';
import type { Skill, Project, BlogPost } from '@/types';

export default function HomePage() {
  const currentSkillsData: Skill[] = SKILLS_DATA;
  const currentProjectsData: Project[] = PROJECTS_DATA;
  const currentBlogPostsData: BlogPost[] = BLOG_POSTS_DATA;

  return (
    <>
      <HeroSection />
      <AboutSectionPreview />
      <ProjectsSectionPreview projects={currentProjectsData} />
      <SkillsSection skills={currentSkillsData} />
      <BlogSectionPreview posts={currentBlogPostsData} />
      <ContactSection />
    </>
  );
}
