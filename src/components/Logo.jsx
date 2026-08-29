import React from 'react';
import logoImg from '../assets/logo.png';

export default function Logo({ className = "" }) {
  return (
    <div
      className={`logo-container ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        cursor: 'pointer',
        userSelect: 'none',
      }}
    >
      <img
        src={logoImg}
        alt="gme Developers Logo"
        className="brand-logo-img"
        style={{
          height: '38px',
          width: 'auto',
          objectFit: 'contain',
          display: 'block',
          filter: 'invert(1) brightness(1.25)',
        }}
      />
    </div>
  );
}
