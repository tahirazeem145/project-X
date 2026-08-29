import React, { useEffect, useState } from "react";

const INTRO_STYLE_ID = "faq1-animations";

export interface FAQItem {
  question: string;
  answer: string;
  meta?: string;
}

export const defaultFaqs: FAQItem[] = [
  {
    question: "How much does a website or app cost?",
    answer:
      "Our projects typically range from simple landing pages and MVP web apps to full-scale custom platforms. Because we operate as a lean senior studio without massive agency overhead, our quotes are straightforward, fixed-price, and transparent with zero hidden fees.",
    meta: "Pricing",
  },
  {
    question: "How long will my project take?",
    answer:
      "Most standard websites and landing pages launch in 1 to 2 weeks. Comprehensive custom web applications and full MVPs typically take 3 to 5 weeks. We prioritize rapid momentum and schedule milestone reviews along the way.",
    meta: "Timeline",
  },
  {
    question: "What kind of projects do you take on?",
    answer:
      "We build modern high-performance web applications, responsive landing pages, SaaS platforms, AI & deep learning dashboard tools, mobile-responsive web apps, and custom business portals.",
    meta: "Scope",
  },
  {
    question: "Do I own the code when it's done?",
    answer:
      "Yes, 100%. Once final delivery and deployment are complete, all intellectual property, source code, repositories, design assets, and credentials are completely transferred to you.",
    meta: "Ownership",
  },
  {
    question: "Can you redesign or fix an existing site?",
    answer:
      "Absolutely. Whether you need a visual overhaul to modern liquid glass aesthetics, speed optimization, bug fixes, or new feature additions, we can audit and upgrade your existing codebase smoothly.",
    meta: "Redesign",
  },
  {
    question: "What happens after the site goes live?",
    answer:
      "We don't disappear after launch. Every project includes post-launch support and warranty to fix any unexpected bugs. We also offer monthly maintenance and iterative feature sprints.",
    meta: "Support",
  },
  {
    question: "Will my site work well on phones and load fast?",
    answer:
      "Yes. Every experience is mobile-first, responsive, and performance-tuned with sub-second loading times, SEO best practices, and fluid micro-interactions across iOS, Android, and Desktop.",
    meta: "Performance",
  },
  {
    question: "What technology do you build with?",
    answer:
      "We build with modern, scalable stacks including React, Next.js, Vite, TypeScript, Tailwind CSS, GSAP, Node.js, Python, PostgreSQL, and cloud deployments on Vercel, AWS, and Supabase.",
    meta: "Stack",
  },
  {
    question: "How do you handle security and my data?",
    answer:
      "We implement industry best practices: SSL/TLS encryption, secure API authentication, environment secret isolation, OWASP guidelines, and strict NDA confidentiality for all proprietary client data.",
    meta: "Security",
  },
  {
    question: "How do we get started?",
    answer:
      "Simply click 'Book a Call' or submit your email for an instant quote. We'll hop on a quick 15-minute alignment call, review your scope, and send a clear timeline and fixed proposal within 24 hours.",
    meta: "Onboarding",
  },
];

export interface FAQProps {
  faqs?: FAQItem[];
}

export function FAQ1({ faqs = defaultFaqs }: FAQProps) {
  const [introReady, setIntroReady] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (document.getElementById(INTRO_STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = INTRO_STYLE_ID;
    style.innerHTML = `
      @keyframes faq1-fade-up {
        0% { transform: translate3d(0, 20px, 0); opacity: 0; filter: blur(6px); }
        60% { filter: blur(0); }
        100% { transform: translate3d(0, 0, 0); opacity: 1; filter: blur(0); }
      }
      @keyframes faq1-beam-spin {
        0% { transform: rotate(0deg) scale(1); }
        100% { transform: rotate(360deg) scale(1); }
      }
      @keyframes faq1-pulse {
        0% { transform: scale(0.7); opacity: 0.55; }
        60% { opacity: 0.1; }
        100% { transform: scale(1.25); opacity: 0; }
      }
      @keyframes faq1-meter {
        0%, 20% { transform: scaleX(0); transform-origin: left; }
        45%, 60% { transform: scaleX(1); transform-origin: left; }
        80%, 100% { transform: scaleX(0); transform-origin: right; }
      }
      @keyframes faq1-tick {
        0%, 30% { transform: translateX(-6px); opacity: 0.4; }
        50% { transform: translateX(2px); opacity: 1; }
        100% { transform: translateX(20px); opacity: 0; }
      }
      @keyframes whiteShadeSweepBiDirectional {
        0% {
          transform: translateX(-160%);
          opacity: 0.1;
        }
        25% {
          opacity: 0.85;
        }
        50% {
          transform: translateX(240%);
          opacity: 0.1;
        }
        75% {
          opacity: 0.85;
        }
        100% {
          transform: translateX(-160%);
          opacity: 0.1;
        }
      }
      .faq1-intro {
        position: relative;
        display: flex;
        align-items: center;
        gap: 0.85rem;
        padding: 0.75rem 1.4rem;
        border-radius: 9999px;
        overflow: hidden;
        border: 1px solid rgba(0, 180, 216, 0.3);
        background: rgba(12, 18, 28, 0.6);
        color: rgba(248, 250, 252, 0.92);
        text-transform: uppercase;
        letter-spacing: 0.35em;
        font-size: 0.68rem;
        width: 100%;
        max-width: 22rem;
        margin: 0 auto 16px;
        opacity: 0;
        transform: translate3d(0, 12px, 0);
        filter: blur(8px);
        transition: opacity 720ms ease, transform 720ms ease, filter 720ms ease;
        isolation: isolate;
        box-shadow: 0 0 25px rgba(0, 180, 216, 0.15);
      }
      .faq1-intro--active {
        opacity: 1;
        transform: translate3d(0, 0, 0);
        filter: blur(0);
      }
      .faq1-intro__beam,
      .faq1-intro__pulse {
        position: absolute;
        inset: -110%;
        pointer-events: none;
        border-radius: 50%;
      }
      .faq1-intro__beam {
        background: conic-gradient(from 160deg, rgba(0, 180, 216, 0.35), transparent 32%, rgba(23, 195, 178, 0.25) 58%, transparent 78%, rgba(0, 148, 232, 0.2));
        animation: faq1-beam-spin 18s linear infinite;
        opacity: 0.65;
      }
      .faq1-intro__pulse {
        border: 1px solid rgba(0, 180, 216, 0.4);
        opacity: 0.25;
        animation: faq1-pulse 3.4s ease-out infinite;
      }
      .faq1-intro__label {
        position: relative;
        z-index: 1;
        font-weight: 700;
        letter-spacing: 0.35em;
        color: #00b4d8;
      }
      .faq1-intro__meter {
        position: relative;
        z-index: 1;
        flex: 1 1 auto;
        height: 1px;
        background: linear-gradient(90deg, transparent, #00b4d8 35%, transparent 85%);
        transform: scaleX(0);
        transform-origin: left;
        animation: faq1-meter 5.8s ease-in-out infinite;
        opacity: 0.8;
      }
      .faq1-intro__tick {
        position: relative;
        z-index: 1;
        width: 0.55rem;
        height: 0.55rem;
        border-radius: 9999px;
        background: #00b4d8;
        box-shadow: 0 0 8px rgba(0, 180, 216, 0.8);
        animation: faq1-tick 3.2s ease-in-out infinite;
      }
      .faq-card-item {
        position: relative;
        overflow: hidden;
        border-radius: 24px;
        border: 1px solid rgba(255, 255, 255, 0.14);
        border-top: 1px solid rgba(255, 255, 255, 0.3);
        background: 
          radial-gradient(ellipse 90% 70% at 85% 15%, rgba(255, 255, 255, 0.10) 0%, rgba(255, 255, 255, 0.02) 45%, transparent 75%),
          linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(13, 17, 26, 0.82) 45%, rgba(18, 24, 36, 0.72) 85%, rgba(10, 14, 22, 0.9) 100%);
        backdrop-filter: blur(28px) saturate(200%);
        -webkit-backdrop-filter: blur(28px) saturate(200%);
        box-shadow: 
          inset 0 1px 1px rgba(255, 255, 255, 0.35),
          0 16px 45px rgba(0, 0, 0, 0.5);
        transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.35s ease, box-shadow 0.35s ease;
      }
      .faq-card-item:hover {
        transform: translateY(-3px);
        border-color: rgba(255, 255, 255, 0.24);
        border-top-color: rgba(255, 255, 255, 0.5);
        box-shadow: 
          inset 0 1px 1px rgba(255, 255, 255, 0.45),
          0 22px 55px rgba(0, 0, 0, 0.65);
      }
      .faq-card-item::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        width: 55%;
        background: linear-gradient(
          90deg,
          transparent 0%,
          rgba(255, 255, 255, 0.02) 20%,
          rgba(255, 255, 255, 0.22) 50%,
          rgba(255, 255, 255, 0.02) 80%,
          transparent 100%
        );
        filter: blur(2px);
        pointer-events: none;
        z-index: 5;
        animation: whiteShadeSweepBiDirectional 20s ease-in-out infinite;
      }
      .faq-bottom-blue-shade {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 60%;
        pointer-events: none;
        background: radial-gradient(ellipse 90% 80% at 50% 100%, rgba(0, 180, 216, 0.16) 0%, rgba(0, 148, 232, 0.06) 50%, transparent 80%);
        border-bottom: 1px solid rgba(0, 180, 216, 0.25);
        border-radius: 0 0 24px 24px;
        transition: opacity 0.35s ease, height 0.35s ease;
        z-index: 1;
      }
      .faq-card-item:hover .faq-bottom-blue-shade {
        opacity: 1;
        background: radial-gradient(ellipse 90% 85% at 50% 100%, rgba(0, 180, 216, 0.22) 0%, rgba(0, 148, 232, 0.09) 50%, transparent 80%);
        border-bottom-color: rgba(0, 180, 216, 0.4);
      }
    `;

    document.head.appendChild(style);

    return () => {
      if (style.parentNode) style.remove();
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      setIntroReady(true);
      return;
    }
    const frame = window.requestAnimationFrame(() => setIntroReady(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const toggleQuestion = (index: number) =>
    setActiveIndex((prev) => (prev === index ? null : index));

  return (
    <section
      className="faq-section"
      id="faq"
      aria-labelledby="faq-heading"
      style={{
        position: "relative",
        zIndex: 10,
        width: "100%",
        padding: "60px 20px 140px",
        background: "transparent",
      }}
    >
      <div
        style={{
          width: "80%",
          maxWidth: "1240px",
          margin: "0 auto",
          padding: 0,
        }}
      >
        {/* Animated Signal Pill */}
        <div className={`faq1-intro ${introReady ? "faq1-intro--active" : ""}`}>
          <span className="faq1-intro__beam" aria-hidden="true" />
          <span className="faq1-intro__pulse" aria-hidden="true" />
          <span className="faq1-intro__label">FAQ</span>
          <span className="faq1-intro__meter" aria-hidden="true" />
          <span className="faq1-intro__tick" aria-hidden="true" />
        </div>

        {/* Section Header */}
        <div
          style={{
            textAlign: "center",
            maxWidth: "800px",
            margin: "0 auto 52px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-main, 'Plus Jakarta Sans', sans-serif)",
              fontSize: "13px",
              fontWeight: 700,
              color: "var(--teal-primary, #00b4d8)",
              background: "var(--teal-gradient, linear-gradient(90deg, #0094e8 0%, #00b4d8 50%, #17c3b2 100%))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              marginBottom: "12px",
              display: "block",
            }}
          >
            FAQ
          </span>
          <h2
            id="faq-heading"
            style={{
              fontFamily: "var(--font-main, 'Plus Jakarta Sans', sans-serif)",
              fontSize: "42px",
              fontWeight: 800,
              color: "#ffffff",
              letterSpacing: "-1.2px",
              lineHeight: 1.2,
              marginBottom: "16px",
            }}
          >
            Frequently Asked Questions
          </h2>
          <p
            style={{
              fontFamily: "var(--font-main, 'Plus Jakarta Sans', sans-serif)",
              fontSize: "16px",
              color: "#94a3b8",
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            Everything you need to know about partnering with our studio, timeline, pricing, and process.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "16px" }}>
          {faqs.map((item, index) => {
            const open = activeIndex === index;
            const panelId = `faq-panel-${index}`;
            const buttonId = `faq-trigger-${index}`;

            return (
              <li
                key={item.question}
                className="faq-card-item"
              >
                {/* Bottom Blue Shade Gradient Layer */}
                <div className="faq-bottom-blue-shade" aria-hidden="true" />

                <button
                  type="button"
                  id={buttonId}
                  aria-controls={panelId}
                  aria-expanded={open}
                  onClick={() => toggleQuestion(index)}
                  style={{
                    position: "relative",
                    zIndex: 2,
                    display: "flex",
                    width: "100%",
                    alignItems: "flex-start",
                    gap: "20px",
                    padding: "26px 32px",
                    textAlign: "left",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    outline: "none",
                  }}
                >
                  {/* Toggle Plus/Close Badge */}
                  <span
                    style={{
                      position: "relative",
                      display: "flex",
                      width: "40px",
                      height: "40px",
                      flexShrink: 0,
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "50%",
                      border: open ? "1px solid rgba(0, 180, 216, 0.5)" : "1px solid rgba(255, 255, 255, 0.18)",
                      background: open ? "rgba(0, 180, 216, 0.12)" : "rgba(255, 255, 255, 0.05)",
                      color: open ? "#00b4d8" : "#ffffff",
                      transition: "all 0.35s ease",
                    }}
                  >
                    <svg
                      style={{
                        width: "18px",
                        height: "18px",
                        transform: open ? "rotate(45deg)" : "rotate(0deg)",
                        transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                      }}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </span>

                  {/* Question & Answer */}
                  <div style={{ display: "flex", flex: 1, flexDirection: "column", gap: "12px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
                      <h3
                        style={{
                          margin: 0,
                          fontFamily: "var(--font-main, 'Plus Jakarta Sans', sans-serif)",
                          fontSize: "18.5px",
                          fontWeight: 700,
                          color: open ? "#00b4d8" : "#ffffff",
                          transition: "color 0.3s ease",
                          letterSpacing: "-0.4px",
                        }}
                      >
                        {item.question}
                      </h3>

                      {item.meta && (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            borderRadius: "9999px",
                            border: "1px solid rgba(255, 255, 255, 0.12)",
                            background: "rgba(255, 255, 255, 0.04)",
                            padding: "4px 12px",
                            fontSize: "11px",
                            fontWeight: 600,
                            letterSpacing: "0.2em",
                            textTransform: "uppercase",
                            color: "#94a3b8",
                            flexShrink: 0,
                          }}
                        >
                          {item.meta}
                        </span>
                      )}
                    </div>

                    {/* Expandable Answer */}
                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      style={{
                        maxHeight: open ? "300px" : "0px",
                        overflow: "hidden",
                        opacity: open ? 1 : 0,
                        transition: "max-height 0.45s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease",
                      }}
                    >
                      <p
                        style={{
                          margin: 0,
                          paddingTop: "6px",
                          fontFamily: "var(--font-main, 'Plus Jakarta Sans', sans-serif)",
                          fontSize: "15.5px",
                          lineHeight: 1.7,
                          color: "#cbd5e1",
                        }}
                      >
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export default FAQ1;
