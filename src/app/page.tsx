
import HeroSection from '@/components/landing/HeroSection';
import AboutSectionPreview from '@/components/landing/AboutSectionPreview';
import ProjectsSectionPreview from '@/components/landing/ProjectsSectionPreview';
import SkillsSection from '@/components/landing/SkillsSection';
import BlogSectionPreview from '@/components/landing/BlogSectionPreview';
import ContactSection from '@/components/landing/ContactSection';
import { SKILLS_DATA } from '@/lib/constants';
import type { Skill } from '@/types';

export default function HomePage() {
  const currentSkillsData: Skill[] = SKILLS_DATA;

  return (
    <>
      <HeroSection />
      <AboutSectionPreview />
      <ProjectsSectionPreview />
      <SkillsSection skills={currentSkillsData} />
      <BlogSectionPreview />
      <ContactSection />
    </>
  );
}
