import React, { useState } from 'react';
import Logo from './Logo';
import { Menu, X } from 'lucide-react';

export default function Navbar({ onOpenBookCall, onOpenVerifyCert, onOpenInfoTab }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Why Us?', key: 'why-us' },
    { label: 'Blog', key: 'blog' },
    { label: 'Courses', key: 'courses' },
    { label: 'FAQ', key: 'faq' },
    { label: 'Verify Certificate', key: 'verify', isSpecial: true },
  ];

  const handleNavClick = (link) => {
    setMobileMenuOpen(false);
    if (link.key === 'verify') {
      onOpenVerifyCert();
    } else {
      onOpenInfoTab(link.key);
    }
  };

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        {/* Left: Brand Logo */}
        <div className="navbar-brand">
          <Logo />
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="desktop-nav" aria-label="Main Navigation">
          {navLinks.map((link) => (
            <button
              key={link.key}
              onClick={() => handleNavClick(link)}
              className={`nav-link-btn ${link.isSpecial ? 'special-link' : ''}`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Right: Book a free call CTA Button */}
        <div className="navbar-cta-wrap">
          <button
            onClick={onOpenBookCall}
            className="book-call-btn"
            aria-label="Book a free call"
          >
            Book a free call
          </button>

          {/* Mobile hamburger menu toggle */}
          <button
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer animate-fadeIn">
          <nav className="mobile-nav-links">
            {navLinks.map((link) => (
              <button
                key={link.key}
                onClick={() => handleNavClick(link)}
                className="mobile-nav-link-btn"
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBookCall();
              }}
              className="mobile-book-call-btn"
            >
              Book a free call
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
