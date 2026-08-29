import React from 'react';

export default function AmbientSmokeBackground() {
  return (
    <div className="global-smoke-container" aria-hidden="true">
      {/* Volumetric Smoke Plumes drifting across the entire viewport and all sections */}
      <div className="smoke-plume smoke-top-left" />
      <div className="smoke-plume smoke-top-right" />
      <div className="smoke-plume smoke-center-drift" />
      <div className="smoke-plume smoke-bottom-left" />
      <div className="smoke-plume smoke-bottom-right" />
      <div className="smoke-plume smoke-ambient-pulse" />
    </div>
  );
}
