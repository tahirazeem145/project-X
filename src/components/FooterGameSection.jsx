import React, { useEffect, useRef, useState } from 'react';
import { Play, RotateCcw, Trophy, Sparkles, Volume2, VolumeX, Shield, Zap, Heart, ArrowUpRight } from 'lucide-react';
import './FooterGameSection.css';

export default function FooterGameSection({ onOpenBookCall, onOpenVerifyCert, onOpenInfoTab }) {
  const canvasRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    try {
      return parseInt(localStorage.getItem('jime_game_highscore') || '0', 10);
    } catch {
      return 0;
    }
  });
  const [lives, setLives] = useState(3);
  const [hasUnlockedDiscount, setHasUnlockedDiscount] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const gameStateRef = useRef({
    player: { x: 300, y: 340, width: 32, height: 26, speed: 6, vx: 0 },
    lasers: [],
    enemies: [],
    particles: [],
    stars: [],
    lastShot: 0,
    enemySpawnTimer: 0,
    keys: {},
    mousePos: { x: 300, y: 340 },
    score: 0,
    lives: 3,
    running: false,
  });

  // Sound Synth using Web Audio API
  const playSound = (type) => {
    if (!soundEnabled) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'laser') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
        osc.start();
        osc.stop(ctx.currentTime + 0.12);
      } else if (type === 'hit') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(200, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      } else if (type === 'unlock') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08); // E5
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.16); // G5
        osc.frequency.setValueAtTime(1046.5, ctx.currentTime + 0.24); // C6
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      }
    } catch {
      // AudioContext not supported
    }
  };

  const startGame = () => {
    setIsPlaying(true);
    setIsGameOver(false);
    setScore(0);
    setLives(3);

    const state = gameStateRef.current;
    state.player.x = 300;
    state.player.y = 340;
    state.lasers = [];
    state.enemies = [];
    state.particles = [];
    state.score = 0;
    state.lives = 3;
    state.running = true;
    state.enemySpawnTimer = 0;
  };

  const restartGame = () => {
    startGame();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;

    const width = (canvas.width = 600);
    const height = (canvas.height = 380);

    // Generate static backdrop starfield
    const stars = Array.from({ length: 45 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.5 + 0.5,
      speed: Math.random() * 0.4 + 0.2,
      alpha: Math.random() * 0.7 + 0.3,
    }));
    gameStateRef.current.stars = stars;

    const handleKeyDown = (e) => {
      gameStateRef.current.keys[e.code] = true;
      if (e.code === 'Space' && gameStateRef.current.running) {
        e.preventDefault();
      }
    };

    const handleKeyUp = (e) => {
      gameStateRef.current.keys[e.code] = false;
    };

    const handleCanvasMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const clientX = e.clientX - rect.left;
      gameStateRef.current.mousePos.x = clientX * scaleX;
    };

    const handleCanvasMouseDown = () => {
      if (!gameStateRef.current.running) {
        startGame();
      } else {
        shootLaser();
      }
    };

    const handleTouchMove = (e) => {
      if (!e.touches[0]) return;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const clientX = e.touches[0].clientX - rect.left;
      gameStateRef.current.mousePos.x = clientX * scaleX;
      if (gameStateRef.current.running) {
        shootLaser();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    canvas.addEventListener('mousemove', handleCanvasMouseMove);
    canvas.addEventListener('mousedown', handleCanvasMouseDown);
    canvas.addEventListener('touchmove', handleTouchMove, { passive: true });

    const shootLaser = () => {
      const state = gameStateRef.current;
      const now = Date.now();
      if (now - state.lastShot > 140) {
        state.lasers.push({
          x: state.player.x - 6,
          y: state.player.y - 12,
          vx: 0,
          vy: -8,
        });
        state.lasers.push({
          x: state.player.x + 6,
          y: state.player.y - 12,
          vx: 0,
          vy: -8,
        });
        state.lastShot = now;
        playSound('laser');
      }
    };

    const spawnEnemy = () => {
      const bugTypes = [
        { label: 'BUG', color: '#ff3366', points: 20, speed: 1.8, size: 20 },
        { label: '404', color: '#00b4d8', points: 30, speed: 2.2, size: 22 },
        { label: 'LAG', color: '#ffb703', points: 50, speed: 2.8, size: 24 },
        { label: 'NULL', color: '#a855f7', points: 40, speed: 2.0, size: 22 },
      ];
      const type = bugTypes[Math.floor(Math.random() * bugTypes.length)];
      gameStateRef.current.enemies.push({
        x: Math.random() * (width - 60) + 30,
        y: -20,
        ...type,
      });
    };

    const createExplosion = (x, y, color) => {
      for (let i = 0; i < 14; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4 + 1.5;
        gameStateRef.current.particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 2.5 + 1,
          color,
          alpha: 1,
          decay: Math.random() * 0.04 + 0.02,
        });
      }
    };

    const loop = () => {
      ctx.clearRect(0, 0, width, height);

      const state = gameStateRef.current;

      // 1. Draw Starfield
      for (let star of state.stars) {
        star.y += star.speed;
        if (star.y > height) star.y = 0;
        ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
        ctx.fillRect(star.x, star.y, star.size, star.size);
      }

      if (state.running) {
        // Player keyboard / mouse smoothing
        if (state.keys['ArrowLeft'] || state.keys['KeyA']) {
          state.player.x -= state.player.speed;
        } else if (state.keys['ArrowRight'] || state.keys['KeyD']) {
          state.player.x += state.player.speed;
        } else {
          state.player.x += (state.mousePos.x - state.player.x) * 0.2;
        }

        if (state.keys['Space']) {
          shootLaser();
        }

        // Clamp player in bounds
        state.player.x = Math.max(20, Math.min(width - 20, state.player.x));

        // Spawn Enemies
        state.enemySpawnTimer++;
        if (state.enemySpawnTimer > 38) {
          spawnEnemy();
          state.enemySpawnTimer = 0;
        }

        // Update Lasers
        for (let i = state.lasers.length - 1; i >= 0; i--) {
          const l = state.lasers[i];
          l.y += l.vy;
          if (l.y < -10) {
            state.lasers.splice(i, 1);
            continue;
          }

          // Draw laser
          ctx.beginPath();
          ctx.arc(l.x, l.y, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = '#00f0ff';
          ctx.shadowColor = '#00b4d8';
          ctx.shadowBlur = 8;
          ctx.fill();
        }

        // Update Enemies
        for (let i = state.enemies.length - 1; i >= 0; i--) {
          const e = state.enemies[i];
          e.y += e.speed;

          // Check laser collisions
          for (let j = state.lasers.length - 1; j >= 0; j--) {
            const l = state.lasers[j];
            const dist = Math.hypot(e.x - l.x, e.y - l.y);
            if (dist < e.size + 4) {
              createExplosion(e.x, e.y, e.color);
              playSound('hit');
              state.score += e.points;
              setScore(state.score);

              // Check if unlocked discount milestone
              if (state.score >= 500 && !hasUnlockedDiscount) {
                setHasUnlockedDiscount(true);
                playSound('unlock');
              }

              // Update highscore
              if (state.score > highScore) {
                setHighScore(state.score);
                try {
                  localStorage.setItem('jime_game_highscore', state.score.toString());
                } catch {
                  /* ignore */
                }
              }

              state.enemies.splice(i, 1);
              state.lasers.splice(j, 1);
              break;
            }
          }

          // Check player collision or bottom breach
          if (e.y > height - 30) {
            state.lives -= 1;
            setLives(state.lives);
            createExplosion(e.x, e.y, '#ff3366');
            state.enemies.splice(i, 1);

            if (state.lives <= 0) {
              state.running = false;
              setIsPlaying(false);
              setIsGameOver(true);
            }
            continue;
          }

          // Draw Enemy
          ctx.save();
          ctx.shadowColor = e.color;
          ctx.shadowBlur = 10;
          ctx.fillStyle = e.color;
          ctx.beginPath();
          ctx.arc(e.x, e.y, e.size / 2, 0, Math.PI * 2);
          ctx.fill();

          ctx.font = 'bold 9px "Plus Jakarta Sans", sans-serif';
          ctx.fillStyle = '#ffffff';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(e.label, e.x, e.y);
          ctx.restore();
        }

        // Draw Player Ship (Electric Blue Neon Fighter)
        ctx.save();
        ctx.shadowColor = '#00b4d8';
        ctx.shadowBlur = 14;
        ctx.fillStyle = '#00b4d8';
        ctx.beginPath();
        ctx.moveTo(state.player.x, state.player.y - 14);
        ctx.lineTo(state.player.x - 14, state.player.y + 12);
        ctx.lineTo(state.player.x, state.player.y + 7);
        ctx.lineTo(state.player.x + 14, state.player.y + 12);
        ctx.closePath();
        ctx.fill();

        // Inner glowing core
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(state.player.x, state.player.y + 2, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Update & Draw Particles
      for (let i = state.particles.length - 1; i >= 0; i--) {
        const p = state.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          state.particles.splice(i, 1);
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
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      canvas.removeEventListener('mousemove', handleCanvasMouseMove);
      canvas.removeEventListener('mousedown', handleCanvasMouseDown);
      canvas.removeEventListener('touchmove', handleTouchMove);
      cancelAnimationFrame(animationId);
    };
  }, [soundEnabled, highScore, hasUnlockedDiscount]);

  return (
    <footer className="footer-section">
      <div className="footer-container">
        {/* Retro-Futuristic Cyber Arcade Mini-Game Card */}
        <div className="footer-game-card">
          <div className="game-card-header">
            <div className="game-header-left">
              <span className="game-eyebrow">
                <Sparkles size={13} />
                <span>CYBER ARCADE EASTER EGG</span>
              </span>
              <h3 className="game-title">Defend The Codebase</h3>
              <p className="game-desc">
                Blast falling bugs & glitches before they reach production! Score 500+ to unlock a 10% discount.
              </p>
            </div>

            <div className="game-header-controls">
              <button
                type="button"
                className="game-sound-btn"
                onClick={() => setSoundEnabled(!soundEnabled)}
                title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
              >
                {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>

              <div className="game-stat-pill">
                <Trophy size={14} className="trophy-icon" />
                <span>Best: {highScore}</span>
              </div>
            </div>
          </div>

          {/* Game Canvas Container */}
          <div className="game-canvas-wrapper">
            <canvas ref={canvasRef} className="game-canvas" />

            {/* In-Game Live HUD */}
            {isPlaying && (
              <div className="game-hud">
                <div className="hud-score">
                  <span className="hud-label">SCORE</span>
                  <span className="hud-value">{score}</span>
                </div>
                <div className="hud-lives">
                  {Array.from({ length: 3 }).map((_, idx) => (
                    <Heart
                      key={idx}
                      size={16}
                      className={idx < lives ? 'heart-alive' : 'heart-dead'}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Start Screen Overlay */}
            {!isPlaying && !isGameOver && (
              <div className="game-overlay">
                <div className="overlay-badge">ARCADE MODE</div>
                <h4>Blast The Bugs</h4>
                <p>Move mouse / touch to aim & shoot</p>
                <button type="button" className="game-play-btn" onClick={startGame}>
                  <Play size={16} fill="currentColor" />
                  <span>Start Mission</span>
                </button>
              </div>
            )}

            {/* Game Over Screen Overlay */}
            {isGameOver && (
              <div className="game-overlay">
                <div className="overlay-badge game-over-badge">MISSION FAILED</div>
                <h4>Final Score: {score}</h4>
                {score >= 500 ? (
                  <p className="game-reward-unlocked">
                    🎉 10% Discount Unlocked! Code: <strong>BUGBLASTER10</strong>
                  </p>
                ) : (
                  <p>Reach 500 points to unlock the 10% project perk!</p>
                )}
                <button type="button" className="game-play-btn" onClick={restartGame}>
                  <RotateCcw size={16} />
                  <span>Play Again</span>
                </button>
              </div>
            )}
          </div>

          {/* Secret Milestone Reward Banner */}
          {hasUnlockedDiscount && (
            <div className="game-discount-banner">
              <div className="discount-left">
                <span className="discount-icon">🎁</span>
                <div>
                  <strong>Secret Milestone Achieved!</strong>
                  <span>Use promo code <strong>BUGBLASTER10</strong> for 10% off your project proposal.</span>
                </div>
              </div>
              <button
                type="button"
                className="discount-claim-btn"
                onClick={onOpenBookCall}
              >
                <span>Claim on Call</span>
                <ArrowUpRight size={15} />
              </button>
            </div>
          )}
        </div>

        {/* Global Footer Navigation & Brand Section */}
        <div className="footer-main-grid">
          {/* Brand Info */}
          <div className="footer-brand-col">
            <div className="footer-logo-row">
              <img src="/logo.png" alt="Company Logo" className="footer-logo-img" />
              <span className="footer-brand-name">Project-X Studio</span>
            </div>
            <p className="footer-tagline">
              Crafting state-of-the-art web applications, AI dashboards, and digital experiences with speed, precision, and zero fluff.
            </p>
            <div className="footer-system-status">
              <span className="status-indicator-dot" />
              <span>All Systems Operational (99.9% Uptime)</span>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="footer-links-col">
            <h4 className="footer-col-title">Navigation</h4>
            <ul className="footer-links-list">
              <li><a href="#work">Our Work</a></li>
              <li><a href="#why-us">Why Us</a></li>
              <li><a href="#testimonials">Testimonials</a></li>
              <li><a href="#faq">FAQ</a></li>
              <li><a href="#blog">Blog Guides</a></li>
            </ul>
          </div>

          {/* Services Column */}
          <div className="footer-links-col">
            <h4 className="footer-col-title">Services</h4>
            <ul className="footer-links-list">
              <li><a href="#contact" onClick={(e) => { e.preventDefault(); onOpenBookCall(); }}>Custom Web Apps</a></li>
              <li><a href="#contact" onClick={(e) => { e.preventDefault(); onOpenBookCall(); }}>SaaS Platforms</a></li>
              <li><a href="#contact" onClick={(e) => { e.preventDefault(); onOpenBookCall(); }}>AI & Deep Learning</a></li>
              <li><a href="#contact" onClick={(e) => { e.preventDefault(); onOpenBookCall(); }}>UI/UX Liquid Design</a></li>
            </ul>
          </div>

          {/* Verification & Trust Column */}
          <div className="footer-links-col">
            <h4 className="footer-col-title">Trust & Security</h4>
            <ul className="footer-links-list">
              <li>
                <button
                  type="button"
                  className="footer-link-button"
                  onClick={onOpenVerifyCert}
                >
                  Verify Certificate
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="footer-link-button"
                  onClick={() => onOpenInfoTab && onOpenInfoTab('pricing')}
                >
                  Fixed Pricing Terms
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="footer-link-button"
                  onClick={() => onOpenInfoTab && onOpenInfoTab('services')}
                >
                  Security & NDA
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="footer-bottom-bar">
          <p className="footer-copyright">
            © {new Date().getFullYear()} Project-X Studio. All rights reserved. Built with precision and liquid glass aesthetics.
          </p>

          <div className="footer-bottom-actions">
            <button
              type="button"
              className="footer-legal-btn"
              onClick={() => onOpenInfoTab && onOpenInfoTab('services')}
            >
              Privacy Policy
            </button>
            <span className="footer-divider">·</span>
            <button
              type="button"
              className="footer-legal-btn"
              onClick={() => onOpenInfoTab && onOpenInfoTab('pricing')}
            >
              Terms of Service
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
