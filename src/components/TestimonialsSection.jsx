import React, { useState } from 'react';
import { Star, CheckCircle, ShieldCheck, Quote, ChevronLeft, ChevronRight, User } from 'lucide-react';
import './TestimonialsSection.css';

export default function TestimonialsSection() {
  const [activeIdx, setActiveIdx] = useState(0);

  const stats = [
    { value: '15+', label: 'Projects delivered' },
    { value: '100%', label: 'Launched on schedule' },
  ];

  const testimonials = [
    {
      id: 1,
      rating: 5,
      projectTitle: 'Byte-Level Malware Detection Using Patch Byte Transformer with ROI Visualization',
      location: 'Malaysia',
      clientRole: 'Research & Project Lead',
      verified: true,
      quote: [
        'I had an excellent experience working with this project developer. He completed my project, “Byte-Level Malware Detection Using Patch Byte Transformer with ROI Visualization,” within a short period of time and delivered it in a very professional and impressive way. The project was handled perfectly, from the technical implementation to the explanation and support given throughout the process.',
        'He was very kind, patient, helpful, and always ready to guide me whenever I needed clarification. Even though I am from Malaysia and he is from India, the communication was smooth and trustworthy from beginning to end. I truly appreciate his dedication, honesty, and commitment to delivering quality work. I am fully satisfied with the final outcome and would highly recommend him to anyone looking for reliable, skilled, and professional project development support.',
        'Thank you so much for your great work and continuous support!',
      ],
    },
  ];

  const currentTestimonial = testimonials[activeIdx] || testimonials[0];

  return (
    <section className="testimonials-section" id="testimonials" aria-labelledby="testimonials-heading">
      <div className="testimonials-container">
        {/* Section Header */}
        <div className="testimonials-header">
          <span className="testimonials-eyebrow">TESTIMONIALS</span>
          <h2 id="testimonials-heading" className="testimonials-title">
            Don't take our word for it
          </h2>

          {/* Stats Row Under Title */}
          <div className="testimonials-stats-row">
            {stats.map((stat, idx) => (
              <div key={idx} className="testimonials-stat-item">
                <span className="testimonials-stat-value">{stat.value}</span>
                <span className="testimonials-stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Testimonial Card */}
        <div className="testimonials-card-wrapper">
          <div className="testimonial-card">
            {/* Top Row: 5 Stars + Verified Badge */}
            <div className="testimonial-card-top">
              <div className="testimonial-stars-wrap">
                {[...Array(currentTestimonial.rating)].map((_, i) => (
                  <Star key={i} size={18} className="star-icon filled" />
                ))}
              </div>

              <div className="testimonial-verified-tag">
                <ShieldCheck size={14} className="verified-shield-icon" />
                <span>Verified Client</span>
              </div>
            </div>

            {/* Testimonial Quote Text */}
            <div className="testimonial-body">
              {currentTestimonial.quote.map((paragraph, pIdx) => (
                <p key={pIdx} className="testimonial-paragraph">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Testimonial Footer info */}
            <div className="testimonial-card-footer">
              <div className="testimonial-client-info">
                <div className="testimonial-avatar">
                  <User size={18} />
                </div>
                <div className="testimonial-client-meta">
                  <span className="client-role">{currentTestimonial.clientRole}</span>
                  <span className="client-location">🇲🇾 {currentTestimonial.location}</span>
                </div>
              </div>

              <div className="testimonial-project-pill">
                <CheckCircle size={13} className="project-check-icon" />
                <span>AI & Deep Learning Project</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
