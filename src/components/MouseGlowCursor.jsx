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

    let mouse = { x: -100, y: -100 };
    let cursor = { x: -100, y: -100 };
    let isVisible = false;
    let isHovering = false;
    let isClicking = false;
    let currentRadius = 14;
    let targetRadius = 14;

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      isVisible = true;

      // Check if hovering over clickable element
      const target = e.target;
      if (
        target &&
        (target.tagName === 'BUTTON' ||
          target.tagName === 'A' ||
          target.tagName === 'INPUT' ||
          target.closest('button') ||
          target.closest('a') ||
          target.getAttribute('role') === 'button')
      ) {
        isHovering = true;
        targetRadius = 20;
      } else {
        isHovering = false;
        targetRadius = 13;
      }
    };

    const handleMouseDown = () => {
      isClicking = true;
      targetRadius = 10;
    };

    const handleMouseUp = () => {
      isClicking = false;
      targetRadius = isHovering ? 20 : 13;
    };

    const handleMouseLeave = () => {
      isVisible = false;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      if (isVisible) {
        // Smooth lerp following
        cursor.x += (mouse.x - cursor.x) * 0.45;
        cursor.y += (mouse.y - cursor.y) * 0.45;
        currentRadius += (targetRadius - currentRadius) * 0.25;

        ctx.save();

        // 1. Outer 2px Crisp White Glowing Ring
        ctx.beginPath();
        ctx.arc(cursor.x, cursor.y, currentRadius, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.lineWidth = 2;
        ctx.shadowColor = 'rgba(255, 255, 255, 0.9)';
        ctx.shadowBlur = 8;
        ctx.stroke();

        // 2. Secondary subtle ambient white diffusion
        ctx.beginPath();
        ctx.arc(cursor.x, cursor.y, currentRadius, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.lineWidth = 1;
        ctx.shadowColor = 'rgba(255, 255, 255, 0.6)';
        ctx.shadowBlur = 14;
        ctx.stroke();

        // 3. Center pinpoint white dot (2px)
        ctx.beginPath();
        ctx.arc(cursor.x, cursor.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = 'rgba(255, 255, 255, 1)';
        ctx.shadowBlur = 5;
        ctx.fill();

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
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
        zIndex: 99999,
      }}
    />
  );
}
