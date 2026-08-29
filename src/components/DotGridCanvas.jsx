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

    // Active radiating ripple waves
    let ripples = [];
    let lastMousePos = { x: -1000, y: -1000 };
    let lastRippleTime = 0;

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
            glow: 0,
          });
        }
      }
    }

    const spawnRipple = (x, y, maxRadius = 160, power = 1.0) => {
      // Limit simultaneous ripples for high performance
      if (ripples.length > 8) ripples.shift();
      ripples.push({
        x,
        y,
        radius: 4,
        maxRadius,
        speed: 4.5,
        strength: power,
        wavelength: 22,
      });
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initDots();
    };

    const handleMouseMove = (e) => {
      const now = performance.now();
      const dx = e.clientX - lastMousePos.x;
      const dy = e.clientY - lastMousePos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Trigger ripple wave when mouse moves
      if (dist > 16 || now - lastRippleTime > 120) {
        spawnRipple(e.clientX, e.clientY, 150, Math.min(1.2, Math.max(0.6, dist / 25)));
        lastMousePos = { x: e.clientX, y: e.clientY };
        lastRippleTime = now;
      }
    };

    const handleClick = (e) => {
      // Stronger expanding ripple wave on click/tap
      spawnRipple(e.clientX, e.clientY, 240, 1.8);
    };

    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const now = performance.now();
        const dx = touch.clientX - lastMousePos.x;
        const dy = touch.clientY - lastMousePos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 18 || now - lastRippleTime > 140) {
          spawnRipple(touch.clientX, touch.clientY, 140, 1.0);
          lastMousePos = { x: touch.clientX, y: touch.clientY };
          lastRippleTime = now;
        }
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('click', handleClick);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    initDots();

    // Constant slow drift speed
    const driftSpeedX = 0.2;
    const driftSpeedY = 0.2;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Update active ripple waves
      for (let r = ripples.length - 1; r >= 0; r--) {
        const ripple = ripples[r];
        ripple.radius += ripple.speed;
        ripple.strength *= 0.96; // fade strength as wave propagates

        if (ripple.radius > ripple.maxRadius || ripple.strength < 0.02) {
          ripples.splice(r, 1);
        }
      }

      // 2. Update and draw dots
      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];

        // Smooth continuous drift forward
        dot.baseX += driftSpeedX;
        dot.baseY += driftSpeedY;

        // Seamless offscreen wrap
        if (dot.baseX > width + spacing * 2) {
          dot.baseX -= totalGridWidth;
          dot.x -= totalGridWidth;
        }
        if (dot.baseY > height + spacing * 2) {
          dot.baseY -= totalGridHeight;
          dot.y -= totalGridHeight;
        }

        let totalPushX = 0;
        let totalPushY = 0;
        let maxGlow = 0;

        // Apply ripple waves displacement
        for (let r = 0; r < ripples.length; r++) {
          const ripple = ripples[r];
          const dx = dot.x - ripple.x;
          const dy = dot.y - ripple.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          const waveDist = Math.abs(dist - ripple.radius);

          if (waveDist < ripple.wavelength * 1.5 && dist > 1) {
            // Sine wave profile across the wave ring
            const waveFactor = Math.cos((waveDist / (ripple.wavelength * 1.5)) * (Math.PI / 2));
            const wavePhase = Math.sin((dist - ripple.radius) / ripple.wavelength * Math.PI);
            const displacement = wavePhase * waveFactor * ripple.strength * 7;

            const angle = Math.atan2(dy, dx);
            totalPushX += Math.cos(angle) * displacement;
            totalPushY += Math.sin(angle) * displacement;

            const glowAmount = waveFactor * ripple.strength;
            if (glowAmount > maxGlow) {
              maxGlow = glowAmount;
            }
          }
        }

        // Apply wave impulse to velocity
        dot.vx += totalPushX * 0.15;
        dot.vy += totalPushY * 0.15;

        // Spring force returning to base grid position
        const springX = (dot.baseX - dot.x) * 0.08;
        const springY = (dot.baseY - dot.y) * 0.08;

        dot.vx = (dot.vx + springX) * 0.82;
        dot.vy = (dot.vy + springY) * 0.82;

        dot.x += dot.vx;
        dot.y += dot.vy;

        // Size & Color glow
        dot.glow += (maxGlow - dot.glow) * 0.2;
        const currentSize = dot.baseSize + dot.glow * 0.8;
        const alpha = 0.20 + dot.glow * 0.55;

        // Render dot
        if (dot.x >= -spacing && dot.x <= width + spacing && dot.y >= -spacing && dot.y <= height + spacing) {
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, Math.max(0.5, currentSize), 0, Math.PI * 2);
          if (dot.glow > 0.05) {
            ctx.fillStyle = `rgba(56, 189, 248, ${alpha})`;
          } else {
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
          }
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('touchmove', handleTouchMove);
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
