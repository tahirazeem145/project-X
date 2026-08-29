import React, { useEffect, useRef, useState } from 'react';
import {
  Play,
  RotateCcw,
  Trophy,
  Sparkles,
  Volume2,
  VolumeX,
  Heart,
  ArrowUpRight,
  Gamepad2,
  Layers,
  Flame,
  Rocket
} from 'lucide-react';
import './FooterGameSection.css';

export default function FooterGameSection({ onOpenBookCall, onOpenVerifyCert, onOpenInfoTab }) {
  const [activeGame, setActiveGame] = useState('brick'); // 'brick' | 'snake' | 'space'
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
    game: 'brick',
    width: 600,
    height: 380,
    mousePos: { x: 300, y: 340 },
    keys: {},

    // Brick Breaker State
    paddle: { x: 250, y: 350, width: 90, height: 12, speed: 8 },
    balls: [{ x: 300, y: 330, vx: 4, vy: -4, radius: 6 }],
    bricks: [],
    powerups: [],
    particles: [],

    // Snake State
    snake: [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }],
    snakeDir: { x: 1, y: 0 },
    nextDir: { x: 1, y: 0 },
    food: { x: 15, y: 10 },
    snakeSpeed: 90,
    lastSnakeStep: 0,
    gridCols: 30,
    gridRows: 19,

    // Space State
    player: { x: 300, y: 340, width: 32, height: 26 },
    lasers: [],
    enemies: [],
    lastShot: 0,
    enemySpawnTimer: 0,
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
    e.game = activeGame;
    e.running = true;
    setIsPlaying(true);
    setIsGameOver(false);
    setIsGameWon(false);
    setScore(0);
    setLives(3);

    if (activeGame === 'brick') {
      e.paddle = { x: 255, y: 350, width: 90, height: 12, speed: 8 };
      e.balls = [{ x: 300, y: 335, vx: (Math.random() > 0.5 ? 4 : -4), vy: -4.5, radius: 6 }];
      e.bricks = initBricks();
      e.powerups = [];
      e.particles = [];
    } else if (activeGame === 'snake') {
      e.snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
      e.snakeDir = { x: 1, y: 0 };
      e.nextDir = { x: 1, y: 0 };
      e.food = {
        x: Math.floor(Math.random() * (e.gridCols - 2)) + 1,
        y: Math.floor(Math.random() * (e.gridRows - 2)) + 1,
      };
      e.lastSnakeStep = Date.now();
    } else if (activeGame === 'space') {
      e.player = { x: 300, y: 340, width: 32, height: 26 };
      e.lasers = [];
      e.enemies = [];
      e.particles = [];
      e.enemySpawnTimer = 0;
    }
  };

  const switchGame = (gameKey) => {
    setActiveGame(gameKey);
    setIsPlaying(false);
    setIsGameOver(false);
    setIsGameWon(false);
    engineRef.current.running = false;
    const saved = localStorage.getItem(`jime_game_${gameKey}_high`);
    setHighScore(saved ? parseInt(saved, 10) : 0);
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

      // Snake Direction control
      if (e.game === 'snake' && e.running) {
        if ((evt.code === 'ArrowUp' || evt.code === 'KeyW') && e.snakeDir.y === 0) {
          e.nextDir = { x: 0, y: -1 };
          evt.preventDefault();
        } else if ((evt.code === 'ArrowDown' || evt.code === 'KeyS') && e.snakeDir.y === 0) {
          e.nextDir = { x: 0, y: 1 };
          evt.preventDefault();
        } else if ((evt.code === 'ArrowLeft' || evt.code === 'KeyA') && e.snakeDir.x === 0) {
          e.nextDir = { x: -1, y: 0 };
          evt.preventDefault();
        } else if ((evt.code === 'ArrowRight' || evt.code === 'KeyD') && e.snakeDir.x === 0) {
          e.nextDir = { x: 1, y: 0 };
          evt.preventDefault();
        }
      }

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

      // ==========================================
      // 1. GAME: CYBER BRICK BREAKER
      // ==========================================
      if (e.game === 'brick') {
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
              // Hit angle based on hit position
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

            // Catch power-up with paddle
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
      }

      // ==========================================
      // 2. GAME: QUANTUM NEON SNAKE
      // ==========================================
      else if (e.game === 'snake') {
        const cellSize = 20;

        if (e.running) {
          const now = Date.now();
          if (now - e.lastSnakeStep > e.snakeSpeed) {
            e.snakeDir = e.nextDir;
            const head = {
              x: e.snake[0].x + e.snakeDir.x,
              y: e.snake[0].y + e.snakeDir.y,
            };

            // Wall wrap-around
            if (head.x < 0) head.x = e.gridCols - 1;
            if (head.x >= e.gridCols) head.x = 0;
            if (head.y < 0) head.y = e.gridRows - 1;
            if (head.y >= e.gridRows) head.y = 0;

            // Self collision check
            for (let segment of e.snake) {
              if (segment.x === head.x && segment.y === head.y) {
                e.running = false;
                setIsPlaying(false);
                setIsGameOver(true);
                playSound('hit');
                break;
              }
            }

            if (e.running) {
              e.snake.unshift(head);

              // Check Food Collision
              if (head.x === e.food.x && head.y === e.food.y) {
                playSound('brick');
                createExplosion(head.x * cellSize + 10, head.y * cellSize + 10, '#00b4d8');
                setScore((prev) => {
                  const newScore = prev + 50;
                  if (newScore > highScore) {
                    setHighScore(newScore);
                    try {
                      localStorage.setItem('jime_game_snake_high', newScore.toString());
                    } catch {}
                  }
                  if (newScore >= 350 && !unlockedReward) {
                    setUnlockedReward(true);
                    playSound('win');
                  }
                  return newScore;
                });
                e.food = {
                  x: Math.floor(Math.random() * (e.gridCols - 2)) + 1,
                  y: Math.floor(Math.random() * (e.gridRows - 2)) + 1,
                };
              } else {
                e.snake.pop();
              }
              e.lastSnakeStep = now;
            }
          }
        }

        // Draw Food
        ctx.save();
        ctx.fillStyle = '#00b4d8';
        ctx.shadowColor = '#00b4d8';
        ctx.shadowBlur = 14;
        ctx.beginPath();
        ctx.arc(e.food.x * cellSize + 10, e.food.y * cellSize + 10, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Draw Snake
        for (let i = 0; i < e.snake.length; i++) {
          const seg = e.snake[i];
          ctx.save();
          ctx.fillStyle = i === 0 ? '#ffffff' : `rgba(0, 180, 216, ${Math.max(0.3, 1 - i / e.snake.length)})`;
          ctx.shadowColor = '#00b4d8';
          ctx.shadowBlur = i === 0 ? 12 : 6;
          ctx.beginPath();
          ctx.roundRect(seg.x * cellSize + 2, seg.y * cellSize + 2, cellSize - 4, cellSize - 4, 4);
          ctx.fill();
          ctx.restore();
        }
      }

      // Render Particles across all games
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
  }, [soundEnabled, activeGame, highScore, unlockedReward]);

  return (
    <footer className="footer-section">
      <div className="footer-container">
        {/* Cyber Arcade Mini-Game Section */}
        <div className="footer-game-card">
          <div className="game-card-header">
            <div className="game-header-left">
              <span className="game-eyebrow">
                <Sparkles size={13} />
                <span>CYBER ARCADE EASTER EGG</span>
              </span>
              <h3 className="game-title">
                {activeGame === 'brick'
                  ? '⚡ Cyber Brick Breaker'
                  : activeGame === 'snake'
                  ? '🐍 Quantum Neon Snake'
                  : '🚀 Codebase Defender'}
              </h3>
              <p className="game-desc">
                {activeGame === 'brick'
                  ? 'Smash glowing data blocks! Score 400+ to unlock a 10% project discount code.'
                  : 'Navigate the quantum data grid! Eat nodes and avoid crashing.'}
              </p>
            </div>

            {/* Game Selector Tabs & Controls */}
            <div className="game-header-controls">
              <div className="game-tabs-group">
                <button
                  type="button"
                  className={`game-tab-btn ${activeGame === 'brick' ? 'game-tab-active' : ''}`}
                  onClick={() => switchGame('brick')}
                >
                  <Layers size={13} />
                  <span>Bricks</span>
                </button>
                <button
                  type="button"
                  className={`game-tab-btn ${activeGame === 'snake' ? 'game-tab-active' : ''}`}
                  onClick={() => switchGame('snake')}
                >
                  <Flame size={13} />
                  <span>Snake</span>
                </button>
              </div>

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

                {activeGame === 'brick' && (
                  <div className="hud-lives">
                    {Array.from({ length: 3 }).map((_, idx) => (
                      <Heart
                        key={idx}
                        size={16}
                        className={idx < lives ? 'heart-alive' : 'heart-dead'}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Start Screen Overlay */}
            {!isPlaying && !isGameOver && !isGameWon && (
              <div className="game-overlay">
                <div className="overlay-badge">
                  {activeGame === 'brick' ? 'NEON BREAKOUT' : 'QUANTUM GRID'}
                </div>
                <h4>
                  {activeGame === 'brick' ? 'Smash The Codebase' : 'Feed The Quantum Snake'}
                </h4>
                <p>
                  {activeGame === 'brick'
                    ? 'Move mouse or drag to aim paddle · Catch falling power-ups!'
                    : 'Use Arrow Keys or WASD to turn · Do not crash into yourself!'}
                </p>
                <button type="button" className="game-play-btn" onClick={handleStartGame}>
                  <Play size={16} fill="currentColor" />
                  <span>Start Game</span>
                </button>
              </div>
            )}

            {/* Game Over Screen Overlay */}
            {(isGameOver || isGameWon) && (
              <div className="game-overlay">
                <div className={`overlay-badge ${isGameWon ? 'game-won-badge' : 'game-over-badge'}`}>
                  {isGameWon ? 'STAGE CLEARED!' : 'GAME OVER'}
                </div>
                <h4>Final Score: {score}</h4>
                {score >= 350 ? (
                  <p className="game-reward-unlocked">
                    🎉 10% Discount Unlocked! Code: <strong>BUGBLASTER10</strong>
                  </p>
                ) : (
                  <p>Reach 350+ points to unlock your exclusive 10% project discount!</p>
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
