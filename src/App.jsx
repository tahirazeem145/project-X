import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import StackedCards from './components/ui/glass-cards';
import WhyWorkWithUsSection from './components/WhyWorkWithUsSection';
import TestimonialsSection from './components/TestimonialsSection';
import FAQ1 from './components/ui/faq-monocrhome';
import WhatsAppButton from './components/WhatsAppButton';
import BookCallModal from './components/BookCallModal';
import QuoteModal from './components/QuoteModal';
import VerifyCertificateModal from './components/VerifyCertificateModal';
import InfoModal from './components/InfoModal';
import ProjectDetailsModal from './components/ProjectDetailsModal';
import DotGridCanvas from './components/DotGridCanvas';
import MouseGlowCursor from './components/MouseGlowCursor';
import './App.css';

function App() {
  const [isBookCallOpen, setIsBookCallOpen] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [isVerifyCertOpen, setIsVerifyCertOpen] = useState(false);
  const [infoModalTab, setInfoModalTab] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [quoteEmail, setQuoteEmail] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 4500);
  };

  const handleGetQuote = (email) => {
    setQuoteEmail(email);
    setIsQuoteModalOpen(true);
  };

  return (
    <div className="app-wrapper">
      {/* 2px White Glow Cursor Following Ring */}
      <MouseGlowCursor />

      {/* Interactive Dot Grid Canvas with Mouse Ripple & Drift */}
      <DotGridCanvas />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-notification">
          <span className="toast-dot"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Header / Navigation */}
      <Navbar
        onOpenBookCall={() => setIsBookCallOpen(true)}
        onOpenVerifyCert={() => setIsVerifyCertOpen(true)}
        onOpenInfoTab={(tabKey) => setInfoModalTab(tabKey)}
      />

      {/* Main Content Area */}
      <main>
        {/* Hero Section matching reference design */}
        <HeroSection
          onGetQuote={handleGetQuote}
          onOpenReviewDetails={() => setInfoModalTab('why-us')}
        />

        {/* Our Work - Stacking Glass Cards with GSAP ScrollTrigger */}
        <StackedCards />

        {/* Why Work With Us Section */}
        <WhyWorkWithUsSection onOpenBookCall={() => setIsBookCallOpen(true)} />

        {/* Testimonials Section */}
        <TestimonialsSection />

        {/* Frequently Asked Questions (FAQ) Section */}
        <FAQ1 />
      </main>

      {/* Fixed WhatsApp Floating Action Button */}
      <WhatsAppButton />

      {/* Modals for complete interactive experience */}
      <BookCallModal
        isOpen={isBookCallOpen}
        onClose={() => setIsBookCallOpen(false)}
        onShowToast={showToast}
      />

      <QuoteModal
        isOpen={isQuoteModalOpen}
        initialEmail={quoteEmail}
        onClose={() => setIsQuoteModalOpen(false)}
        onShowToast={showToast}
      />

      <VerifyCertificateModal
        isOpen={isVerifyCertOpen}
        onClose={() => setIsVerifyCertOpen(false)}
      />

      <ProjectDetailsModal
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      <InfoModal
        activeTab={infoModalTab}
        onClose={() => setInfoModalTab(null)}
        onOpenBookCall={() => {
          setInfoModalTab(null);
          setIsBookCallOpen(true);
        }}
      />
    </div>
  );
}

export default App;
