import React, { useState } from 'react';
import { ArrowRight, ExternalLink, Sparkles, Layers, ShieldCheck, Zap } from 'lucide-react';
import schoolImg from '../assets/project-school.jpg';
import jobsImg from '../assets/project-jobs.jpg';
import saasImg from '../assets/project-saas.jpg';

export default function OurWorkSection({ onOpenProjectDetails, onOpenAllWork }) {
  const projects = [
    {
      id: 'al-hidhaya',
      title: 'Brilliant Al Hidhaya School | Best School in Arasarukulam',
      category: 'website',
      year: '2026',
      desc: 'Rooted in the heart of Arasarukulam since 1995 – a legacy of academic excellence, holistic education, and modern campus infrastructure.',
      image: schoolImg,
      badgeColor: '#38bdf8',
      techStack: ['React 19', 'Next.js', 'Vite', 'Cloudflare Pages', 'SEO Optimization'],
      stats: '10k+ Monthly Visits • 99.8% PageSpeed',
      liveUrl: 'https://brilliant-alhidhaya.school',
    },
    {
      id: 'tamizha-jobs',
      title: 'Tamizha Jobs',
      category: 'app',
      year: '2025',
      desc: "A job portal built for Tamil Nadu's tier-2/tier-3 towns — telecalling, data entry, system admin, part-time and full-time local hiring.",
      image: jobsImg,
      badgeColor: '#2dd4bf',
      techStack: ['React', 'Node.js', 'PostgreSQL', 'WhatsApp API', 'Redis'],
      stats: '45,000+ Active Candidates • 1,200+ Employers',
      liveUrl: 'https://tamizhajobs.com',
    },
    {
      id: 'affylix-store',
      title: 'Affylix Store | One Link. Sell Anything Effortlessly.',
      category: 'saas',
      year: '2026',
      desc: 'A mobile-first social commerce storefront that turns creator social bio links into recurring digital product revenue with sub-second checkout.',
      image: saasImg,
      badgeColor: '#4ade80',
      techStack: ['React 19', 'Stripe Billing', 'Supabase', 'Serverless Functions', 'Tailwind'],
      stats: '$240k+ GMV Processed • 1.2s Checkout',
      liveUrl: 'https://affylix.store',
    },
  ];

  return (
    <section className="our-work-section" id="work" aria-labelledby="work-heading">
      <div className="our-work-container">
        {/* Section Header */}
        <div className="work-header-row">
          <div className="work-header-left">
            <span className="work-eyebrow">OUR WORK</span>
            <h2 id="work-heading" className="work-main-title">
              A few things we've built
            </h2>
            <p className="work-subtitle">
              Job boards, e-commerce sites, SaaS dashboards. Real projects we designed, built, and launched.
            </p>
          </div>

          <div className="work-header-right">
            <button
              onClick={onOpenAllWork}
              className="view-all-work-btn"
              aria-label="View all portfolio work"
            >
              <span>View all work</span>
              <ArrowRight size={16} className="btn-arrow-icon" />
            </button>
          </div>
        </div>

        {/* Project Cards Grid */}
        <div className="work-cards-grid">
          {projects.map((project) => (
            <article
              key={project.id}
              className="project-card"
              onClick={() => onOpenProjectDetails(project)}
            >
              {/* Card Image Banner */}
              <div className="project-image-wrapper">
                <img
                  src={project.image}
                  alt={project.title}
                  className="project-card-img"
                  loading="lazy"
                />
                <div className="project-image-overlay">
                  <span className="view-case-study-pill">
                    <span>View Project</span>
                    <ExternalLink size={13} />
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="project-card-body">
                {/* Meta Category & Year Tags */}
                <div className="project-tags-row">
                  <span
                    className="project-category-tag"
                    style={{
                      backgroundColor: `${project.badgeColor}20`,
                      color: project.badgeColor,
                      borderColor: `${project.badgeColor}40`,
                    }}
                  >
                    {project.category}
                  </span>
                  <span className="project-year-tag">{project.year}</span>
                </div>

                {/* Title */}
                <h3 className="project-title">{project.title}</h3>

                {/* Description */}
                <p className="project-desc">{project.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
