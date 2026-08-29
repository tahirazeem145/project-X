import React from 'react';
import { X, Sparkles, BookOpen, HelpCircle, Code2, Check, ArrowRight } from 'lucide-react';

export default function InfoModal({ activeTab, onClose, onOpenBookCall }) {
  if (!activeTab) return null;

  const contentMap = {
    'why-us': {
      title: 'Why Choose gme Developers?',
      subtitle: 'We blend product mindset with top 1% engineering execution.',
      icon: <Sparkles size={24} color="#0a8898" />,
      items: [
        {
          title: 'Speed to Market',
          desc: 'From concept to deployed production MVP in 2 to 4 weeks without compromising quality or scalability.',
        },
        {
          title: 'Senior Engineers Only',
          desc: 'Direct collaboration with seasoned full-stack engineers and product architects—no junior hand-offs.',
        },
        {
          title: 'Full Intellectual Property',
          desc: 'You retain 100% ownership of source code, designs, and cloud infrastructure from day one.',
        },
        {
          title: 'Battle-Tested Tech Stack',
          desc: 'Modern React, Next.js, Node, TypeScript, Cloud Native, scalable databases and best UX practices.',
        },
      ],
      ctaText: 'Start Your Project With Us',
    },
    'blog': {
      title: 'Engineering & Product Insights',
      subtitle: 'Practical guides, teardowns, and modern software strategies.',
      icon: <BookOpen size={24} color="#0a8898" />,
      items: [
        {
          title: 'How to build and ship an MVP in under 30 days',
          desc: 'The exact framework we use to take founder ideas from wireframe to revenue.',
        },
        {
          title: 'Choosing the right database: PostgreSQL vs DynamoDB vs Supabase',
          desc: 'A pragmatic comparison for early-stage startups and high-scale apps.',
        },
        {
          title: 'Optimizing React 19 web performance for sub-second load times',
          desc: 'Core web vitals, server components, and asset compression techniques.',
        },
      ],
      ctaText: 'Explore All Articles',
    },
    'courses': {
      title: 'Masterclass Developer Programs',
      subtitle: 'Upskill your engineering team or master full-stack application development.',
      icon: <Code2 size={24} color="#0a8898" />,
      items: [
        {
          title: 'Advanced Full-Stack SaaS Architecture',
          desc: 'Authentication, Stripe billing, multi-tenancy, background workers, and automated CI/CD.',
        },
        {
          title: 'Modern Mobile App Development with React Native',
          desc: 'Building performant cross-platform iOS and Android apps with native feel.',
        },
        {
          title: 'AI Engineering: Building Production LLM Apps',
          desc: 'RAG pipelines, vector embeddings, fine-tuning, and low-latency agents.',
        },
      ],
      ctaText: 'Join Next Cohort',
    },
    'faq': {
      title: 'Frequently Asked Questions',
      subtitle: 'Everything you need to know about working with gme Developers.',
      icon: <HelpCircle size={24} color="#0a8898" />,
      items: [
        {
          title: 'How fast can you start on our project?',
          desc: 'Typically within 3 to 5 business days after our discovery kickoff call.',
        },
        {
          title: 'Do you work with fixed price or hourly rates?',
          desc: 'We offer transparent fixed-price milestones for defined scopes, and agile sprint retainer models for evolving products.',
        },
        {
          title: 'What happens after launch?',
          desc: 'We provide post-launch warranty, maintenance support, hosting setup, and seamless handoff or continued feature sprints.',
        },
        {
          title: 'Can you sign an NDA before we share our idea?',
          desc: 'Absolutely. We respect founder confidentiality and are happy to execute standard or custom mutual NDAs.',
        },
      ],
      ctaText: 'Have More Questions? Book a Call',
    },
  };

  const data = contentMap[activeTab] || contentMap['why-us'];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content info-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        <div className="modal-header">
          <div className="info-icon-badge">{data.icon}</div>
          <h3 className="modal-title">{data.title}</h3>
          <p className="modal-desc">{data.subtitle}</p>
        </div>

        <div className="info-items-list">
          {data.items.map((item, idx) => (
            <div key={idx} className="info-item-card">
              <div className="info-item-bullet">
                <Check size={14} color="#0a8898" />
              </div>
              <div>
                <h4 className="info-item-title">{item.title}</h4>
                <p className="info-item-desc">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="info-modal-footer">
          <button
            className="modal-primary-submit-btn"
            onClick={() => {
              onClose();
              if (onOpenBookCall) onOpenBookCall();
            }}
          >
            <span>{data.ctaText}</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
