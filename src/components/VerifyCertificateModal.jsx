import React, { useState } from 'react';
import { X, Award, Search, CheckCircle, AlertCircle } from 'lucide-react';

export default function VerifyCertificateModal({ isOpen, onClose }) {
  const [certId, setCertId] = useState('');
  const [verifiedData, setVerifiedData] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  if (!isOpen) return null;

  const handleVerify = (e) => {
    e.preventDefault();
    setHasSearched(true);
    if (certId.trim().toUpperCase() === 'GME-2026' || certId.trim().length > 3) {
      setVerifiedData({
        id: certId.trim().toUpperCase() || 'GME-DEV-8849',
        recipient: 'Alex Morgan',
        course: 'Full-Stack Modern Web Engineering Masterclass',
        issuedDate: 'August 14, 2026',
        status: 'Verified Official Graduate',
        skills: ['React 19', 'Next.js', 'TypeScript', 'Node.js API Architecture', 'Cloud Deployment'],
      });
    } else {
      setVerifiedData(null);
    }
  };

  const handleClose = () => {
    setCertId('');
    setVerifiedData(null);
    setHasSearched(false);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={handleClose} aria-label="Close verify certificate modal">
          <X size={20} />
        </button>

        <div className="modal-header">
          <div className="verify-badge-icon">
            <Award size={28} color="#0a8898" />
          </div>
          <h3 className="modal-title">Verify gme Certificate</h3>
          <p className="modal-desc">
            Enter the unique credential ID issued to students, apprentices, and certified developers.
          </p>
        </div>

        <form onSubmit={handleVerify} className="verify-search-form">
          <div className="verify-search-input-wrap">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="e.g. GME-2026 or Certificate ID"
              value={certId}
              onChange={(e) => setCertId(e.target.value)}
              className="verify-input"
              required
            />
            <button type="submit" className="verify-btn">
              Verify
            </button>
          </div>
        </form>

        {hasSearched && (
          <div className="verify-results-container">
            {verifiedData ? (
              <div className="cert-card-result">
                <div className="cert-status-badge">
                  <CheckCircle size={16} color="#16a34a" /> <span>Authentic Certificate</span>
                </div>
                <h4 className="cert-recipient">{verifiedData.recipient}</h4>
                <p className="cert-course">{verifiedData.course}</p>
                <div className="cert-meta-grid">
                  <div>
                    <span className="meta-lbl">Credential ID:</span>
                    <strong>{verifiedData.id}</strong>
                  </div>
                  <div>
                    <span className="meta-lbl">Issued On:</span>
                    <strong>{verifiedData.issuedDate}</strong>
                  </div>
                </div>
                <div className="skills-pills">
                  {verifiedData.skills.map((skill, i) => (
                    <span key={i} className="skill-pill">{skill}</span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="cert-not-found">
                <AlertCircle size={32} color="#ef4444" />
                <h4>Certificate Not Found</h4>
                <p>Please double-check the credential ID or contact support.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
