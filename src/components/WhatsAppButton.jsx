import React, { useState } from 'react';
import { X, Send, MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    const text = message.trim() || "Hello! I'm interested in discussing a project.";
    const url = `https://api.whatsapp.com/send?phone=1234567890&text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    setIsOpen(false);
    setMessage('');
  };

  return (
    <div className="whatsapp-widget-container">
      {isOpen && (
        <div className="whatsapp-popup animate-popup">
          <div className="whatsapp-popup-header">
            <div className="whatsapp-avatar">
              <div className="avatar-circle">gme</div>
              <span className="online-indicator"></span>
            </div>
            <div className="whatsapp-header-text">
              <h4>gme Developers</h4>
              <p>Typically replies within an hour</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="whatsapp-close-btn"
              aria-label="Close chat"
            >
              <X size={18} />
            </button>
          </div>

          <div className="whatsapp-popup-body">
            <div className="whatsapp-bubble">
              <p>👋 Hi there! How can we help you turn your idea into a real product today?</p>
              <span className="bubble-time">Just now</span>
            </div>
          </div>

          <form onSubmit={handleSend} className="whatsapp-popup-footer">
            <input
              type="text"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="whatsapp-input"
            />
            <button type="submit" className="whatsapp-send-btn" aria-label="Send WhatsApp message">
              <Send size={16} />
            </button>
          </form>
        </div>
      )}

      <button
        className="whatsapp-floating-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Chat on WhatsApp"
        title="Chat on WhatsApp"
      >
        <svg
          viewBox="0 0 32 32"
          width="28"
          height="28"
          fill="currentColor"
          className="whatsapp-svg-icon"
        >
          <path d="M16 2C8.28 2 2 8.28 2 16c0 2.66.75 5.15 2.05 7.27L2.6 29.4l6.32-1.42A13.91 13.91 0 0016 30c7.72 0 14-6.28 14-14S23.72 2 16 2zm0 25.66c-2.31 0-4.48-.68-6.3-1.85l-.45-.29-3.75.84.86-3.66-.31-.47A11.58 11.58 0 014.34 16c0-6.43 5.23-11.66 11.66-11.66s11.66 5.23 11.66 11.66c0 6.43-5.23 11.66-11.66 11.66zm6.39-8.73c-.35-.18-2.07-1.02-2.39-1.14-.32-.12-.56-.18-.8.18-.24.35-.92 1.14-1.13 1.37-.21.24-.41.27-.76.09a9.58 9.58 0 01-2.82-1.74 10.6 10.6 0 01-1.95-2.43c-.21-.35-.02-.54.15-.72.16-.16.35-.41.53-.62.18-.21.24-.35.35-.59.12-.24.06-.44-.03-.62-.09-.18-.8-1.92-1.1-2.63-.29-.7-.59-.6-.8-.61h-.69c-.24 0-.62.09-.95.44-.32.35-1.24 1.21-1.24 2.96 0 1.74 1.27 3.43 1.45 3.67.18.24 2.5 3.82 6.06 5.35.85.37 1.51.58 2.02.75.85.27 1.62.23 2.23.14.68-.1 2.07-.85 2.36-1.66.29-.82.29-1.52.21-1.66-.09-.15-.32-.24-.67-.41z" />
        </svg>
      </button>
    </div>
  );
}
