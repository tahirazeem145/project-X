import React, { useState } from 'react';
import { ArrowRight, Clock, Calendar, User, ChevronRight } from 'lucide-react';
import './BlogSection.css';

export const blogPosts = [
  {
    id: 'duns-number-guide',
    category: 'PUBLISHING TIPS',
    title: 'Get a Free D-U-N-S Number – No 30-Day Waiting Period',
    excerpt:
      'Need a free D-U-N-S Number for Google Play or Apple Developer Organization enrollment? Learn how to fast-track verification in 48 hours.',
    author: 'Jime Developers',
    date: 'Jun 20, 2026',
    readTime: '2 min read',
    gradient: 'linear-gradient(135deg, #093548 0%, #0d4a63 50%, #0a2533 100%)',
    content: `
### Fast-Track Your D-U-N-S Number for App Store & Play Store

When setting up a corporate developer account on Apple Developer or Google Play Console, both platforms require a **Dun & Bradstreet (D-U-N-S) Number** to verify legal entity status.

#### Why the standard process takes 30 days:
Submitting through the standard D&B portal often puts your application in a low-priority queue with a 30-day turnaround unless you pay for expedited processing.

#### How to get it for free within 48-72 hours:
1. **Use the Apple Developer D-U-N-S Lookup Tool**: Go directly through the Apple Developer dedicated lookup tool. If your entity is not found, it allows you to submit your legal entity documents directly to the Apple-priority D&B queue.
2. **Prepare Documentation**: Have your Certificate of Incorporation, registered company address, and official government business ID ready.
3. **Verify by Phone**: A D&B representative will usually call or email within 2 business days to verify the entity representative.
4. **Instant Activation**: Once issued, wait 24 hours for the global D&B database to replicate to Apple and Google verification APIs.
    `,
  },
  {
    id: 'scale-web-apps-budget',
    category: 'ARCHITECTURE',
    title: 'Building Web Apps That Scale to 100k Users on a Budget',
    excerpt:
      'How to structure Next.js, Supabase, and edge caching so your early-stage product handles traffic spikes without costing a fortune.',
    author: 'Jime Developers',
    date: 'Jul 14, 2026',
    readTime: '4 min read',
    gradient: 'linear-gradient(135deg, #0d2a45 0%, #113d61 50%, #081d30 100%)',
    content: `
### Smart Architecture for High-Traffic Early Stage Web Apps

Building high-performance web applications doesn't require spending thousands on complex cloud infrastructure.

#### 1. Edge Caching & Static Optimization
Leverage Stale-While-Revalidate (SWR) headers and CDN edge caching to serve 95% of read queries directly from global PoPs with sub-50ms latency.

#### 2. Connection Pooling with Supabase / PostgreSQL
Use Prisma Accelerate or Supavisor connection poolers to prevent exhausting database connections during viral launch spikes.

#### 3. Optimistic UI & Local State
Render instant user feedback before server round-trips complete to deliver an app experience that feels 10x faster.
    `,
  },
  {
    id: 'scope-launch-mvp-30-days',
    category: 'PRODUCT STRATEGY',
    title: 'How to Scope and Launch an MVP in Under 30 Days',
    excerpt:
      'A battle-tested blueprint for cutting fluff, validating risky assumptions, and shipping your first production release on schedule.',
    author: 'Jime Developers',
    date: 'Aug 02, 2026',
    readTime: '3 min read',
    gradient: 'linear-gradient(135deg, #0b2e3b 0%, #0e4554 50%, #092029 100%)',
    content: `
### The 30-Day Production Launch Playbook

Most startup founders fail not because of poor coding, but because they over-engineer non-essential features before talking to real customers.

#### Phase 1: Core Value Proposition (Week 1)
Define the ONE job the user is hiring your software to do. Everything else is secondary.

#### Phase 2: Design System & Wireframing (Week 2)
Build with pre-tested liquid glass component tokens and shadcn primitives to maintain high visual fidelity without custom boilerplate.

#### Phase 3: Core Implementation & Integrations (Week 3)
Connect authentication, database schema, payments, and notifications.

#### Phase 4: Polish, QA & Deployment (Week 4)
Automated visual diff checks, responsive testing across devices, and live production deployment.
    `,
  },
];

export default function BlogSection({ onSelectBlog }) {
  const [selectedPost, setSelectedPost] = useState(null);

  const handleOpenBlog = (post) => {
    setSelectedPost(post);
    if (onSelectBlog) {
      onSelectBlog(post);
    }
  };

  return (
    <section className="blog-section" id="blog" aria-labelledby="blog-heading">
      <div className="blog-container">
        {/* Section Header */}
        <div className="blog-header">
          <div className="blog-header-left">
            <span className="blog-eyebrow">FROM THE BLOG</span>
            <h2 id="blog-heading" className="blog-title">
              Guides for getting your idea built
            </h2>
          </div>

          <button
            type="button"
            className="blog-view-all-link"
            onClick={() => handleOpenBlog(blogPosts[0])}
            aria-label="View all blogs"
          >
            <span>View all blogs</span>
            <ChevronRight className="blog-chevron-icon" size={18} />
          </button>
        </div>

        {/* Blog Cards Grid */}
        <div className="blog-grid">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className="blog-card"
              onClick={() => handleOpenBlog(post)}
              tabIndex={0}
              role="button"
              onKeyDown={(e) => e.key === 'Enter' && handleOpenBlog(post)}
            >
              {/* Card Thumbnail Header with Teal Gradient */}
              <div className="blog-card-thumb" style={{ background: post.gradient }}>
                <div className="blog-thumb-overlay" />
                <span className="blog-thumb-badge">{post.category}</span>
              </div>

              {/* Card Body */}
              <div className="blog-card-body">
                <span className="blog-category-tag">{post.category}</span>

                <h3 className="blog-card-title">{post.title}</h3>

                <p className="blog-card-excerpt">{post.excerpt}</p>

                {/* Card Meta Footer */}
                <div className="blog-card-footer">
                  <span className="blog-author">{post.author}</span>
                  <span className="blog-dot">·</span>
                  <span className="blog-date">{post.date}</span>
                  <span className="blog-dot">·</span>
                  <span className="blog-read-time">{post.readTime}</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Mobile View All Button */}
        <div className="blog-mobile-footer">
          <button
            type="button"
            className="blog-mobile-btn"
            onClick={() => handleOpenBlog(blogPosts[0])}
          >
            <span>View all blogs</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Interactive Blog Reader Modal */}
      {selectedPost && (
        <div className="blog-modal-backdrop" onClick={() => setSelectedPost(null)}>
          <div
            className="blog-modal-content"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <button
              type="button"
              className="blog-modal-close"
              onClick={() => setSelectedPost(null)}
              aria-label="Close modal"
            >
              ✕
            </button>

            <div className="blog-modal-header">
              <span className="blog-category-tag">{selectedPost.category}</span>
              <h2 className="blog-modal-title">{selectedPost.title}</h2>
              <div className="blog-card-footer" style={{ marginTop: '12px' }}>
                <span className="blog-author">{selectedPost.author}</span>
                <span className="blog-dot">·</span>
                <span className="blog-date">{selectedPost.date}</span>
                <span className="blog-dot">·</span>
                <span className="blog-read-time">{selectedPost.readTime}</span>
              </div>
            </div>

            <div className="blog-modal-body">
              <p className="blog-modal-lead">{selectedPost.excerpt}</p>
              <div className="blog-markdown-content">
                {selectedPost.content.split('\n\n').map((paragraph, idx) => {
                  if (paragraph.startsWith('### ')) {
                    return <h3 key={idx}>{paragraph.replace('### ', '')}</h3>;
                  }
                  if (paragraph.startsWith('#### ')) {
                    return <h4 key={idx}>{paragraph.replace('#### ', '')}</h4>;
                  }
                  if (paragraph.startsWith('1. ') || paragraph.startsWith('2. ') || paragraph.startsWith('3. ') || paragraph.startsWith('4. ')) {
                    return <p key={idx} className="blog-list-item">{paragraph}</p>;
                  }
                  return <p key={idx}>{paragraph}</p>;
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
