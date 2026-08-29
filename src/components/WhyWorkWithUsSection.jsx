import React from 'react';
import { Zap, GitFork, LifeBuoy } from 'lucide-react';

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
    <section 
      className="why-us-section" 
      id="why-us" 
      aria-labelledby="why-us-heading"
      style={{
        position: 'relative',
        zIndex: 10,
        width: '100%',
        padding: '60px 20px 140px',
      }}
    >
      <div 
        className="why-us-container"
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 40px',
        }}
      >
        {/* Section Header */}
        <div 
          className="why-us-header"
          style={{
            textAlign: 'center',
            maxWidth: '780px',
            margin: '0 auto 56px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <span 
            className="why-us-eyebrow"
            style={{
              fontSize: '13px',
              fontWeight: '700',
              color: '#38bdf8',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              marginBottom: '12px',
              display: 'block',
            }}
          >
            WHY WORK WITH US
          </span>
          <h2 
            id="why-us-heading" 
            className="why-us-title"
            style={{
              fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
              fontWeight: '800',
              color: '#ffffff',
              letterSpacing: '-1.2px',
              marginBottom: '16px',
              lineHeight: '1.2',
            }}
          >
            Small studio. Senior work. No runaround.
          </h2>
          <p 
            className="why-us-subtitle"
            style={{
              fontSize: '16px',
              color: '#94a3b8',
              lineHeight: '1.6',
              maxWidth: '680px',
              margin: '0 auto',
            }}
          >
            Most clients come to us after an agency quote came back at triple their budget, or a freelancer went quiet mid-project. Here's how we're different.
          </p>
        </div>

        {/* 3 Value Cards Grid */}
        <div 
          className="why-us-cards-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '28px',
            width: '100%',
          }}
        >
          {valueProps.map((item) => {
            const IconComponent = item.icon;
            return (
              <div 
                key={item.id} 
                className="why-us-card"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(15, 19, 27, 0.92) 50%, rgba(56, 189, 248, 0.04) 100%)',
                  backdropFilter: 'blur(28px) saturate(200%)',
                  WebkitBackdropFilter: 'blur(28px) saturate(200%)',
                  border: '1px solid rgba(255, 255, 255, 0.16)',
                  borderRadius: '28px',
                  padding: '38px 34px 42px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  minHeight: '290px',
                  boxShadow: 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.35), inset 0 -1px 1px 0 rgba(0, 0, 0, 0.4), 0 16px 45px rgba(0, 0, 0, 0.5), 0 0 30px rgba(56, 189, 248, 0.06)',
                  textAlign: 'left',
                }}
              >
                {/* Icon Squircle Badge */}
                <div 
                  className="why-us-icon-wrap"
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '13px',
                    background: '#09131d',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '28px',
                    boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.25), 0 6px 16px rgba(0, 0, 0, 0.4)',
                    color: '#ffffff',
                  }}
                >
                  <IconComponent size={20} className="why-us-icon-svg" />
                </div>

                {/* Card Title */}
                <h3 
                  className="why-us-card-title"
                  style={{
                    fontSize: '21px',
                    fontWeight: '700',
                    color: '#ffffff',
                    marginBottom: '14px',
                    lineHeight: '1.35',
                  }}
                >
                  {item.title}
                </h3>

                {/* Card Description */}
                <p 
                  className="why-us-card-desc"
                  style={{
                    fontSize: '15px',
                    color: '#94a3b8',
                    lineHeight: '1.62',
                    margin: 0,
                  }}
                >
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
