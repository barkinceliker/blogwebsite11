import HeroSection from '@/components/landing/HeroSection';
import AboutSectionPreview from '@/components/landing/AboutSectionPreview';
import ProjectsSectionPreview from '@/components/landing/ProjectsSectionPreview';
import SkillsSection from '@/components/landing/SkillsSection';
import BlogSectionPreview from '@/components/landing/BlogSectionPreview';
import ContactSection from '@/components/landing/ContactSection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSectionPreview />
      <ProjectsSectionPreview />
      <SkillsSection />
      <BlogSectionPreview />
      <ContactSection />
    </>
  );
}
