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

    // Mouse tracking & trail points
    const mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      connectRadius: 135, // Distance to connect white lines to dots
    };

    // Trailing path of mouse movements
    let mouseTrail = [];

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
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;

      // Add point to smooth mouse trail
      mouseTrail.push({
        x: e.clientX,
        y: e.clientY,
        life: 1.0,
      });
      if (mouseTrail.length > 25) {
        mouseTrail.shift();
      }

      const now = performance.now();
      const dx = e.clientX - lastMousePos.x;
      const dy = e.clientY - lastMousePos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 16 || now - lastRippleTime > 120) {
        spawnRipple(e.clientX, e.clientY, 150, Math.min(1.2, Math.max(0.6, dist / 25)));
        lastMousePos = { x: e.clientX, y: e.clientY };
        lastRippleTime = now;
      }
    };

    const handleMouseLeave = () => {
      mouse.targetX = -1000;
      mouse.targetY = -1000;
      mouseTrail = [];
    };

    const handleClick = (e) => {
      spawnRipple(e.clientX, e.clientY, 240, 1.8);
    };

    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        mouse.targetX = touch.clientX;
        mouse.targetY = touch.clientY;

        mouseTrail.push({
          x: touch.clientX,
          y: touch.clientY,
          life: 1.0,
        });
        if (mouseTrail.length > 25) {
          mouseTrail.shift();
        }

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

    const handleTouchEnd = () => {
      mouse.targetX = -1000;
      mouse.targetY = -1000;
      mouseTrail = [];
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('click', handleClick);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    initDots();

    // Constant slow drift speed
    const driftSpeedX = 0.2;
    const driftSpeedY = 0.2;

    const render = () => {
      // Fluid mouse easing
      mouse.x += (mouse.targetX - mouse.x) * 0.18;
      mouse.y += (mouse.targetY - mouse.y) * 0.18;

      ctx.clearRect(0, 0, width, height);

      // 1. Update and draw smooth white trail line following cursor path
      if (mouseTrail.length > 1) {
        ctx.save();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        for (let t = 0; t < mouseTrail.length - 1; t++) {
          const p1 = mouseTrail[t];
          const p2 = mouseTrail[t + 1];
          p1.life *= 0.92; // fade over time

          if (p1.life > 0.05) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${p1.life * 0.75})`;
            ctx.lineWidth = (t / mouseTrail.length) * 2.5 + 0.5;
            ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
            ctx.shadowBlur = 6;
            ctx.stroke();
          }
        }
        ctx.restore();

        // Clean up faded points
        mouseTrail = mouseTrail.filter((p) => p.life > 0.05);
      }

      // 2. Update active ripple waves
      for (let r = ripples.length - 1; r >= 0; r--) {
        const ripple = ripples[r];
        ripple.radius += ripple.speed;
        ripple.strength *= 0.96;

        if (ripple.radius > ripple.maxRadius || ripple.strength < 0.02) {
          ripples.splice(r, 1);
        }
      }

      // Store nearby dots for inter-dot white connecting lines
      const nearbyDots = [];

      // 3. Update physics and collect dots
      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];

        // Continuous slow drift
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

        // Apply wave impulse
        dot.vx += totalPushX * 0.15;
        dot.vy += totalPushY * 0.15;

        // Spring returning to base grid
        const springX = (dot.baseX - dot.x) * 0.08;
        const springY = (dot.baseY - dot.y) * 0.08;

        dot.vx = (dot.vx + springX) * 0.82;
        dot.vy = (dot.vy + springY) * 0.82;

        dot.x += dot.vx;
        dot.y += dot.vy;

        dot.glow += (maxGlow - dot.glow) * 0.2;

        // Check if dot is near the moving mouse
        if (mouse.x > 0 && mouse.y > 0) {
          const dxM = mouse.x - dot.x;
          const dyM = mouse.y - dot.y;
          const distM = Math.sqrt(dxM * dxM + dyM * dyM);

          if (distM < mouse.connectRadius) {
            nearbyDots.push({ dot, dist: distM });
          }
        }
      }

      // 4. DRAW WHITE CONNECTING LINES FROM MOUSE TO NEARBY DOTS
      if (mouse.x > 0 && mouse.y > 0 && nearbyDots.length > 0) {
        ctx.save();
        ctx.lineWidth = 1.2;
        ctx.shadowColor = 'rgba(255, 255, 255, 0.6)';
        ctx.shadowBlur = 4;

        // Connect mouse to each nearby dot with crisp white lines
        for (let n = 0; n < nearbyDots.length; n++) {
          const { dot, dist } = nearbyDots[n];
          const lineAlpha = (1 - dist / mouse.connectRadius) * 0.75;

          ctx.beginPath();
          ctx.moveTo(mouse.x, mouse.y);
          ctx.lineTo(dot.x, dot.y);
          ctx.strokeStyle = `rgba(255, 255, 255, ${lineAlpha})`;
          ctx.stroke();
        }

        // Also connect neighboring dots to each other within the cursor field
        ctx.lineWidth = 0.8;
        for (let a = 0; a < nearbyDots.length; a++) {
          for (let b = a + 1; b < nearbyDots.length; b++) {
            const d1 = nearbyDots[a].dot;
            const d2 = nearbyDots[b].dot;
            const dx = d1.x - d2.x;
            const dy = d1.y - d2.y;
            const distBetween = Math.sqrt(dx * dx + dy * dy);

            if (distBetween < spacing * 1.5) {
              const meshAlpha =
                (1 - distBetween / (spacing * 1.5)) *
                (1 - (nearbyDots[a].dist + nearbyDots[b].dist) / (2 * mouse.connectRadius)) *
                0.5;

              if (meshAlpha > 0.02) {
                ctx.beginPath();
                ctx.moveTo(d1.x, d1.y);
                ctx.lineTo(d2.x, d2.y);
                ctx.strokeStyle = `rgba(255, 255, 255, ${meshAlpha})`;
                ctx.stroke();
              }
            }
          }
        }

        ctx.restore();
      }

      // 5. Draw dots
      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];

        if (dot.x >= -spacing && dot.x <= width + spacing && dot.y >= -spacing && dot.y <= height + spacing) {
          const currentSize = dot.baseSize + dot.glow * 0.8;
          const alpha = 0.20 + dot.glow * 0.55;

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
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('click', handleClick);
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
