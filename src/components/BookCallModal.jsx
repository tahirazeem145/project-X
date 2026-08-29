import React, { useState } from 'react';
import { X, Calendar, Clock, CheckCircle2, User, Mail, Phone, MessageSquare } from 'lucide-react';

export default function BookCallModal({ isOpen, onClose, onShowToast }) {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState('Tomorrow');
  const [selectedTime, setSelectedTime] = useState('02:00 PM (EST)');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    projectScope: 'Web Application',
    notes: '',
  });

  if (!isOpen) return null;

  const dates = ['Today', 'Tomorrow', 'In 2 days', 'In 3 days', 'Next Monday'];
  const timeSlots = [
    '10:00 AM (EST)',
    '11:30 AM (EST)',
    '02:00 PM (EST)',
    '03:30 PM (EST)',
    '05:00 PM (EST)',
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      alert('Please fill in your name and email.');
      return;
    }
    setStep(2);
    if (onShowToast) {
      onShowToast('Call booked successfully! Check your inbox for the calendar invite.');
    }
  };

  const handleResetAndClose = () => {
    setStep(1);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={handleResetAndClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={handleResetAndClose} aria-label="Close modal">
          <X size={20} />
        </button>

        {step === 1 ? (
          <div>
            <div className="modal-header">
              <span className="modal-pill-tag">30 Min Discovery Call</span>
              <h3 className="modal-title">Book a Free Strategy Call</h3>
              <p className="modal-desc">
                Let's discuss your project goals, technical requirements, and estimated timeline.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              {/* Date & Time selection */}
              <div className="form-section">
                <label className="form-label">
                  <Calendar size={15} /> Select a Date
                </label>
                <div className="chips-grid">
                  {dates.map((d) => (
                    <button
                      type="button"
                      key={d}
                      className={`chip-btn ${selectedDate === d ? 'active' : ''}`}
                      onClick={() => setSelectedDate(d)}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-section">
                <label className="form-label">
                  <Clock size={15} /> Preferred Time Slot
                </label>
                <div className="chips-grid">
                  {timeSlots.map((t) => (
                    <button
                      type="button"
                      key={t}
                      className={`chip-btn ${selectedTime === t ? 'active' : ''}`}
                      onClick={() => setSelectedTime(t)}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Contact info */}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">
                    <User size={15} /> Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Jane Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="modal-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <Mail size={15} /> Work Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="jane@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="modal-input"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">
                    <Phone size={15} /> Phone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="modal-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Project Type</label>
                  <select
                    value={formData.projectScope}
                    onChange={(e) => setFormData({ ...formData, projectScope: e.target.value })}
                    className="modal-input"
                  >
                    <option value="Web Application">Web Application</option>
                    <option value="Mobile App (iOS / Android)">Mobile App (iOS / Android)</option>
                    <option value="Full-Stack SaaS Platform">Full-Stack SaaS Platform</option>
                    <option value="MVP Prototype (2-4 Weeks)">MVP Prototype (2-4 Weeks)</option>
                    <option value="UI/UX & Product Design">UI/UX & Product Design</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <MessageSquare size={15} /> Tell us a bit about your idea (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="What are you looking to build?"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="modal-input textarea"
                ></textarea>
              </div>

              <button type="submit" className="modal-primary-submit-btn">
                Confirm Booking for {selectedDate} at {selectedTime.split(' ')[0]}
              </button>
            </form>
          </div>
        ) : (
          <div className="booking-success-view">
            <div className="success-icon-wrap">
              <CheckCircle2 size={52} color="#0a8898" />
            </div>
            <h3>You're All Set!</h3>
            <p>
              We've booked your discovery call for <strong>{selectedDate}</strong> at{' '}
              <strong>{selectedTime}</strong>. A calendar invite and Google Meet link have been sent to{' '}
              <strong>{formData.email}</strong>.
            </p>
            <div className="booking-summary-box">
              <p>👤 <strong>{formData.name}</strong></p>
              <p>🎯 <strong>{formData.projectScope}</strong></p>
              <p>📅 <strong>{selectedDate} • {selectedTime}</strong></p>
            </div>
            <button className="modal-primary-submit-btn" onClick={handleResetAndClose}>
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
