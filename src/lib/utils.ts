import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import schoolImg from '../assets/project-school.jpg';
import jobsImg from '../assets/project-jobs.jpg';
import saasImg from '../assets/project-saas.jpg';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface CardItem {
  id: number;
  title: string;
  subtitle?: string;
  category?: string;
  year?: string;
  description: string;
  color: string;
  image?: string;
  techStack?: string[];
  stats?: string;
  liveUrl?: string;
}

export const cardData: CardItem[] = [
  {
    id: 1,
    title: "Brilliant Al Hidhaya School | Best School in Arasarukulam",
    subtitle: "Educational Institution Portal",
    category: "website",
    year: "2026",
    description: "Rooted in the heart of Arasarukulam since 1995 – a legacy of academic excellence, holistic education, and modern campus infrastructure.",
    color: "rgba(56, 189, 248, 0.8)",
    image: schoolImg,
    techStack: ["React 19", "Next.js", "Vite", "Cloudflare Pages"],
    stats: "10k+ Monthly Visits • 99.8% PageSpeed",
    liveUrl: "https://brilliant-alhidhaya.school"
  },
  {
    id: 2,
    title: "Tamizha Jobs",
    subtitle: "Find Jobs Across Tamil Nadu Faster Than Ever",
    category: "app",
    year: "2025",
    description: "A job portal built for Tamil Nadu's tier-2/tier-3 towns — telecalling, data entry, system admin, part-time and full-time hiring with WhatsApp notifications.",
    color: "rgba(45, 212, 191, 0.8)",
    image: jobsImg,
    techStack: ["React", "Node.js", "PostgreSQL", "WhatsApp API"],
    stats: "45,000+ Active Candidates • 1,200+ Employers",
    liveUrl: "https://tamizhajobs.com"
  },
  {
    id: 3,
    title: "Affylix Store | One Link. Sell Anything Effortlessly.",
    subtitle: "Creator Commerce & Bio Link Storefront",
    category: "saas",
    year: "2026",
    description: "A mobile-first social commerce storefront that turns creator social bio links into recurring digital product revenue with sub-second checkout.",
    color: "rgba(74, 222, 128, 0.8)",
    image: saasImg,
    techStack: ["React 19", "Stripe Billing", "Supabase", "Serverless"],
    stats: "$240k+ GMV Processed • 1.2s Checkout",
    liveUrl: "https://affylix.store"
  },
  {
    id: 4,
    title: "Apex Cloud Intelligence Platform",
    subtitle: "Enterprise Observability & AI Diagnostics",
    category: "saas",
    year: "2026",
    description: "Next-generation distributed infrastructure observability platform with AI telemetry, automated load balancing, and real-time anomaly alerts.",
    color: "rgba(168, 85, 247, 0.8)",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
    techStack: ["Next.js", "TypeScript", "Tailwind", "AWS Lambda"],
    stats: "99.99% Uptime • 2.4M Daily Events",
    liveUrl: "https://apexcloud.dev"
  }
];
