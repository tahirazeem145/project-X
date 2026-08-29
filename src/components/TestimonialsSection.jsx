import React from 'react';
import { Star, ShieldCheck, User } from 'lucide-react';
import { ScrollReelTestimonials } from './ui/scroll-reel-testimonials';
import './TestimonialsSection.css';

export default function TestimonialsSection() {
  const stats = [
    { value: '15+', label: 'Projects delivered' },
    { value: '100%', label: 'Launched on schedule' },
  ];

  const featuredTestimonial = {
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
  };

  const reelTestimonials = [
    {
      quote: "The website was absolutely fantastic and launched on time.",
      author: "Ansari Jr — Tamil Nadu, India",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80&auto=format&fit=crop",
      alt: "Portrait of Ansari Jr",
    },
    {
      quote: "Affordable, fast delivery, and customer-friendly.",
      author: "Suriyaprakash Mahendran — Kuala Lumpur, Malaysia",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80&auto=format&fit=crop",
      alt: "Portrait of Suriyaprakash Mahendran",
    },
    {
      quote: "Excellent service and project delivered on time. Highly recommend!",
      author: "Winne — Kuala Lumpur, Malaysia",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80&auto=format&fit=crop",
      alt: "Portrait of Winne",
    },
  ];

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

        {/* Featured Testimonial Large Card */}
        <div className="testimonials-card-wrapper">
          <div className="testimonial-card">
            {/* Top Row: 5 Stars + Verified Badge */}
            <div className="testimonial-card-top">
              <div className="testimonial-stars-wrap">
                {[...Array(featuredTestimonial.rating)].map((_, i) => (
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
              {featuredTestimonial.quote.map((paragraph, pIdx) => (
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
                  <span className="client-role">{featuredTestimonial.clientRole}</span>
                  <span className="client-location">🇲🇾 {featuredTestimonial.location}</span>
                </div>
              </div>

              <div className="testimonial-project-pill google-verified-pill">
                <svg width="14" height="14" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Verified Google Review</span>
              </div>
            </div>
          </div>

          {/* Scroll Reel Interactive Counter-Rotating Testimonials Carousel */}
          <div className="scroll-reel-section-wrap">
            <ScrollReelTestimonials testimonials={reelTestimonials} />
          </div>
        </div>
      </div>
    </section>
  );
}
