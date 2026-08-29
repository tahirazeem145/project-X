import React, { useEffect, useRef } from 'react';

export default function DotGridCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const spacing = 28;
    let dots = [];
    let totalGridWidth = 0;
    let totalGridHeight = 0;

    // Mouse tracking with smooth interpolation
    const mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      radius: 90, // Gentle ripple radius
    };

    function initDots() {
      dots = [];
      const cols = Math.ceil(width / spacing) + 6;
      const rows = Math.ceil(height / spacing) + 6;
      totalGridWidth = cols * spacing;
      totalGridHeight = rows * spacing;

      for (let i = -3; i < cols - 3; i++) {
        for (let j = -3; j < rows - 3; j++) {
          const x = i * spacing;
          const y = j * spacing;
          dots.push({
            baseX: x,
            baseY: y,
            x: x,
            y: y,
            vx: 0,
            vy: 0,
            size: 1.35,
            baseSize: 1.35,
            color: 'rgba(255, 255, 255, 0.20)',
          });
        }
      }
    }

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initDots();
    };

    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.targetX = -1000;
      mouse.targetY = -1000;
    };

    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        mouse.targetX = e.touches[0].clientX;
        mouse.targetY = e.touches[0].clientY;
      }
    };

    const handleTouchEnd = () => {
      mouse.targetX = -1000;
      mouse.targetY = -1000;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    initDots();

    // Slow drift speed (pixels per frame)
    const driftSpeedX = 0.2;
    const driftSpeedY = 0.2;

    const render = () => {
      // Smooth mouse movement interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.12;
      mouse.y += (mouse.targetY - mouse.y) * 0.12;

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];

        // 1. Continuous slow drift forward
        dot.baseX += driftSpeedX;
        dot.baseY += driftSpeedY;

        // 2. Off-screen wrapping (Only wraps invisible dots off-screen so visible dots never jump)
        if (dot.baseX > width + spacing * 2) {
          dot.baseX -= totalGridWidth;
          dot.x -= totalGridWidth;
        }
        if (dot.baseY > height + spacing * 2) {
          dot.baseY -= totalGridHeight;
          dot.y -= totalGridHeight;
        }

        // 3. Distance from mouse cursor
        const dx = mouse.x - dot.x;
        const dy = mouse.y - dot.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // 4. Subtle, gentle mouse ripple effect
        if (dist < mouse.radius && mouse.x > 0 && mouse.y > 0) {
          const force = 1 - dist / mouse.radius;
          const angle = Math.atan2(dy, dx);
          // Soft push force
          const pushX = Math.cos(angle) * force * 5.5;
          const pushY = Math.sin(angle) * force * 5.5;

          dot.vx -= pushX * 0.08;
          dot.vy -= pushY * 0.08;

          // Subtle size and soft cyan glow
          dot.size = dot.baseSize + force * 0.4;
          const alpha = 0.20 + force * 0.32;
          dot.color = `rgba(56, 189, 248, ${alpha})`;
        } else {
          dot.size += (dot.baseSize - dot.size) * 0.1;
          dot.color = 'rgba(255, 255, 255, 0.20)';
        }

        // 5. Smooth elastic spring to current moving base position
        const springX = (dot.baseX - dot.x) * 0.08;
        const springY = (dot.baseY - dot.y) * 0.08;

        dot.vx = (dot.vx + springX) * 0.82;
        dot.vy = (dot.vy + springY) * 0.82;

        dot.x += dot.vx;
        dot.y += dot.vy;

        // 6. Draw dot (only if within or near viewport)
        if (dot.x >= -spacing && dot.x <= width + spacing && dot.y >= -spacing && dot.y <= height + spacing) {
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, Math.max(0.5, dot.size), 0, Math.PI * 2);
          ctx.fillStyle = dot.color;
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="dot-grid-canvas"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}
