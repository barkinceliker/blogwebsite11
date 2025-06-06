
import HeroSection from '@/components/landing/HeroSection';
import AboutSectionPreview from '@/components/landing/AboutSectionPreview';
import ProjectsSectionPreview from '@/components/landing/ProjectsSectionPreview';
import SkillsSection from '@/components/landing/SkillsSection';
import BlogSectionPreview from '@/components/landing/BlogSectionPreview';
import ContactSection from '@/components/landing/ContactSection';
import { getSkills, getProjects, getBlogPosts, getAboutMeContent } from '@/lib/actions/adminActions';
import type { Skill, Project, BlogPost, AboutMeContent } from '@/types';

export default async function HomePage() {
  const currentSkillsData: Skill[] = await getSkills();
  const currentProjectsData: Project[] = await getProjects();
  const currentBlogPostsData: BlogPost[] = await getBlogPosts();
  // AboutMeContent is used by HeroSection and AboutSectionPreview indirectly via constants or direct fetch
  // For HeroSection, it uses ABOUT_ME_CONTENT.greeting from constants. This might need adjustment if greeting becomes dynamic.
  // For AboutSectionPreview, it will fetch its own data.

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
