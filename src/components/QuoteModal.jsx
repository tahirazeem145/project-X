import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Sparkles, Rocket, ShieldCheck, Zap } from 'lucide-react';

export default function QuoteModal({ isOpen, initialEmail = '', onClose, onShowToast }) {
  const [email, setEmail] = useState(initialEmail);
  const [projectType, setProjectType] = useState('Web App');
  const [budget, setBudget] = useState('$5k - $15k');
  const [timeline, setTimeline] = useState('2-4 weeks');
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (initialEmail) {
      setEmail(initialEmail);
    }
  }, [initialEmail]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      alert('Please enter your email.');
      return;
    }
    setIsSubmitted(true);
    if (onShowToast) {
      onShowToast(`Quote estimate generated! We've sent details to ${email}`);
    }
  };

  const handleClose = () => {
    setIsSubmitted(false);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div className="modal-content quote-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={handleClose} aria-label="Close quote modal">
          <X size={20} />
        </button>

        {!isSubmitted ? (
          <div>
            <div className="modal-header">
              <span className="modal-pill-tag">
                <Sparkles size={13} style={{ display: 'inline', marginRight: 4 }} /> Instant Estimate
              </span>
              <h3 className="modal-title">Get a Custom Project Quote</h3>
              <p className="modal-desc">
                Tell us about your requirements to receive a fast scope, pricing breakdown, and delivery timeline.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label className="form-label">Your Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="modal-input"
                />
              </div>

              <div className="form-section">
                <label className="form-label">Project Type</label>
                <div className="chips-grid">
                  {['Web App', 'Mobile App', 'Full-Stack MVP', 'AI Integration', 'Redesign'].map((t) => (
                    <button
                      type="button"
                      key={t}
                      className={`chip-btn ${projectType === t ? 'active' : ''}`}
                      onClick={() => setProjectType(t)}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-section">
                <label className="form-label">Target Budget</label>
                <div className="chips-grid">
                  {['<$5,000', '$5k - $15k', '$15k - $30k', '$30k+'].map((b) => (
                    <button
                      type="button"
                      key={b}
                      className={`chip-btn ${budget === b ? 'active' : ''}`}
                      onClick={() => setBudget(b)}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-section">
                <label className="form-label">Desired Timeline</label>
                <div className="chips-grid">
                  {['Rush (2 weeks)', '2-4 weeks', '1-2 months', 'Flexible'].map((tl) => (
                    <button
                      type="button"
                      key={tl}
                      className={`chip-btn ${timeline === tl ? 'active' : ''}`}
                      onClick={() => setTimeline(tl)}
                    >
                      {tl}
                    </button>
                  ))}
                </div>
              </div>

              <div className="quote-perks-row">
                <div className="perk-item">
                  <Rocket size={16} color="#0a8898" /> <span>Guaranteed On-Time Delivery</span>
                </div>
                <div className="perk-item">
                  <ShieldCheck size={16} color="#0a8898" /> <span>100% Code Ownership</span>
                </div>
                <div className="perk-item">
                  <Zap size={16} color="#0a8898" /> <span>Fixed Price, No Surprises</span>
                </div>
              </div>

              <button type="submit" className="modal-primary-submit-btn">
                Receive My Free Quote & Architecture Proposal
              </button>
            </form>
          </div>
        ) : (
          <div className="booking-success-view">
            <div className="success-icon-wrap">
              <CheckCircle2 size={52} color="#0a8898" />
            </div>
            <h3>Quote Request Received!</h3>
            <p>
              Thank you! Our engineering leads are analyzing your project specifications for <strong>{projectType}</strong>.
              A comprehensive proposal has been dispatched to <strong>{email}</strong>.
            </p>
            <div className="booking-summary-box">
              <p>📌 <strong>Type:</strong> {projectType}</p>
              <p>💰 <strong>Budget Range:</strong> {budget}</p>
              <p>⏱️ <strong>Target Launch:</strong> {timeline}</p>
            </div>
            <button className="modal-primary-submit-btn" onClick={handleClose}>
              Awesome, Got It
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
