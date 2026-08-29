import React from 'react';
import { Zap, GitFork, LifeBuoy } from 'lucide-react';
import './WhyWorkWithUsSection.css';

export default function WhyWorkWithUsSection() {
  const valueProps = [
    {
      id: 'speed',
      icon: Zap,
      title: 'Launched in weeks, not months',
      desc: 'You see a working version early, then we ship. Most projects go live in four to eight weeks, so you can get it in front of real users fast.',
    },
    {
      id: 'scalable',
      icon: GitFork,
      title: 'Built to grow with you',
      desc: 'Built on proven tools like Laravel, structured to stay fast and easy to change as you add users. No throwaway code to rebuild in a year.',
    },
    {
      id: 'support',
      icon: LifeBuoy,
      title: "We're still here after launch",
      desc: 'When something breaks or you need a change, you reach the same people who built it. Support doesn’t stop at handover.',
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
                {/* Icon Squircle Badge */}
                <div className="why-us-icon-wrap">
                  <IconComponent size={20} className="why-us-icon-svg" />
                </div>

                {/* Card Title */}
                <h3 className="why-us-card-title">{item.title}</h3>

                {/* Card Description */}
                <p className="why-us-card-desc">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
