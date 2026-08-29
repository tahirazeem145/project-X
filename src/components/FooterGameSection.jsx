import React, { useEffect, useRef, useState } from 'react';
import {
  Play,
  RotateCcw,
  Trophy,
  Sparkles,
  Volume2,
  VolumeX,
  Heart,
  ArrowUpRight
} from 'lucide-react';
import './FooterGameSection.css';

export default function FooterGameSection({ onOpenBookCall, onOpenVerifyCert, onOpenInfoTab }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isGameWon, setIsGameWon] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    try {
      return parseInt(localStorage.getItem('jime_game_brick_high') || '0', 10);
    } catch {
      return 0;
    }
  });
  const [lives, setLives] = useState(3);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [unlockedReward, setUnlockedReward] = useState(false);

  const canvasRef = useRef(null);

  // Web Audio Synthesizer
  const playSound = (type) => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'bounce') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      } else if (type === 'brick') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600 + Math.random() * 200, ctx.currentTime);
        gain.gain.setValueAtTime(0.18, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      } else if (type === 'powerup') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1046.5, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.18, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      } else if (type === 'hit') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      } else if (type === 'win') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523, ctx.currentTime);
        osc.frequency.setValueAtTime(659, ctx.currentTime + 0.1);
        osc.frequency.setValueAtTime(784, ctx.currentTime + 0.2);
        osc.frequency.setValueAtTime(1046, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
      }
    } catch {
      /* AudioContext not supported */
    }
  };

  // State Engine Ref for 60fps Loop
  const engineRef = useRef({
    running: false,
    width: 600,
    height: 380,
    mousePos: { x: 300, y: 340 },
    keys: {},
    paddle: { x: 255, y: 350, width: 90, height: 12, speed: 8 },
    balls: [{ x: 300, y: 335, vx: 4, vy: -4.5, radius: 6 }],
    bricks: [],
    powerups: [],
    particles: [],
  });

  // Init Bricks Helper
  const initBricks = () => {
    const bricks = [];
    const rows = 5;
    const cols = 8;
    const brickWidth = 60;
    const brickHeight = 18;
    const padding = 8;
    const offsetTop = 40;
    const offsetLeft = (600 - (cols * brickWidth + (cols - 1) * padding)) / 2;

    const rowColors = [
      { color: '#00b4d8', points: 50 },
      { color: '#17c3b2', points: 40 },
      { color: '#38bdf8', points: 30 },
      { color: '#f59e0b', points: 20 },
      { color: '#a855f7', points: 10 },
    ];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = offsetLeft + c * (brickWidth + padding);
        const y = offsetTop + r * (brickHeight + padding);
        bricks.push({
          x,
          y,
          width: brickWidth,
          height: brickHeight,
          color: rowColors[r].color,
          points: rowColors[r].points,
          alive: true,
        });
      }
    }
    return bricks;
  };

  const handleStartGame = () => {
    const e = engineRef.current;
    e.running = true;
    setIsPlaying(true);
    setIsGameOver(false);
    setIsGameWon(false);
    setScore(0);
    setLives(3);

    e.paddle = { x: 255, y: 350, width: 90, height: 12, speed: 8 };
    e.balls = [{ x: 300, y: 335, vx: (Math.random() > 0.5 ? 4 : -4), vy: -4.5, radius: 6 }];
    e.bricks = initBricks();
    e.powerups = [];
    e.particles = [];
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;

    const width = (canvas.width = 600);
    const height = (canvas.height = 380);
    const e = engineRef.current;
    e.width = width;
    e.height = height;

    const handleKeyDown = (evt) => {
      e.keys[evt.code] = true;
      if (evt.code === 'Space' && e.running) {
        evt.preventDefault();
      }
    };

    const handleKeyUp = (evt) => {
      e.keys[evt.code] = false;
    };

    const handleCanvasMouseMove = (evt) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const clientX = (evt.clientX - rect.left) * scaleX;
      e.mousePos.x = clientX;
    };

    const handleTouchMove = (evt) => {
      if (!evt.touches[0]) return;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const clientX = (evt.touches[0].clientX - rect.left) * scaleX;
      e.mousePos.x = clientX;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    canvas.addEventListener('mousemove', handleCanvasMouseMove);
    canvas.addEventListener('touchmove', handleTouchMove, { passive: true });

    const createExplosion = (x, y, color) => {
      for (let i = 0; i < 12; i++) {
        const angle = Math.random() * Math.PI * 2;
        const spd = Math.random() * 4 + 1.5;
        e.particles.push({
          x,
          y,
          vx: Math.cos(angle) * spd,
          vy: Math.sin(angle) * spd,
          size: Math.random() * 2.5 + 1.5,
          color,
          alpha: 1,
          decay: Math.random() * 0.04 + 0.02,
        });
      }
    };

    // Main 60fps Game Loop
    const loop = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle retro grid background
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      const step = 20;
      for (let x = 0; x < width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      if (e.running) {
        // Paddle position update with mouse or keys
        if (e.keys['ArrowLeft'] || e.keys['KeyA']) {
          e.paddle.x -= e.paddle.speed;
        } else if (e.keys['ArrowRight'] || e.keys['KeyD']) {
          e.paddle.x += e.paddle.speed;
        } else {
          e.paddle.x += (e.mousePos.x - e.paddle.width / 2 - e.paddle.x) * 0.25;
        }
        e.paddle.x = Math.max(10, Math.min(width - e.paddle.width - 10, e.paddle.x));

        // Update Balls
        for (let i = e.balls.length - 1; i >= 0; i--) {
          const b = e.balls[i];
          b.x += b.vx;
          b.y += b.vy;

          // Wall collisions
          if (b.x - b.radius < 0) {
            b.x = b.radius;
            b.vx = Math.abs(b.vx);
            playSound('bounce');
          } else if (b.x + b.radius > width) {
            b.x = width - b.radius;
            b.vx = -Math.abs(b.vx);
            playSound('bounce');
          }
          if (b.y - b.radius < 0) {
            b.y = b.radius;
            b.vy = Math.abs(b.vy);
            playSound('bounce');
          }

          // Paddle collision
          if (
            b.y + b.radius >= e.paddle.y &&
            b.y - b.radius <= e.paddle.y + e.paddle.height &&
            b.x >= e.paddle.x &&
            b.x <= e.paddle.x + e.paddle.width &&
            b.vy > 0
          ) {
            const hitOffset = (b.x - (e.paddle.x + e.paddle.width / 2)) / (e.paddle.width / 2);
            b.vx = hitOffset * 5.5;
            b.vy = -Math.abs(b.vy);
            playSound('bounce');
          }

          // Brick collisions
          let activeBricksCount = 0;
          for (let br of e.bricks) {
            if (!br.alive) continue;
            activeBricksCount++;

            if (
              b.x + b.radius >= br.x &&
              b.x - b.radius <= br.x + br.width &&
              b.y + b.radius >= br.y &&
              b.y - b.radius <= br.y + br.height
            ) {
              br.alive = false;
              b.vy = -b.vy;
              createExplosion(br.x + br.width / 2, br.y + br.height / 2, br.color);
              playSound('brick');

              // Spawn random power-up
              if (Math.random() < 0.22) {
                e.powerups.push({
                  x: br.x + br.width / 2,
                  y: br.y + br.height / 2,
                  type: Math.random() > 0.5 ? 'wide' : 'multi',
                  vy: 2.2,
                });
              }

              setScore((prev) => {
                const newScore = prev + br.points;
                if (newScore > highScore) {
                  setHighScore(newScore);
                  try {
                    localStorage.setItem('jime_game_brick_high', newScore.toString());
                  } catch {}
                }
                if (newScore >= 400 && !unlockedReward) {
                  setUnlockedReward(true);
                  playSound('win');
                }
                return newScore;
              });
              break;
            }
          }

          // Check Win Condition
          if (activeBricksCount === 0) {
            e.running = false;
            setIsPlaying(false);
            setIsGameWon(true);
            playSound('win');
          }

          // Ball drops below paddle
          if (b.y > height + 20) {
            e.balls.splice(i, 1);
          }
        }

        // If all balls lost
        if (e.balls.length === 0) {
          setLives((prevLives) => {
            const newLives = prevLives - 1;
            if (newLives > 0) {
              e.balls.push({
                x: e.paddle.x + e.paddle.width / 2,
                y: e.paddle.y - 15,
                vx: (Math.random() > 0.5 ? 4 : -4),
                vy: -4.5,
                radius: 6,
              });
              playSound('hit');
            } else {
              e.running = false;
              setIsPlaying(false);
              setIsGameOver(true);
              playSound('hit');
            }
            return newLives;
          });
        }

        // Update & Draw Power-ups
        for (let pIdx = e.powerups.length - 1; pIdx >= 0; pIdx--) {
          const p = e.powerups[pIdx];
          p.y += p.vy;

          if (
            p.y >= e.paddle.y &&
            p.y <= e.paddle.y + e.paddle.height &&
            p.x >= e.paddle.x &&
            p.x <= e.paddle.x + e.paddle.width
          ) {
            playSound('powerup');
            if (p.type === 'wide') {
              e.paddle.width = Math.min(140, e.paddle.width + 30);
            } else if (p.type === 'multi') {
              if (e.balls[0]) {
                e.balls.push({
                  x: e.balls[0].x,
                  y: e.balls[0].y,
                  vx: -3.5,
                  vy: -4,
                  radius: 6,
                });
                e.balls.push({
                  x: e.balls[0].x,
                  y: e.balls[0].y,
                  vx: 3.5,
                  vy: -4,
                  radius: 6,
                });
              }
            }
            e.powerups.splice(pIdx, 1);
            continue;
          }

          if (p.y > height + 20) {
            e.powerups.splice(pIdx, 1);
            continue;
          }

          // Draw Power-Up pill
          ctx.save();
          ctx.fillStyle = p.type === 'wide' ? '#00b4d8' : '#f59e0b';
          ctx.shadowColor = p.type === 'wide' ? '#00b4d8' : '#f59e0b';
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 7, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      // Render Bricks
      for (let br of e.bricks) {
        if (!br.alive) continue;
        ctx.save();
        ctx.fillStyle = br.color;
        ctx.shadowColor = br.color;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.roundRect(br.x, br.y, br.width, br.height, 4);
        ctx.fill();

        // Specular top highlight on brick
        ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.fillRect(br.x + 2, br.y + 2, br.width - 4, 3);
        ctx.restore();
      }

      // Render Paddle
      ctx.save();
      ctx.fillStyle = '#00b4d8';
      ctx.shadowColor = '#00b4d8';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.roundRect(e.paddle.x, e.paddle.y, e.paddle.width, e.paddle.height, 6);
      ctx.fill();

      // Paddle inner white shine
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(e.paddle.x + 8, e.paddle.y + 2, e.paddle.width - 16, 2);
      ctx.restore();

      // Render Balls
      for (let b of e.balls) {
        ctx.save();
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#00b4d8';
        ctx.shadowBlur = 14;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Render Particles
      for (let i = e.particles.length - 1; i >= 0; i--) {
        const p = e.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          e.particles.splice(i, 1);
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
      canvas.removeEventListener('touchmove', handleTouchMove);
      cancelAnimationFrame(animationId);
    };
  }, [soundEnabled, highScore, unlockedReward]);

  return (
    <footer className="footer-section">
      <div className="footer-container">
        {/* Cyber Brick Breaker Arcade Card */}
        <div className="footer-game-card">
          <div className="game-card-header">
            <div className="game-header-left">
              <span className="game-eyebrow">
                <Sparkles size={13} />
                <span>CYBER ARCADE EASTER EGG</span>
              </span>
              <h3 className="game-title">⚡ Cyber Brick Breaker</h3>
              <p className="game-desc">
                Smash glowing data blocks! Score 400+ to unlock an exclusive 10% project discount code.
              </p>
            </div>

            {/* Controls */}
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
            {!isPlaying && !isGameOver && !isGameWon && (
              <div className="game-overlay">
                <div className="overlay-badge">NEON BREAKOUT</div>
                <h4>Smash The Codebase</h4>
                <p>Move mouse or drag finger to guide the paddle · Catch falling power-ups!</p>
                <button type="button" className="game-play-btn" onClick={handleStartGame}>
                  <Play size={16} fill="currentColor" />
                  <span>Start Game</span>
                </button>
              </div>
            )}

            {/* Game Over / Win Screen Overlay */}
            {(isGameOver || isGameWon) && (
              <div className="game-overlay">
                <div className={`overlay-badge ${isGameWon ? 'game-won-badge' : 'game-over-badge'}`}>
                  {isGameWon ? 'STAGE CLEARED!' : 'GAME OVER'}
                </div>
                <h4>Final Score: {score}</h4>
                {score >= 400 ? (
                  <p className="game-reward-unlocked">
                    🎉 10% Discount Unlocked! Code: <strong>BUGBLASTER10</strong>
                  </p>
                ) : (
                  <p>Reach 400+ points to unlock your exclusive 10% project discount!</p>
                )}
                <button type="button" className="game-play-btn" onClick={handleStartGame}>
                  <RotateCcw size={16} />
                  <span>Play Again</span>
                </button>
              </div>
            )}
          </div>

          {/* Secret Milestone Reward Banner */}
          {unlockedReward && (
            <div className="game-discount-banner">
              <div className="discount-left">
                <span className="discount-icon">🎁</span>
                <div>
                  <strong>Secret Perk Unlocked!</strong>
                  <span>Use promo code <strong>BUGBLASTER10</strong> for 10% off your next project proposal.</span>
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

        {/* Global Footer Navigation & Brand Section matching reference design */}
        <div className="footer-main-grid">
          {/* Column 1: Brand & Info */}
          <div className="footer-brand-col">
            <div className="footer-logo-row">
              <img src="/logo.png" alt="Jime Developers Logo" className="footer-logo-img" />
              <span className="footer-brand-name">Jime <span className="footer-brand-sub">Developers</span></span>
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
    </footer>
  );
}
