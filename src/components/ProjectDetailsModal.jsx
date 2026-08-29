import React from 'react';
import { X, ExternalLink, Check, Layers, Sparkles, Rocket } from 'lucide-react';

export default function ProjectDetailsModal({ project, isOpen, onClose }) {
  if (!isOpen || !project) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content project-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close project modal">
          <X size={20} />
        </button>

        {/* Modal Banner Image */}
        <div className="project-modal-image-wrap">
          <img src={project.image} alt={project.title} className="project-modal-img" />
          <div className="project-modal-badge-float">
            <span
              className="project-category-tag"
              style={{
                backgroundColor: `${project.badgeColor}30`,
                color: project.badgeColor,
                borderColor: `${project.badgeColor}60`,
              }}
            >
              {project.category}
            </span>
            <span className="project-year-tag">{project.year}</span>
          </div>
        </div>

        {/* Modal Content */}
        <div className="project-modal-info">
          <h3 className="project-modal-title">{project.title}</h3>
          <p className="project-modal-desc">{project.desc}</p>

          {/* Project Highlights / Metrics */}
          {project.stats && (
            <div className="project-stats-highlight-box">
              <Sparkles size={16} color="#38bdf8" />
              <span>{project.stats}</span>
            </div>
          )}

          {/* Tech Stack Pills */}
          <div className="project-tech-stack-section">
            <label className="form-label">
              <Layers size={15} /> Technologies & Architecture
            </label>
            <div className="skills-pills">
              {project.techStack?.map((tech, i) => (
                <span key={i} className="skill-pill">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="project-modal-actions-row">
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="modal-primary-submit-btn"
              style={{ textDecoration: 'none' }}
            >
              <span>Explore Live Platform</span>
              <ExternalLink size={16} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
