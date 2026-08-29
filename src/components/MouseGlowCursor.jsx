import React, { useEffect, useRef } from 'react';

export default function MouseGlowCursor() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouse = { x: -300, y: -300 };
    let cursor = { x: -300, y: -300 };
    let isVisible = false;

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      isVisible = true;
    };

    const handleMouseLeave = () => {
      isVisible = false;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      if (isVisible) {
        // Smooth cursor interpolation
        cursor.x += (mouse.x - cursor.x) * 0.35;
        cursor.y += (mouse.y - cursor.y) * 0.35;

        const glowRadius = 100;

        ctx.save();
        // Create subtle diffused radial electric blue glow around mouse
        const gradient = ctx.createRadialGradient(
          cursor.x,
          cursor.y,
          0,
          cursor.x,
          cursor.y,
          glowRadius
        );
        gradient.addColorStop(0, 'rgba(0, 180, 216, 0.10)');
        gradient.addColorStop(0.35, 'rgba(0, 148, 232, 0.04)');
        gradient.addColorStop(0.7, 'rgba(23, 195, 178, 0.01)');
        gradient.addColorStop(1, 'rgba(0, 180, 216, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(cursor.x, cursor.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 50,
      }}
    />
  );
}
