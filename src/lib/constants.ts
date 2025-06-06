
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "aaa@gmail.com";
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "aaaaaa";
export const AUTH_COOKIE_NAME = "personal-hub-auth";

export const SITE_TITLE = "Personal Hub - Barkın Çeliker";
export const SITE_DESCRIPTION = "A showcase of projects, skills, and thoughts by Barkın Çeliker, a data analysis enthusiast and YBS student.";
export const AUTHOR_NAME = "Barkın Çeliker";

export const NAV_LINKS = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/#about", label: "Hakkımda" },
  { href: "/#projects", label: "Projelerim" },
  { href: "/#skills", label: "Yeteneklerim" },
  { href: "/#blog", label: "Blog Yazılarım" },
  { href: "/#contact", label: "İletişim" },
  { href: "/admin", label: "Admin" },
];

export const ADMIN_NAV_LINKS = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/dashboard/about", label: "About Page" },
  { href: "/admin/dashboard/projects", label: "Projects" },
  { href: "/admin/dashboard/blog", label: "Blog Posts" },
  { href: "/admin/dashboard/skills", label: "Skills" },
  { href: "/admin/dashboard/contact", label: "Messages" },
  { href: "/admin/dashboard/settings", label: "Settings"},
];


// Sample data (replace with actual data source or API calls)
// Made SKILLS_DATA mutable and added IDs for CRUD operations
export let SKILLS_DATA = [
  { id: "skill-1", name: "Data Analysis", level: 90, icon: "BarChart3" },
  { id: "skill-2", name: "Python", level: 85, icon: "Code" },
  { id: "skill-3", name: "SQL", level: 80, icon: "Database" },
  { id: "skill-4", name: "Tableau", level: 75, icon: "PieChart" },
  { id: "skill-5", name: "Excel", level: 95, icon: "FileSpreadsheet" },
  { id: "skill-6", name: "Web Scraping", level: 70, icon: "Search" },
];

// Made PROJECTS_DATA mutable for CRUD operations
export let PROJECTS_DATA = [
  {
    id: "1",
    title: "Customer Segmentation Analysis",
    description: "Analyzed customer data to identify distinct segments for targeted marketing strategies. Utilized Python and Scikit-learn.",
    imageUrl: "https://placehold.co/600x400.png",
    tags: ["Data Analysis", "Python", "Machine Learning"],
    dataAiHint: "data charts"
  },
  {
    id: "2",
    title: "Sales Performance Dashboard",
    description: "Developed an interactive dashboard using Tableau to visualize sales trends and key performance indicators.",
    imageUrl: "https://placehold.co/600x400.png",
    tags: ["Tableau", "Data Visualization", "BI"],
    dataAiHint: "dashboard interface"
  },
  {
    id: "3",
    title: "Web Scraper for Market Research",
    description: "Built a web scraper to gather competitive intelligence from various online sources for market analysis.",
    imageUrl: "https://placehold.co/600x400.png",
    tags: ["Python", "Web Scraping", "Data Collection"],
    dataAiHint: "code screen"
  },
];

// Made BLOG_POSTS_DATA mutable for CRUD operations
export let BLOG_POSTS_DATA = [
  {
    id: "1",
    slug: "the-importance-of-data-literacy",
    title: "The Importance of Data Literacy in Today's World",
    date: "2024-05-15",
    excerpt: "Exploring why understanding and interpreting data is a crucial skill for everyone, not just data professionals.",
    imageUrl: "https://placehold.co/600x400.png",
    content: "<p>Full blog post content about data literacy...</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p><h3>Key Aspects of Data Literacy</h3><ul><li>Understanding data sources</li><li>Interpreting charts and graphs</li><li>Asking the right questions from data</li><li>Communicating insights effectively</li></ul><p>Mastering these aspects can significantly enhance decision-making in any field.</p>",
    tags: ["Data Literacy", "Skills", "Education"],
    dataAiHint: "books data"
  },
  {
    id: "2",
    slug: "getting-started-with-python-for-data-analysis",
    title: "Getting Started with Python for Data Analysis",
    date: "2024-04-20",
    excerpt: "A beginner's guide to setting up Python and essential libraries like Pandas and NumPy for data analysis tasks.",
    imageUrl: "https://placehold.co/600x400.png",
    content: "<p>This guide will walk you through the initial steps of using Python for data analysis.</p><h4>Installation</h4><p>Ensure you have Python installed. Then, install necessary libraries:</p><pre><code>pip install pandas numpy matplotlib seaborn jupyter</code></pre><h4>Basic Pandas Operations</h4><p>Pandas is key for data manipulation. Here's how to read a CSV:</p><pre><code>import pandas as pd\ndf = pd.read_csv('your_data.csv')\nprint(df.head())</code></pre><p>Further topics include data cleaning, transformation, and visualization, which are fundamental for any data analyst.</p>",
    tags: ["Python", "Data Analysis", "Tutorial"],
    dataAiHint: "python code"
  },
];

// Made CONTACT_MESSAGES_DATA mutable
export let CONTACT_MESSAGES_DATA = [
   { id: "1", name: "Jane Doe", email: "jane@example.com", message: "Great portfolio! I'd love to connect.", receivedAt: new Date().toISOString() },
   { id: "2", name: "John Smith", email: "john@example.com", message: "Interested in your data analysis skills for a project.", receivedAt: new Date(Date.now() - 86400000).toISOString() },
];

// Made ABOUT_ME_CONTENT mutable
export let ABOUT_ME_CONTENT = {
  greeting: "Hello, I'm Barkın Çeliker",
  introduction: "I am a 3rd-year Management Information Systems (Yönetim Bilişim Sistemleri - YBS) student at Yaşar University, passionate about data analysis, business intelligence, and leveraging technology to solve real-world problems. My journey in YBS has equipped me with a strong foundation in both business processes and information technology, with a particular focus on how data can drive decision-making and innovation.",
  mission: "My goal is to transform raw data into actionable insights, helping organizations understand their performance, identify opportunities, and make informed strategic choices. I am constantly exploring new tools and techniques in the data science field to enhance my analytical capabilities.",
  skillsSummary: "I have hands-on experience with Python for data manipulation, SQL for database querying, and tools like Tableau for data visualization. I am eager to apply my skills in a professional setting and contribute to data-driven projects."
};
