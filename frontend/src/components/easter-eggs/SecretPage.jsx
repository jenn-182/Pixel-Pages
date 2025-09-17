import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { X, BookOpen, Star, Trophy } from 'lucide-react';

// ===== Game Configuration =====
const GAME_WIDTH = 550;
const GAME_HEIGHT = 400;
const PLAYER_X = 56;
const PLAYER_SIZE = 28;
const PIPE_WIDTH = 52;
const GAP_HEIGHT = 155;
const PIPE_SPACING = 260;
const PIPE_SPEED = 2.6;
const GRAVITY = 0.45;
const JUMP_FORCE = -7.6;

function randGapTop() {
  const margin = 44;
  const min = margin;
  const max = GAME_HEIGHT - GAP_HEIGHT - margin;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function clamp(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v));
}

function aabb(ax, ay, aw, ah, bx, by, bw, bh) {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}

const FlappyNotebook = ({ onScore, onGameOver, icon = 'book', theme = 'neon' }) => {
  const velocity = useRef(0);
  const [playerY, setPlayerY] = useState(GAME_HEIGHT / 2);
  const playerYRef = useRef(GAME_HEIGHT / 2);
  const [gameState, setGameState] = useState('waiting'); // 'waiting', 'playing', 'gameOver'
  const [score, setScore] = useState(0);
  const [frame, setFrame] = useState(0);
  const [flash, setFlash] = useState(false);
  const pipesRef = useRef([]);

  const reset = () => {
    velocity.current = 0;
    playerYRef.current = GAME_HEIGHT / 2;
    setPlayerY(GAME_HEIGHT / 2);
    setScore(0);
    pipesRef.current = new Array(3).fill(0).map((_, i) => ({
      x: GAME_WIDTH + i * PIPE_SPACING,
      gapTop: randGapTop(),
      scored: false,
    }));
  };

  const startGame = () => {
    reset();
    setGameState('playing');
  };

  const jump = () => {
    if (gameState === 'waiting') {
      startGame();
      return;
    }
    if (gameState === 'gameOver') {
      // Auto restart after game over
      reset();
      setGameState('playing');
      return;
    }
    if (gameState !== 'playing') return;
    velocity.current = JUMP_FORCE;
  };

  useEffect(() => {
    reset();

    const key = (e) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        jump();
      }
    };
    const click = () => jump();

    window.addEventListener('keydown', key);
    window.addEventListener('pointerdown', click);

    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (gameState !== 'playing') return;

      // Physics
      velocity.current += GRAVITY;
      const newY = clamp(playerYRef.current + velocity.current, 0, GAME_HEIGHT - PLAYER_SIZE);
      playerYRef.current = newY;
      setPlayerY(newY);

      // Move pipes
      pipesRef.current.forEach((p) => (p.x -= PIPE_SPEED));

      // Recycle pipes and scoring
      for (const p of pipesRef.current) {
        if (p.x + PIPE_WIDTH < 0) {
          const far = Math.max(...pipesRef.current.map((q) => q.x));
          p.x = far + PIPE_SPACING;
          p.gapTop = randGapTop();
          p.scored = false;
        }
        const playerCenterX = PLAYER_X + PLAYER_SIZE / 2;
        const pipeCenterX = p.x + PIPE_WIDTH / 2;
        if (!p.scored && pipeCenterX < playerCenterX) {
          p.scored = true;
          setScore((s) => {
            const ns = s + 1;
            onScore && onScore(ns);
            return ns;
          });
        }
      }

      // Collision detection
      const px = PLAYER_X;
      const py = newY;
      let dead = py <= 0 || py + PLAYER_SIZE >= GAME_HEIGHT;
      if (!dead) {
        for (const p of pipesRef.current) {
          const topHit = aabb(px, py, PLAYER_SIZE, PLAYER_SIZE, p.x, 0, PIPE_WIDTH, p.gapTop);
          const bottomY = p.gapTop + GAP_HEIGHT;
          const bottomHit = aabb(px, py, PLAYER_SIZE, PLAYER_SIZE, p.x, bottomY, PIPE_WIDTH, GAME_HEIGHT - bottomY);
          if (topHit || bottomHit) { 
            dead = true; 
            break; 
          }
        }
      }

      if (dead) {
        setGameState('gameOver');
        setFlash(true);
        setTimeout(() => setFlash(false), 120);
        onGameOver && onGameOver(score);
        // Auto restart after 1.5 seconds
        setTimeout(() => { 
          reset(); 
          setGameState('playing'); 
        }, 1500);
      }

      setFrame((f) => f + 1);
    };

    tick();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('keydown', key);
      window.removeEventListener('pointerdown', click);
    };
  }, [gameState, onScore, onGameOver]);

  // Tilt effect for the player
  const vy = useMotionValue(0);
  useEffect(() => { 
    vy.set(velocity.current); 
  }, [frame, vy]);
  const tilt = useTransform(vy, [-6, 10], [-22, 38]);

  const themeStyles = {
    container: {
      position: 'relative',
      overflow: 'hidden',
      width: GAME_WIDTH,
      height: GAME_HEIGHT,
      border: '2px solid rgba(255,255,255,0.8)',
      borderRadius: 16,
      boxShadow: '0 0 20px rgba(255,255,255,0.3), inset 0 0 20px rgba(255,255,255,0.1)',
      cursor: 'pointer',
      userSelect: 'none',
      background: 'transparent', // Completely transparent
      backdropFilter: 'none', // Remove blur effect
    },
    scanlines: {
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      backgroundImage: 'repeating-linear-gradient(transparent, transparent 22px, rgba(255,255,255,0.06) 23px)'
    },
    hud: {
      position: 'absolute',
      top: 8,
      left: 0,
      right: 0,
      textAlign: 'center',
      color: '#fff',
      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
      textShadow: '0 0 10px rgba(255,255,255,0.8)'
    },
    ribbon: {
      position: 'absolute',
      left: 8,
      top: 8,
      padding: '2px 6px',
      borderRadius: 6,
      border: '1px solid rgba(255,255,255,0.6)',
      background: 'rgba(0,0,0,0.4)',
      color: 'rgba(255,255,255,0.9)',
      fontFamily: 'monospace',
      fontSize: 12,
      boxShadow: '0 0 10px rgba(255,255,255,0.2)'
    },
    startButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      padding: '8px 16px',
      borderRadius: 9999,
      border: '2px solid rgba(255,255,255,0.8)',
      background: 'rgba(0,0,0,0.6)',
      color: 'rgba(255,255,255,0.9)',
      fontFamily: 'monospace',
      fontSize: 14,
      fontWeight: 'bold',
      boxShadow: '0 0 20px rgba(255,255,255,0.4)',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    },
    scorePill: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      padding: '4px 10px',
      borderRadius: 9999,
      border: '1px solid rgba(255,255,255,0.6)',
      background: 'rgba(0,0,0,0.4)',
      boxShadow: '0 0 15px rgba(255,255,255,0.3)'
    },
    gameOverPill: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      padding: '8px 16px',
      borderRadius: 9999,
      border: '2px solid rgba(255,255,255,0.8)',
      background: 'rgba(0,0,0,0.6)',
      color: 'rgba(255,255,255,0.9)',
      fontFamily: 'monospace',
      fontSize: 14,
      fontWeight: 'bold',
      boxShadow: '0 0 20px rgba(255,255,255,0.4)',
      cursor: 'pointer'
    },
    pipeTop: {
      position: 'absolute',
      left: 0,
      top: 0,
      width: PIPE_WIDTH,
      border: '2px solid rgba(255,255,255,0.8)',
      background: 'rgba(0,0,0,0.3)',
      boxShadow: '0 0 15px rgba(255,255,255,0.4), inset 0 0 10px rgba(255,255,255,0.1)'
    },
    pipeBottom: {
      position: 'absolute',
      left: 0,
      border: '2px solid rgba(255,255,255,0.8)',
      width: PIPE_WIDTH,
      background: 'rgba(0,0,0,0.3)',
      boxShadow: '0 0 15px rgba(255,255,255,0.4), inset 0 0 10px rgba(255,255,255,0.1)'
    },
    playerWrap: {
      position: 'absolute',
      left: PLAYER_X,
      top: playerY,
      width: PLAYER_SIZE,
      height: PLAYER_SIZE,
      transform: `translateY(-${PLAYER_SIZE / 2}px)`,
    },
    controls: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      color: 'rgba(255,255,255,0.9)',
      fontFamily: 'monospace',
      fontSize: 12
    },
    kbd: {
      border: '1px solid rgba(255,255,255,0.6)',
      background: 'rgba(0,0,0,0.5)',
      borderRadius: 6,
      padding: '2px 6px',
      boxShadow: '0 0 8px rgba(255,255,255,0.2)'
    }
  };

  const IconEl = icon === 'star' ? Star : icon === 'trophy' ? Trophy : BookOpen;

  return (
    <div style={{ display: 'grid', placeItems: 'center', gap: 8, userSelect: 'none' }}>
      <div
        role="button"
        className="game-container"
        style={themeStyles.container}
        onClick={jump}
      >
        {/* Flash effect on collision */}
        <AnimatePresence>
          {flash && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(248,113,113,0.6)',
                mixBlendMode: 'screen'
              }}
            />
          )}
        </AnimatePresence>

        {/* Scanlines overlay */}
        <div style={themeStyles.scanlines} />

        {/* Pipes - only show when playing */}
        {gameState === 'playing' && pipesRef.current.map((p, i) => (
          <React.Fragment key={i}>
            <motion.div
              style={{
                ...themeStyles.pipeTop,
                x: p.x,
                height: p.gapTop
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
            <motion.div
              style={{
                ...themeStyles.pipeBottom,
                x: p.x,
                top: p.gapTop + GAP_HEIGHT,
                height: GAME_HEIGHT - (p.gapTop + GAP_HEIGHT)
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
          </React.Fragment>
        ))}

        {/* Player with rainbow glow - outlined book */}
        <motion.div style={themeStyles.playerWrap}>
          <motion.div
            className="rainbow-book"
            style={{ 
              rotate: tilt,
            }}
            animate={{
              boxShadow: [
                '0 0 20px #ff0000, 0 0 40px #ff0000',
                '0 0 20px #ff8000, 0 0 40px #ff8000',
                '0 0 20px #ffff00, 0 0 40px #ffff00',
                '0 0 20px #00ff00, 0 0 40px #00ff00',
                '0 0 20px #0080ff, 0 0 40px #0080ff',
                '0 0 20px #8000ff, 0 0 40px #8000ff',
                '0 0 20px #ff0080, 0 0 40px #ff0080',
                '0 0 20px #ff0000, 0 0 40px #ff0000'
              ]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <IconEl 
              className="rainbow-book-icon"
              style={{ 
                width: PLAYER_SIZE, 
                height: PLAYER_SIZE,
                color: '#ffffff',
                fill: 'none',
                stroke: 'currentColor',
                strokeWidth: 2
              }} 
            />
          </motion.div>
        </motion.div>

        {/* Game State UI */}
        <div style={themeStyles.hud}>
          {gameState === 'waiting' && (
            <motion.div 
              style={themeStyles.startButton}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={{
                boxShadow: [
                  '0 0 20px rgba(255,255,255,0.4)',
                  '0 0 30px rgba(255,255,255,0.6)',
                  '0 0 20px rgba(255,255,255,0.4)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Click to Start!
            </motion.div>
          )}
          
          {gameState === 'playing' && (
            <div style={themeStyles.scorePill}>
              <span>Score:</span>
              <span style={{ fontVariantNumeric: 'tabular-nums' }}>{score}</span>
            </div>
          )}
          
          {gameState === 'gameOver' && (
            <div style={themeStyles.scorePill}>
              <span>Game Over! Final Score: {score}</span>
            </div>
          )}
        </div>
      </div>

      <div style={themeStyles.controls}>
        <kbd style={themeStyles.kbd}>Space</kbd>
        <span>or click/tap to {gameState === 'waiting' ? 'start' : 'flap'}</span>
      </div>
    </div>
  );
};

const SecretPage = ({ isOpen, onClose }) => {
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('flappyNotebookHighScore');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [totalXP, setTotalXP] = useState(() => {
    const saved = localStorage.getItem('flappyNotebookTotalXP');
    return saved ? parseInt(saved, 10) : 0;
  });

  const handleScore = (score) => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('flappyNotebookHighScore', score.toString());
    }
  };

  const handleGameOver = (finalScore) => {
    console.log(`Game Over! Final Score: ${finalScore}`);
    // Award XP if score is 10 or more
    if (finalScore >= 10) {
      const xpEarned = finalScore;
      const newTotalXP = totalXP + xpEarned;
      setTotalXP(newTotalXP);
      localStorage.setItem('flappyNotebookTotalXP', newTotalXP.toString());
    }
  };

  // Star field background style
  const starfieldStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: '#000000', // Opaque black base
    backgroundImage: `
      radial-gradient(2px 2px at 20px 30px, #eee, transparent),
      radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.8), transparent),
      radial-gradient(1px 1px at 90px 40px, #fff, transparent),
      radial-gradient(1px 1px at 130px 80px, rgba(255,255,255,0.6), transparent),
      radial-gradient(2px 2px at 160px 30px, #fff, transparent),
      radial-gradient(1px 1px at 20px 100px, rgba(255,255,255,0.7), transparent),
      radial-gradient(1px 1px at 50px 120px, #eee, transparent),
      radial-gradient(2px 2px at 80px 100px, rgba(255,255,255,0.9), transparent),
      radial-gradient(1px 1px at 110px 120px, #fff, transparent),
      radial-gradient(1px 1px at 140px 110px, rgba(255,255,255,0.6), transparent),
      radial-gradient(1px 1px at 170px 90px, #eee, transparent)
    `,
    backgroundRepeat: 'repeat',
    backgroundSize: '200px 200px',
    animation: 'secretPageStarfield 20s linear infinite'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Inject keyframes for star animation */}
          <style jsx>{`
            @keyframes secretPageStarfield {
              from { transform: translateY(0px); }
              to { transform: translateY(-200px); }
            }
            
            @keyframes rainbowGlow {
              0% { filter: drop-shadow(0 0 15px #ff0000); }
              14% { filter: drop-shadow(0 0 15px #ff8000); }
              28% { filter: drop-shadow(0 0 15px #ffff00); }
              42% { filter: drop-shadow(0 0 15px #00ff00); }
              57% { filter: drop-shadow(0 0 15px #0080ff); }
              71% { filter: drop-shadow(0 0 15px #8000ff); }
              85% { filter: drop-shadow(0 0 15px #ff0080); }
              100% { filter: drop-shadow(0 0 15px #ff0000); }
            }
            
            /* Force outlined book icon with rainbow glow */
            .rainbow-book {
              color: #ffffff !important;
              animation: rainbowGlow 3s linear infinite !important;
            }
            
            .rainbow-book-icon {
              fill: none !important;
              stroke: #ffffff !important;
              stroke-width: 2 !important;
              color: #ffffff !important;
            }
            
            .rainbow-book svg {
              fill: none !important;
              stroke: #ffffff !important;
              stroke-width: 2 !important;
              color: #ffffff !important;
            }
            
            /* Ensure game container is truly transparent */
            .game-container {
              background: transparent !important;
              backdrop-filter: none !important;
            }
          `}</style>
          
          <motion.div
            className="fixed inset-0 z-50 flex items-start justify-center pt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              background: '#000000' // Opaque black background
            }}
          >
            {/* Opaque Star Field Background */}
            <div style={starfieldStyle} />

            {/* Twinkling Accent Elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {/* Bright colored twinkling particles */}
              {[...Array(15)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    width: Math.random() * 4 + 2,
                    height: Math.random() * 4 + 2,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    background: [
                      '#ff00ff', // Magenta
                      '#00ffff', // Cyan  
                      '#ffff00', // Yellow
                      '#ff0080', // Hot Pink
                      '#80ff00', // Lime
                      '#0080ff', // Blue
                    ][Math.floor(Math.random() * 6)]
                  }}
                  animate={{
                    opacity: [0.2, 0.7, 0.2],
                    scale: [0.8, 1.3, 0.8],
                    boxShadow: [
                      '0 0 5px currentColor',
                      '0 0 15px currentColor',
                      '0 0 5px currentColor'
                    ]
                  }}
                  transition={{
                    duration: Math.random() * 3 + 2, // Slower: 2-5 seconds
                    repeat: Infinity,
                    delay: Math.random() * 3,
                    ease: "easeInOut"
                  }}
                />
              ))}

              {/* Floating neon orbs */}
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={`orb-${i}`}
                  className="absolute rounded-full"
                  style={{
                    width: 6,
                    height: 6,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    background: i % 2 === 0 ? '#00ffff' : '#ff00ff',
                    boxShadow: `0 0 12px ${i % 2 === 0 ? '#00ffff' : '#ff00ff'}`
                  }}
                  animate={{
                    y: [0, -25, 0],
                    x: [0, Math.random() * 30 - 15, 0],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: Math.random() * 5 + 4, // Slower: 4-9 seconds
                    repeat: Infinity,
                    delay: Math.random() * 3,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>

            {/* Main Game Container - Single Container */}
            <motion.div
              className="relative flex flex-row items-center justify-center gap-8 px-8 py-6 z-10 game-container"
              initial={{ scale: 0.8, y: -50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: -50 }}
              style={{
                background: 'rgba(0, 0, 0, 0.3)',
                border: '2px solid rgba(255, 255, 255, 0.8)',
                borderRadius: '12px',
                backdropFilter: 'blur(4px)',
                boxShadow: '0 0 30px rgba(255, 255, 255, 0.3), inset 0 0 20px rgba(255, 255, 255, 0.1)',
                minWidth: '1200px',
                maxWidth: '95vw',
                height: '600px'
              }}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-3 right-3 z-10 p-2 rounded-lg transition-all duration-200 hover:scale-105"
                style={{
                  background: 'rgba(0, 0, 0, 0.5)',
                  border: '1px solid rgba(255, 255, 255, 0.6)',
                  color: 'rgba(255, 255, 255, 0.9)',
                  boxShadow: '0 0 10px rgba(255, 255, 255, 0.2)'
                }}
              >
                <X size={20} />
              </button>

              {/* Left Section - Header Info (Slimmer) */}
              <div 
                className="flex flex-col items-center text-center justify-between h-full py-4"
                style={{ 
                  width: '320px', // Fixed narrower width
                  flexShrink: 0 
                }}
              >
                {/* OPTION 1: Plain White Text */}
                <motion.h1
                  className="text-3xl font-bold mb-3"
                  style={{
                    fontFamily: 'ui-monospace, SFMono-Regular, "Courier New", monospace',
                    color: '#ffffff',
                    textShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
                    letterSpacing: '1.5px'
                  }}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  EASTER EGG LEVEL
                </motion.h1>

                {/* OR OPTION 2: White Text with Rainbow Glow */}
                {/* 
                <motion.h1
                  className="text-3xl font-bold mb-3"
                  style={{
                    fontFamily: 'ui-monospace, SFMono-Regular, "Courier New", monospace',
                    color: '#ffffff',
                    letterSpacing: '1.5px'
                  }}
                  animate={{
                    textShadow: [
                      '0 0 20px #ff0000, 0 0 40px #ff0000',
                      '0 0 20px #ff8000, 0 0 40px #ff8000',
                      '0 0 20px #ffff00, 0 0 40px #ffff00',
                      '0 0 20px #00ff00, 0 0 40px #00ff00',
                      '0 0 20px #0080ff, 0 0 40px #0080ff',
                      '0 0 20px #8000ff, 0 0 40px #8000ff',
                      '0 0 20px #ff0080, 0 0 40px #ff0080',
                      '0 0 20px #ff0000, 0 0 40px #ff0000'
                    ]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    ease: "linear" 
                  }}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  EASTER EGG LEVEL
                </motion.h1>
                */}

                {/* Congratulations Text with Compact Spacing */}
                <div 
                  className="text-center space-y-6 flex-1 flex flex-col justify-center" 
                  style={{ 
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontFamily: 'ui-monospace, SFMono-Regular, "Courier New", monospace',
                    letterSpacing: '0.5px' // Reduced letter spacing
                  }}
                >
                  <div 
                    className="font-bold text-xl" // Slightly smaller
                    style={{ 
                      color: '#00ffff', 
                      textShadow: '0 0 15px rgba(0, 255, 255, 0.7)',
                      textTransform: 'uppercase',
                      letterSpacing: '2px'
                    }}
                  >
                    CONGRATULATIONS!
                  </div>
                  
                  <div 
                    className="text-sm leading-relaxed" // Smaller text
                    style={{ 
                      color: 'rgba(255, 255, 255, 0.85)',
                      letterSpacing: '1px'
                    }}
                  >
                    You've found the hidden easter egg level!
                  </div>
                  
                  <div className="space-y-4"> {/* Reduced spacing */}
                    <div 
                      className="font-bold text-xl" // Smaller
                      style={{ 
                        color: '#ff00ff', 
                        textShadow: '0 0 12px rgba(255, 0, 255, 0.6)',
                        textTransform: 'uppercase',
                        letterSpacing: '1.5px'
                      }}
                    >
                      PLAY FLUTTER NOTES
                      <br />
                      TO GET ADDITIONAL XP!
                    </div>
                    
                    <div 
                      className="text-md leading-relaxed" // Smaller
                      style={{ 
                        color: 'rgba(255, 255, 255, 0.7)',
                        letterSpacing: '0.5px'
                      }}
                    >
                      Gain at least 10 points or more to add to your experience points!
                    </div>
                  </div>
                </div>

                {/* Stats Display - More Compact */}
                <div className="space-y-3 w-full mt-4"> {/* Reduced spacing */}
                  {/* High Score */}
                  <div 
                    className="inline-flex items-center justify-between w-full px-3 py-2 rounded-lg text-xs font-bold" // Smaller padding and text
                    style={{
                      background: 'rgba(0, 0, 0, 0.4)',
                      border: '2px solid rgba(255, 255, 255, 0.6)',
                      color: 'rgba(255, 255, 255, 0.9)',
                      boxShadow: '0 0 15px rgba(255, 255, 255, 0.2)',
                      fontFamily: 'ui-monospace, SFMono-Regular, "Courier New", monospace',
                      letterSpacing: '1.5px',
                      textTransform: 'uppercase'
                    }}
                  >
                    <span>HIGHEST SCORE:</span>
                    <motion.span 
                      className="font-bold text-xl" // Smaller
                      style={{
                        color: '#00ffff',
                        textShadow: '0 0 15px rgba(0, 255, 255, 0.8)',
                        letterSpacing: '1px'
                      }}
                      animate={{
                        textShadow: [
                          '0 0 15px rgba(0, 255, 255, 0.8)',
                          '0 0 25px rgba(0, 255, 255, 1)',
                          '0 0 15px rgba(0, 255, 255, 0.8)'
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {highScore}
                    </motion.span>
                  </div>

                  {/* XP Earned */}
                  <div 
                    className="inline-flex items-center justify-between w-full px-3 py-2 rounded-lg text-xs font-bold" // Smaller padding and text
                    style={{
                      background: 'rgba(0, 0, 0, 0.4)',
                      border: '2px solid rgba(255, 255, 255, 0.6)',
                      color: 'rgba(255, 255, 255, 0.9)',
                      boxShadow: '0 0 15px rgba(255, 255, 255, 0.2)',
                      fontFamily: 'ui-monospace, SFMono-Regular, "Courier New", monospace',
                      letterSpacing: '1.5px',
                      textTransform: 'uppercase'
                    }}
                  >
                    <span>+ XP EARNED:</span>
                    <motion.span 
                      className="font-bold text-xl" // Smaller
                      style={{
                        color: '#ff00ff',
                        textShadow: '0 0 15px rgba(255, 0, 255, 0.8)',
                        letterSpacing: '1px'
                      }}
                      animate={{
                        textShadow: [
                          '0 0 15px rgba(255, 0, 255, 0.8)',
                          '0 0 25px rgba(255, 0, 255, 1)',
                          '0 0 15px rgba(255, 0, 255, 0.8)'
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                    >
                      {totalXP}
                    </motion.span>
                  </div>
                </div>
              </div>

              {/* Right Section - Game Component (Wider) */}
              <div className="flex-grow flex items-center justify-center">
                <div style={{ transform: 'scale(1.3)' }}> {/* Scale up the game */}
                  <FlappyNotebook
                    icon="book"
                    theme="neon"
                    onScore={handleScore}
                    onGameOver={handleGameOver}
                  />
                </div>
              </div>

              {/* Enhanced Corner Accents */}
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden rounded-lg">
                <motion.div 
                  className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 rounded-tl-lg"
                  style={{ borderColor: '#00ffff' }}
                  animate={{
                    boxShadow: [
                      '0 0 8px rgba(0, 255, 255, 0.5)',
                      '0 0 16px rgba(0, 255, 255, 0.8)',
                      '0 0 8px rgba(0, 255, 255, 0.5)'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.div 
                  className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 rounded-tr-lg"
                  style={{ borderColor: '#ff00ff' }}
                  animate={{
                    boxShadow: [
                      '0 0 8px rgba(255, 0, 255, 0.5)',
                      '0 0 16px rgba(255, 0, 255, 0.8)',
                      '0 0 8px rgba(255, 0, 255, 0.5)'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                />
                <motion.div 
                  className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 rounded-bl-lg"
                  style={{ borderColor: '#ff00ff' }}
                  animate={{
                    boxShadow: [
                      '0 0 8px rgba(255, 0, 255, 0.5)',
                      '0 0 16px rgba(255, 0, 255, 0.8)',
                      '0 0 8px rgba(255, 0, 255, 0.5)'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                />
                <motion.div 
                  className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 rounded-br-lg"
                  style={{ borderColor: '#00ffff' }}
                  animate={{
                    boxShadow: [
                      '0 0 8px rgba(0, 255, 255, 0.5)',
                      '0 0 16px rgba(0, 255, 255, 0.8)',
                      '0 0 8px rgba(0, 255, 255, 0.5)'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
                />
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SecretPage;