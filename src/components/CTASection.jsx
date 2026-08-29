import React from 'react';
import { Calendar, ArrowRight } from 'lucide-react';
import './CTASection.css';

export default function CTASection({ onOpenBookCall }) {
  return (
    <section className="cta-banner-section" id="contact" aria-labelledby="cta-heading">
      <div className="cta-banner-container">
        <div className="cta-banner-card">
          {/* Ambient Inner Bottom Blue Shade */}
          <div className="cta-bottom-shade" aria-hidden="true" />

          <div className="cta-content-inner">
            {/* Main Headline */}
            <h2 id="cta-heading" className="cta-title">
              Got something you want built?
            </h2>

            {/* Subtitle description */}
            <p className="cta-subtitle">
              Tell us what you have in mind. We'll give you an honest take on what it'll take, how
              long, and what it'll cost. No pressure and no jargon.
            </p>

            {/* CTA Button */}
            <div className="cta-button-wrap">
              <button
                type="button"
                className="cta-book-btn"
                onClick={onOpenBookCall}
                aria-label="Book a free 30-minute call"
              >
                <span>Book a free 30-minute call</span>
              </button>
            </div>

            {/* Footnote text */}
            <p className="cta-footnote">
              Free, no commitment. Just a straight conversation about your project.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
