import React, { useState } from 'react';
import GoogleReviewBadge from './GoogleReviewBadge';
import StatsCard from './StatsCard';

export default function HeroSection({ onGetQuote, onOpenReviewDetails }) {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onGetQuote) {
      onGetQuote(email);
    }
  };

  return (
    <section className="hero-section" aria-labelledby="hero-heading">
      <div className="hero-content-wrapper">
        {/* Google review social proof badge */}
        <div className="hero-badge-row">
          <GoogleReviewBadge />
        </div>

        {/* Main Headline */}
        <h1 id="hero-heading" className="hero-title">
          <span className="title-line-1">We turn your idea</span>
          <span className="title-line-2">
            into a <span className="teal-text">real product.</span>
          </span>
        </h1>

        {/* Subtitle */}
        <p className="hero-subtitle">
          Web and mobile apps, designed and shipped fast.
        </p>

        {/* Action / Quote Input Pill */}
        <div className="hero-action-container">
          <form onSubmit={handleSubmit} className="quote-input-pill">
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="email-input-field"
              aria-label="Email address"
              required
            />
            <button
              type="submit"
              className="get-quote-btn"
              aria-label="Get a quote"
            >
              Get a quote
            </button>
          </form>
        </div>

        {/* Stats Card */}
        <div className="hero-stats-row">
          <StatsCard />
        </div>
      </div>
    </section>
  );
}
