import React, { useEffect, useRef, useState } from 'react';
import './FooterGameSection.css';

export default function FooterGameSection({ onOpenBookCall, onOpenVerifyCert, onOpenInfoTab }) {
  const canvasRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    try {
      return parseInt(localStorage.getItem('jime_retro_runner_high') || '0', 10);
    } catch {
      return 0;
    }
  });
  const [isGameOver, setIsGameOver] = useState(false);

  const highScoreRef = useRef(highScore);
  highScoreRef.current = highScore;

  const onOpenBookCallRef = useRef(onOpenBookCall);
  onOpenBookCallRef.current = onOpenBookCall;

  // Web Audio Synth for retro jump and hit sound
  const playRetroSound = (type) => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'jump') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(160, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(620, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
        osc.start();
        osc.stop(ctx.currentTime + 0.12);
      } else if (type === 'hit') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.28);
        gain.gain.setValueAtTime(0.22, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.28);
        osc.start();
        osc.stop(ctx.currentTime + 0.28);
      } else if (type === 'point') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(750, ctx.currentTime);
        osc.frequency.setValueAtTime(1150, ctx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      }
    } catch {
      /* audio not supported */
    }
  };

  const runnerStateRef = useRef({
    running: true,
    crashed: false,
    invulnerableTimer: 0,
    player: {
      x: 90,
      y: 194,
      width: 22,
      height: 22,
      vy: 0,
      jumpForce: -11.2,
      gravity: 0.56,
      groundY: 194,
      isGrounded: true,
      jumpCount: 0,
      maxJumps: 2,
    },
    obstacles: [],
    particles: [],
    stars: [],
    binaryOffset: 0,
    speed: 4.8,
    score: 0,
    spawnTimer: 0,
    nextSpawn: 90,
  });

  const triggerJump = () => {
    const s = runnerStateRef.current;
    if (s.crashed) {
      // Respawn & restart
      s.crashed = false;
      s.score = 0;
      s.obstacles = [];
      s.player.y = s.player.groundY;
      s.player.vy = 0;
      s.player.jumpCount = 0;
      s.invulnerableTimer = 40;
      setScore(0);
      setIsGameOver(false);
      s.running = true;
      setIsPlaying(true);
      return;
    }

    if (!s.running) {
      s.running = true;
      setIsPlaying(true);
      return;
    }

    if (s.player.jumpCount < s.player.maxJumps) {
      s.player.vy = s.player.jumpForce;
      s.player.isGrounded = false;
      s.player.jumpCount += 1;
      playRetroSound('jump');

      // Create jump dust particles
      for (let i = 0; i < 6; i++) {
        s.particles.push({
          x: s.player.x + 11,
          y: s.player.groundY + 22,
          vx: (Math.random() - 0.5) * 3,
          vy: Math.random() * -2 - 0.5,
          size: Math.random() * 2 + 1,
          color: '#00f0ff',
          alpha: 1,
          decay: 0.05,
        });
      }
    }
  };

  const toggleGameState = (e) => {
    if (e) e.stopPropagation();
    const s = runnerStateRef.current;
    s.running = !s.running;
    setIsPlaying(s.running);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;

    let width = (canvas.width = canvas.parentElement ? canvas.parentElement.clientWidth : window.innerWidth);
    const height = (canvas.height = 280);
    const groundY = 215;

    const s = runnerStateRef.current;
    s.player.groundY = groundY - s.player.height;
    s.player.y = s.player.groundY;

    // Background floating stars
    s.stars = Array.from({ length: 40 }, () => ({
      x: Math.random() * width,
      y: Math.random() * (height - 80),
      size: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.6 + 0.2,
      speed: Math.random() * 0.4 + 0.1,
    }));

    const handleResize = () => {
      if (canvas.parentElement) {
        width = canvas.width = canvas.parentElement.clientWidth;
      }
      s.player.groundY = groundY - s.player.height;
      if (s.player.isGrounded) {
        s.player.y = s.player.groundY;
      }
    };

    const handleKeyDown = (e) => {
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
        e.preventDefault();
        triggerJump();
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('keydown', handleKeyDown);

    const createCrashExplosion = (x, y) => {
      for (let i = 0; i < 22; i++) {
        const angle = Math.random() * Math.PI * 2;
        const spd = Math.random() * 5.5 + 1.5;
        s.particles.push({
          x,
          y,
          vx: Math.cos(angle) * spd,
          vy: Math.sin(angle) * spd,
          size: Math.random() * 3.5 + 1.5,
          color: Math.random() > 0.5 ? '#ff3366' : '#00f0ff',
          alpha: 1,
          decay: 0.03,
        });
      }
    };

    const spawnObstacle = () => {
      const types = [
        { type: 'spike', width: 16, height: 22, color: '#ff3366' },
        { type: 'arrow', width: 18, height: 18, color: '#00b4d8', fly: true },
        { type: 'double-spike', width: 34, height: 22, color: '#ff3366' },
      ];
      const selected = types[Math.floor(Math.random() * types.length)];
      const yPos = selected.fly ? groundY - 44 : groundY - selected.height;

      // Ensure minimum distance from last obstacle
      const lastObs = s.obstacles[s.obstacles.length - 1];
      if (lastObs && lastObs.x > width - 260) {
        return; // Don't spawn too close
      }

      s.obstacles.push({
        x: width + 30,
        y: yPos,
        width: selected.width,
        height: selected.height,
        color: selected.color,
        type: selected.type,
        passed: false,
      });
    };

    // Main 60fps Runner Loop
    const loop = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Starfield
      for (let star of s.stars) {
        if (s.running && !s.crashed) {
          star.x -= star.speed;
          if (star.x < 0) star.x = width;
        }
        ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
        ctx.fillRect(star.x, star.y, star.size, star.size);
      }

      if (s.invulnerableTimer > 0) {
        s.invulnerableTimer--;
      }

      if (s.running && !s.crashed) {
        // Player Physics
        s.player.y += s.player.vy;
        s.player.vy += s.player.gravity;

        // Ground collision
        if (s.player.y >= s.player.groundY) {
          s.player.y = s.player.groundY;
          s.player.vy = 0;
          s.player.isGrounded = true;
          s.player.jumpCount = 0;
        }

        // Spawn obstacles
        s.spawnTimer++;
        if (s.spawnTimer > s.nextSpawn) {
          spawnObstacle();
          s.spawnTimer = 0;
          s.nextSpawn = Math.floor(Math.random() * 50) + 70;
        }

        // Dynamic Speed
        s.speed = Math.min(8.2, 4.8 + s.score * 0.07);

        // Update Obstacles
        for (let i = s.obstacles.length - 1; i >= 0; i--) {
          const obs = s.obstacles[i];
          obs.x -= s.speed;

          // Check Score passing
          if (!obs.passed && obs.x < s.player.x) {
            obs.passed = true;
            s.score += 1;
            setScore(s.score);
            playRetroSound('point');

            if (s.score > highScoreRef.current) {
              setHighScore(s.score);
              try {
                localStorage.setItem('jime_retro_runner_high', s.score.toString());
              } catch {}
            }
          }

          // AABB Hitbox Collision Check
          if (s.invulnerableTimer === 0) {
            const p = s.player;
            const padX = 5;
            const padY = 4;
            if (
              p.x + p.width - padX > obs.x &&
              p.x + padX < obs.x + obs.width &&
              p.y + p.height - padY > obs.y &&
              p.y + padY < obs.y + obs.height
            ) {
              // Player Hit / Out
              createCrashExplosion(p.x + 11, p.y + 11);
              playRetroSound('hit');
              s.crashed = true;
              setIsGameOver(true);

              // Automatically take user to Book a Call!
              if (onOpenBookCallRef.current) {
                setTimeout(() => {
                  onOpenBookCallRef.current();
                }, 450);
              }
              break;
            }
          }

          // Off-screen removal
          if (obs.x < -80) {
            s.obstacles.splice(i, 1);
          }
        }

        // Scroll Binary Stream
        s.binaryOffset = (s.binaryOffset - s.speed * 0.6) % 300;
      }

      // 2. Draw Obstacles
      for (let obs of s.obstacles) {
        ctx.save();
        ctx.fillStyle = obs.color;
        ctx.shadowColor = obs.color;
        ctx.shadowBlur = 10;

        if (obs.type === 'spike') {
          // Neon Triangle Spike
          ctx.beginPath();
          ctx.moveTo(obs.x + obs.width / 2, obs.y);
          ctx.lineTo(obs.x + obs.width, obs.y + obs.height);
          ctx.lineTo(obs.x, obs.y + obs.height);
          ctx.closePath();
          ctx.fill();
        } else if (obs.type === 'double-spike') {
          // Double Spikes
          const half = obs.width / 2;
          ctx.beginPath();
          ctx.moveTo(obs.x + half / 2, obs.y);
          ctx.lineTo(obs.x + half, obs.y + obs.height);
          ctx.lineTo(obs.x, obs.y + obs.height);
          ctx.closePath();
          ctx.fill();

          ctx.beginPath();
          ctx.moveTo(obs.x + half + half / 2, obs.y);
          ctx.lineTo(obs.x + obs.width, obs.y + obs.height);
          ctx.lineTo(obs.x + half, obs.y + obs.height);
          ctx.closePath();
          ctx.fill();
        } else if (obs.type === 'arrow') {
          // Downward Chevron / Floating Obstacle
          ctx.beginPath();
          ctx.moveTo(obs.x, obs.y);
          ctx.lineTo(obs.x + obs.width / 2, obs.y + obs.height);
          ctx.lineTo(obs.x + obs.width, obs.y);
          ctx.lineTo(obs.x + obs.width / 2, obs.y + obs.height - 6);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
      }

      // 3. Draw Player (Glowing Cyan Cube Runner)
      if (!s.crashed || s.invulnerableTimer > 0) {
        const isBlinking = s.invulnerableTimer > 0 && Math.floor(s.invulnerableTimer / 4) % 2 === 0;
        if (!isBlinking) {
          ctx.save();
          ctx.fillStyle = '#00f0ff';
          ctx.shadowColor = '#00f0ff';
          ctx.shadowBlur = 14;
          ctx.beginPath();
          ctx.roundRect(s.player.x, s.player.y, s.player.width, s.player.height, 3);
          ctx.fill();

          // Inner specular light
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(s.player.x + 3, s.player.y + 3, s.player.width - 6, 4);
          ctx.restore();
        }
      }

      // 4. Draw Cyan Ground Line
      ctx.save();
      ctx.strokeStyle = '#00b4d8';
      ctx.shadowColor = '#00b4d8';
      ctx.shadowBlur = 8;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      ctx.lineTo(width, groundY);
      ctx.stroke();
      ctx.restore();

      // 5. Draw Binary Code Stream Under Ground Line
      ctx.save();
      ctx.font = '8px monospace';
      ctx.fillStyle = 'rgba(0, 180, 216, 0.45)';
      ctx.letterSpacing = '1px';
      const binaryText =
        '01100100110010100111001001101111011010100110010101100011011101000111100001000001011100100110001101100001011001000110010101101010011010010110110101100101011001000110010101110110';
      const repeated = binaryText.repeat(8);
      ctx.fillText(repeated, s.binaryOffset, groundY + 14);
      ctx.restore();

      // 6. Draw Particles
      for (let i = s.particles.length - 1; i >= 0; i--) {
        const p = s.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          s.particles.splice(i, 1);
          continue;
        }

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      animationId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <footer className="footer-section">
      {/* 1. Main Studio Navigation Footer Above */}
      <div className="footer-container">
        <div className="footer-main-grid">
          {/* Column 1: Brand & Info */}
          <div className="footer-brand-col">
            <div className="footer-logo-row">
              <img src="/logo.png" alt="Jime Developers Logo" className="footer-logo-img" />
            </div>
            <p className="footer-description">
              A web development studio building websites and apps for founders and small businesses. Based in Tamil Nadu, working with clients across India and Malaysia.
            </p>
            <div className="footer-social-row">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-icon"
                aria-label="Instagram"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-icon"
                aria-label="LinkedIn"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                  <rect width="4" height="12" x="2" y="9"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: SERVICES */}
          <div className="footer-links-col">
            <h4 className="footer-col-title">SERVICES</h4>
            <ul className="footer-links-list">
              <li><a href="#work">Web Development</a></li>
              <li><a href="#work">E-commerce Development</a></li>
              <li><a href="#work">Mobile App Development</a></li>
              <li><a href="#work">Web App & SaaS</a></li>
            </ul>
          </div>

          {/* Column 3: COMPANY */}
          <div className="footer-links-col">
            <h4 className="footer-col-title">COMPANY</h4>
            <ul className="footer-links-list">
              <li>
                <button
                  type="button"
                  className="footer-link-button"
                  onClick={() => onOpenInfoTab && onOpenInfoTab('why-us')}
                >
                  About Us
                </button>
              </li>
              <li><a href="#blog">Blog</a></li>
              <li>
                <button
                  type="button"
                  className="footer-link-button"
                  onClick={onOpenBookCall}
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: LEGAL */}
          <div className="footer-links-col">
            <h4 className="footer-col-title">LEGAL</h4>
            <ul className="footer-links-list">
              <li>
                <button
                  type="button"
                  className="footer-link-button"
                  onClick={() => onOpenInfoTab && onOpenInfoTab('services')}
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="footer-link-button"
                  onClick={() => onOpenInfoTab && onOpenInfoTab('pricing')}
                >
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="footer-bottom-bar">
          <p className="footer-copyright">
            © 2026 Jime Developers. All rights reserved.
          </p>
        </div>
      </div>

      {/* 2. 8-Bit Retro Runner Game Canvas Banner Below The Footer */}
      <div
        className="retro-runner-banner"
        onClick={triggerJump}
        role="button"
        tabIndex={0}
        aria-label="Click or press Spacebar to jump"
      >
        {/* Canvas Engine */}
        <canvas ref={canvasRef} className="retro-runner-canvas" />

        {/* UI Overlay Content matching exact reference image */}
        <div className="retro-runner-overlay">
          {/* Left: Watermark Brand Title */}
          <div className="runner-left-col">
            <h3 className="runner-brand-watermark">JIME DEVELOPERS</h3>
            <p className="runner-created-by">
              Created by <strong>Jime Developers</strong> © 2026
            </p>
          </div>

          {/* Center: Retro 8-Bit Score Counter */}
          <div className="runner-center-col">
            <div className="runner-score-row">
              <span className="runner-cross-symbol">x</span>
              <span className="runner-score-num">{score}</span>
            </div>
            <span className="runner-instructions">
              {isGameOver ? 'CRASHED! CLICK TO RESPAWN' : 'JUMP RETRO OBSTACLES'}
            </span>
          </div>

          {/* Right: STOP/PLAY Game & Social Links */}
          <div className="runner-right-col">
            <div className="runner-bet-box">
              <button
                type="button"
                className="runner-stop-btn"
                onClick={toggleGameState}
              >
                <u>{isPlaying ? 'STOP' : 'PLAY'}</u> this game,
              </button>
              <h4 className="runner-bet-title">Bet you can win.</h4>
            </div>

            <div className="runner-social-links">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="runner-social-item"
                onClick={(e) => e.stopPropagation()}
              >
                LinkedIn
              </a>
              <span className="runner-social-pipe">|</span>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="runner-social-item"
                onClick={(e) => e.stopPropagation()}
              >
                GitHub
              </a>
              <span className="runner-social-pipe">|</span>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="runner-social-item"
                onClick={(e) => e.stopPropagation()}
              >
                Instagram
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
