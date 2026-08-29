import React from 'react';
import { Zap, GitFork, LifeBuoy, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function WhyWorkWithUsSection({ onOpenBookCall }) {
  const valueProps = [
    {
      id: 'speed',
      icon: Zap,
      iconColor: '#38bdf8',
      title: 'Launched in weeks, not months',
      desc: 'You see a working version early, then we ship. Most projects go live in four to eight weeks, so you can get it in front of real users fast.',
      highlight: '4–8 Weeks Average Delivery',
    },
    {
      id: 'scalable',
      icon: GitFork,
      iconColor: '#2dd4bf',
      title: 'Built to grow with you',
      desc: 'Built on proven tools like React, Next.js & Laravel, structured to stay fast and easy to change as you add users. No throwaway code to rebuild in a year.',
      highlight: 'Zero Technical Debt Architecture',
    },
    {
      id: 'support',
      icon: LifeBuoy,
      iconColor: '#a855f7',
      title: "We're still here after launch",
      desc: 'When something breaks or you need a change, you reach the same people who built it. Support doesn’t stop at handover.',
      highlight: 'Direct Senior Engineer Support',
    },
  ];

  return (
    <section className="why-us-section" id="why-us" aria-labelledby="why-us-heading">
      <div className="why-us-container">
        {/* Section Header */}
        <div className="why-us-header">
          <span className="why-us-eyebrow">WHY WORK WITH US</span>
          <h2 id="why-us-heading" className="why-us-title">
            Small studio. Senior work. No runaround.
          </h2>
          <p className="why-us-subtitle">
            Most clients come to us after an agency quote came back at triple their budget, or a freelancer went quiet mid-project. Here's how we're different.
          </p>
        </div>

        {/* 3 Value Cards Grid */}
        <div className="why-us-cards-grid">
          {valueProps.map((item) => {
            const IconComponent = item.icon;
            return (
              <div key={item.id} className="why-us-card">
                {/* Icon Badge */}
                <div
                  className="why-us-icon-wrap"
                  style={{
                    boxShadow: `0 8px 25px -4px ${item.iconColor}33`,
                    borderColor: `${item.iconColor}40`,
                  }}
                >
                  <IconComponent size={22} color={item.iconColor} />
                </div>

                {/* Content */}
                <div className="why-us-card-content">
                  <h3 className="why-us-card-title">{item.title}</h3>
                  <p className="why-us-card-desc">{item.desc}</p>
                </div>

                {/* Footer Highlight Tag */}
                <div className="why-us-card-footer">
                  <span className="why-us-highlight-pill" style={{ color: item.iconColor }}>
                    <CheckCircle2 size={13} />
                    <span>{item.highlight}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
