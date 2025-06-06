
// import HeroSection from '@/components/landing/HeroSection';
// import AboutSectionPreview from '@/components/landing/AboutSectionPreview';
// import ProjectsSectionPreview from '@/components/landing/ProjectsSectionPreview';
// import SkillsSection from '@/components/landing/SkillsSection';
// import BlogSectionPreview from '@/components/landing/BlogSectionPreview';
// import ContactSection from '@/components/landing/ContactSection';
// import { getSkills, getProjects, getBlogPosts } from '@/lib/actions/adminActions';
// import type { Skill, Project, BlogPost } from '@/types';

export default async function HomePage() {
  // const currentSkillsData: Skill[] = await getSkills();
  // const currentProjectsData: Project[] = await getProjects();
  // const currentBlogPostsData: BlogPost[] = await getBlogPosts();

  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1>Test: Ana Sayfa Yükleniyor mu?</h1>
      <p>Eğer bu yazıyı görüyorsanız, temel sayfa oluşturma işlemi çalışıyor demektir.</p>
      <p>Sorun, yorum satırı haline getirilen bileşenlerden veya veri çekme işlemlerinden birinde olabilir.</p>
    </div>
    // <>
    //   <HeroSection />
    //   <AboutSectionPreview />
    //   <ProjectsSectionPreview projects={currentProjectsData} />
    //   <SkillsSection skills={currentSkillsData} />
    //   <BlogSectionPreview posts={currentBlogPostsData} />
    //   <ContactSection />
    // </>
  );
}
