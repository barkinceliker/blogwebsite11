
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@example.com";
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "password";
export const AUTH_COOKIE_NAME = "personal-hub-auth";

export const SITE_TITLE = "Personal Hub - Barkın Çeliker";
export const SITE_DESCRIPTION = "Welcome to the personal hub of Barkın Çeliker, showcasing projects, skills, blog, and contact information. A data analysis enthusiast and MIS student.";
export const AUTHOR_NAME = "Barkın Çeliker";

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/#about", label: "About Me" },
  { href: "/#projects", label: "Projects" },
  { href: "/#skills", label: "Skills" },
  { href: "/#blog", label: "Blog" },
  { href: "/#contact", label: "Contact" },
  { href: "/admin", label: "Admin" },
];

export const ADMIN_NAV_LINKS = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/dashboard/about", label: "About Page" },
  { href: "/admin/dashboard/projects", label: "Projects" },
  { href: "/admin/dashboard/blog", label: "Blog Posts" },
  { href: "/admin/dashboard/skills", label: "Skills" },
  { href: "/admin/dashboard/contact", label: "Messages" },
  { href: "/admin/dashboard/cv", label: "CV" }, // Added CV link
  { href: "/admin/dashboard/settings", label: "Settings"},
];

export const DEFAULT_ABOUT_ME_CONTENT = {
  greeting: "Hello, I'm Barkın Çeliker",
  introduction: "I am a 3rd-year Management Information Systems (MIS) student at Yaşar University, passionate about data analysis, business intelligence, and leveraging technology to solve real-world problems. My journey in MIS has equipped me with a strong foundation in both business processes and information technology, with a particular focus on how data can drive decision-making and innovation.",
  mission: "My goal is to transform raw data into actionable insights, helping organizations understand their performance, identify opportunities, and make informed strategic choices. I am constantly exploring new tools and techniques in the data science field to enhance my analytical capabilities.",
  skillsSummary: "I have hands-on experience with Python for data manipulation, SQL for database querying, and tools like Tableau for data visualization. I am eager to apply my skills in a professional setting and contribute to data-driven projects."
};

// Firestore collection and document IDs for site configuration
export const SITE_CONFIG_COLLECTION = "siteConfig";
export const ABOUT_ME_DOC_ID = "aboutMeDetails"; // Document ID for About Me content
