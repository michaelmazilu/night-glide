"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type GamePhase = "idle" | "running" | "gameover";

type Player = {
  x: number;
  y: number;
  width: number;
  height: number;
  velocityY: number;
  pulse: number;
  angle: number;
};

type Asteroid = {
  x: number;
  y: number;
  radius: number;
  speed: number;
  spin: number;
  rotation: number;
};

type BoostType = "shield" | "shrink" | "surge";

type BoostOrb = {
  x: number;
  y: number;
  radius: number;
  speed: number;
  glow: number;
  kind: BoostType;
};

type BoostInstance = {
  type: BoostType;
  expiresAt: number;
};

type Star = {
  x: number;
  y: number;
  depth: number;
  drift: number;
  twinkle: number;
};

const ASTEROID_INTERVAL = 820;
const ORB_INTERVAL = 1100;
const PLAYER_ACCEL = 1600;
const PLAYER_DAMPING = 0.6;
const PLAYER_TILT_LIMIT = 0.45;
const PLAYER_TILT_RESPONSE = 12;
const PLAYER_TILT_VELOCITY_DIVISOR = 900;

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const createStarField = (count = 80): Star[] =>
  Array.from({ length: count }, () => ({
    x: Math.random(),
    y: Math.random(),
    depth: 0.2 + Math.random() * 0.8,
    drift: 0.08 + Math.random() * 0.25,
    twinkle: Math.random() * Math.PI * 2,
  }));

const BOOST_TYPES: BoostType[] = ["shield", "shrink", "surge"];

const BOOST_DURATION: Record<BoostType, number> = {
  shield: 5500,
  shrink: 6000,
  surge: 4500,
};

const BOOST_LABELS: Record<BoostType, string> = {
  shield: "Shield",
  shrink: "Nanoform",
  surge: "Surge",
};

const BOOST_DESCRIPTIONS: Record<BoostType, string> = {
  shield: "Phase shell absorbs impacts",
  shrink: "Slim profile for tight gaps",
  surge: "Amplified thrusters",
};

const BOOST_COLORS: Record<BoostType, string> = {
  shield: "#6fd0ff",
  shrink: "#f2f2f2",
  surge: "#ffe37d",
};

const hexToRgba = (hex: string, alpha: number) => {
  const normalized = hex.replace("#", "");
  const bigint = parseInt(
    normalized.length === 3
      ? normalized
          .split("")
          .map((char) => char + char)
          .join("")
      : normalized,
    16,
  );
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export default function Home() {
  return (
    <div className="nightglide-shell">
      <NightGlideGame />
    </div>
  );
}

function NightGlideGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number>();
  const worldRef = useRef({ width: 0, height: 0 });

  const playerRef = useRef<Player>({
    x: 120,
    y: 120,
    width: 74,
    height: 30,
    velocityY: 0,
    pulse: 0,
    angle: 0,
  });

  const asteroidsRef = useRef<Asteroid[]>([]);
  const boostOrbsRef = useRef<BoostOrb[]>([]);
  const starsRef = useRef<Star[]>(createStarField());
  const boostsRef = useRef<BoostInstance[]>([]);
  const difficultyRef = useRef(0);
  const runStartRef = useRef(0);

  const keysRef = useRef({ up: false, down: false });
  const lastAsteroidRef = useRef(0);
  const lastOrbRef = useRef(0);

  const [phase, setPhase] = useState<GamePhase>("idle");
  const [activeBoosts, setActiveBoosts] = useState<BoostInstance[]>([]);
  const [lastRunDuration, setLastRunDuration] = useState(0);
  const [, forceTick] = useState(0);

  const syncBoostState = useCallback(() => {
    setActiveBoosts([...boostsRef.current]);
  }, []);

  const removeExpiredBoosts = useCallback(
    (now: number) => {
      let changed = false;
      boostsRef.current = boostsRef.current.filter((boost) => {
        if (boost.expiresAt > now) {
          return true;
        }
        changed = true;
        return false;
      });
      if (changed) {
        syncBoostState();
      }
    },
    [syncBoostState],
  );

  const activateBoost = useCallback(
    (type: BoostType, now: number) => {
      const expiresAt = now + BOOST_DURATION[type];
      const existingIndex = boostsRef.current.findIndex(
        (boost) => boost.type === type,
      );
      if (existingIndex >= 0) {
        boostsRef.current[existingIndex] = {
          type,
          expiresAt,
        };
      } else {
        boostsRef.current.push({ type, expiresAt });
      }
      syncBoostState();
    },
    [syncBoostState],
  );

  const boostActive = useCallback(
    (type: BoostType) => boostsRef.current.some((boost) => boost.type === type),
    [],
  );

  const getRemainingLabel = useCallback((expiresAt: number) => {
    if (typeof performance === "undefined") {
      return "0.0s";
    }
    const remaining = Math.max(0, expiresAt - performance.now());
    return `${(remaining / 1000).toFixed(1)}s`;
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      forceTick((tick) => (tick + 1) % Number.MAX_SAFE_INTEGER);
    }, 250);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent, value: boolean) => {
      if (event.key === "ArrowUp" || event.key === "w" || event.key === "W") {
        keysRef.current.up = value;
      }
      if (
        event.key === "ArrowDown" ||
        event.key === "s" ||
        event.key === "S"
      ) {
        keysRef.current.down = value;
      }
    };

    const down = (event: KeyboardEvent) => handleKey(event, true);
    const up = (event: KeyboardEvent) => handleKey(event, false);

    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);

    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const prevHeight = worldRef.current.height || 1;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    worldRef.current = { width: canvas.width, height: canvas.height };

    const player = playerRef.current;
    const relativeY = clamp(player.y / prevHeight, 0, 1);
    player.x = canvas.width * 0.18;
    player.y = clamp(
      relativeY * canvas.height,
      48,
      canvas.height - player.height - 48,
    );
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  const handleGameOver = useCallback(() => {
    const now = performance.now();
    const elapsed = Math.max(0, now - runStartRef.current);
    setLastRunDuration(Number((elapsed / 1000).toFixed(1)));
    boostsRef.current = [];
    setActiveBoosts([]);
    setPhase("gameover");
    keysRef.current = { up: false, down: false };
  }, []);

  const spawnAsteroid = useCallback(() => {
    const { width, height } = worldRef.current;
    const radius = 20 + Math.random() * 40;
    asteroidsRef.current.push({
      x: width + radius,
      y: Math.random() * (height - radius * 2) + radius,
      radius,
      speed: 260 + Math.random() * 220,
      spin: (Math.random() - 0.5) * 0.02,
      rotation: Math.random() * Math.PI * 2,
    });
  }, []);

  const spawnOrb = useCallback(() => {
    const { width, height } = worldRef.current;
    const radius = 10 + Math.random() * 6;
    const kind =
      BOOST_TYPES[Math.floor(Math.random() * BOOST_TYPES.length)];
    boostOrbsRef.current.push({
      x: width + radius,
      y: Math.random() * (height - radius * 2) + radius,
      radius,
      speed: 220 + Math.random() * 140,
      glow: Math.random() * Math.PI * 2,
      kind,
    });
  }, []);

  const updateStars = useCallback((delta: number) => {
    const parallaxGain = 1 + difficultyRef.current * 0.02;
    starsRef.current.forEach((star) => {
      star.x -= delta * (0.09 + star.depth * star.drift * 1.4) * parallaxGain;
      star.twinkle += delta * (0.7 + star.depth) * parallaxGain;
      if (star.x < 0) {
        star.x = 1;
        star.y = (star.y + Math.random() * 0.2) % 1;
        star.depth = 0.2 + Math.random() * 0.8;
      }
    });
  }, []);

  const updateGame = useCallback(
    (delta: number, now: number) => {
      if (phase !== "running") {
        return;
      }

      removeExpiredBoosts(now);

      const { height } = worldRef.current;
      const player = playerRef.current;
      difficultyRef.current += delta * 0.6;
      const difficultyScale = Math.min(1 + difficultyRef.current * 0.25, 4);

      const shrinkActive = boostActive("shrink");
      const surgeActive = boostActive("surge");
      const shieldActive = boostActive("shield");

      const shipScale = shrinkActive ? 0.75 : 1;
      const shipWidth = player.width * shipScale;
      const shipHeight = player.height * shipScale;

      player.pulse += delta * 1.8;

      const input =
        (keysRef.current.up ? -1 : 0) + (keysRef.current.down ? 1 : 0);
      const targetVelocity = input * PLAYER_ACCEL * (surgeActive ? 1.6 : 1);
      player.velocityY =
        player.velocityY * PLAYER_DAMPING + targetVelocity * delta * 1.65;

      player.y +=
        player.velocityY * delta * 1.45 +
        Math.sin(player.pulse) * 8 * delta * (surgeActive ? 1.2 : 1);
      const tiltLimit = surgeActive ? PLAYER_TILT_LIMIT * 1.15 : PLAYER_TILT_LIMIT;
      const targetAngle = clamp(
        (player.velocityY / PLAYER_TILT_VELOCITY_DIVISOR) * tiltLimit,
        -tiltLimit,
        tiltLimit,
      );
      player.angle +=
        (targetAngle - player.angle) *
        Math.min(1, delta * PLAYER_TILT_RESPONSE);
      player.y = clamp(
        player.y,
        48,
        height - shipHeight - 48,
      );

      if (now - lastAsteroidRef.current > ASTEROID_INTERVAL) {
        spawnAsteroid();
        lastAsteroidRef.current = now;
      }

      if (now - lastOrbRef.current > ORB_INTERVAL) {
        spawnOrb();
        lastOrbRef.current = now;
      }

      let collided = false;

      const nextAsteroids: Asteroid[] = [];
      for (const asteroid of asteroidsRef.current) {
        const updatedAsteroid: Asteroid = {
          ...asteroid,
          x: asteroid.x - asteroid.speed * (0.9 + difficultyScale) * delta,
          rotation: asteroid.rotation + asteroid.spin,
        };

        const closestX = clamp(
          updatedAsteroid.x,
          player.x,
          player.x + shipWidth,
        );
        const closestY = clamp(
          updatedAsteroid.y,
          player.y,
          player.y + shipHeight,
        );
        const dx = updatedAsteroid.x - closestX;
        const dy = updatedAsteroid.y - closestY;

        if (dx * dx + dy * dy < (updatedAsteroid.radius - 6) ** 2) {
          collided = true;
        }

        if (updatedAsteroid.x + updatedAsteroid.radius > -60) {
          nextAsteroids.push(updatedAsteroid);
        }
      }
      asteroidsRef.current = nextAsteroids;

      const nextOrbs: BoostOrb[] = [];
      for (const orb of boostOrbsRef.current) {
        const updatedOrb: BoostOrb = {
          ...orb,
          x: orb.x - orb.speed * (0.8 + difficultyScale * 0.9) * delta,
          glow: orb.glow + delta * 2.4,
        };

        const dx =
          updatedOrb.x - (player.x + shipWidth / 2);
        const dy =
          updatedOrb.y - (player.y + shipHeight / 2);
        const distSq = dx * dx + dy * dy;

        if (
          distSq <
          (updatedOrb.radius + Math.min(shipWidth, shipHeight) / 2) ** 2
        ) {
          activateBoost(updatedOrb.kind, now);
          continue;
        }

        if (updatedOrb.x + updatedOrb.radius > -40) {
          nextOrbs.push(updatedOrb);
        }
      }
      boostOrbsRef.current = nextOrbs;

      if (collided && !shieldActive) {
        handleGameOver();
      }
    },
    [
      activateBoost,
      boostActive,
      handleGameOver,
      phase,
      removeExpiredBoosts,
      spawnAsteroid,
      spawnOrb,
    ],
  );

  const drawScene = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      const { width, height } = ctx.canvas;

      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, "#050505");
      gradient.addColorStop(0.55, "#020202");
      gradient.addColorStop(1, "#000000");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      ctx.save();
      starsRef.current.forEach((star) => {
        const x = star.x * width;
        const y = star.y * height;
        const size = 0.6 + star.depth * 2.2;
        const alpha = 0.35 + Math.sin(star.twinkle) * 0.3;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = "#f2f2f2";
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();

      boostOrbsRef.current.forEach((orb) => {
        ctx.save();
        const glow = 0.5 + Math.sin(orb.glow) * 0.3;
        const accent = BOOST_COLORS[orb.kind];
        const gradientOrb = ctx.createRadialGradient(
          orb.x,
          orb.y,
          0,
          orb.x,
          orb.y,
          orb.radius * 2.4,
        );
        gradientOrb.addColorStop(0, "rgba(255,255,255,1)");
        gradientOrb.addColorStop(0.35, hexToRgba(accent, 0.85));
        gradientOrb.addColorStop(1, "rgba(255,255,255,0)");
        ctx.globalAlpha = 0.85 + glow * 0.15;
        ctx.fillStyle = gradientOrb;
        ctx.shadowColor = hexToRgba(accent, 0.55);
        ctx.shadowBlur = 28;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius * 2.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.lineWidth = 1.35;
        ctx.strokeStyle = accent;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius * 1.7, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      });

      asteroidsRef.current.forEach((asteroid) => {
        ctx.save();
        ctx.translate(asteroid.x, asteroid.y);
        ctx.rotate(asteroid.rotation);
        const gradientAst = ctx.createRadialGradient(
          0,
          0,
          asteroid.radius * 0.2,
          0,
          0,
          asteroid.radius,
        );
        gradientAst.addColorStop(0, "#ffffff");
        gradientAst.addColorStop(0.5, "#cacaca");
        gradientAst.addColorStop(1, "#3b3b3b");
        ctx.fillStyle = gradientAst;
        ctx.shadowColor = "rgba(255,255,255,0.28)";
        ctx.shadowBlur = 18;
        ctx.beginPath();
        ctx.arc(0, 0, asteroid.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = "rgba(255,255,255,0.35)";
        ctx.beginPath();
        ctx.arc(0, 0, asteroid.radius * 0.92, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      });

      const player = playerRef.current;
      const shrinkActive = boostActive("shrink");
      const shieldActive = boostActive("shield");
      const surgeActive = boostActive("surge");
      const shipScale = shrinkActive ? 0.75 : 1;
      const scaledHeight = player.height * shipScale;

      ctx.save();
      ctx.translate(player.x, player.y + scaledHeight / 2);
      ctx.rotate(player.angle);

      const bodyLength = (player.width + 14) * shipScale;
      const bodyHeight = (player.height + 8) * shipScale;
      const shellGradient = ctx.createLinearGradient(
        0,
        -bodyHeight / 2,
        bodyLength,
        bodyHeight / 2,
      );
      shellGradient.addColorStop(0, "#fdfdfd");
      shellGradient.addColorStop(0.6, "#c9c9c9");
      shellGradient.addColorStop(1, "#9c9c9c");

      ctx.beginPath();
      ctx.moveTo(0, -bodyHeight / 2);
      ctx.quadraticCurveTo(
        bodyLength * 0.55,
        -bodyHeight / 2 - 8 * shipScale,
        bodyLength,
        0,
      );
      ctx.quadraticCurveTo(
        bodyLength * 0.55,
        bodyHeight / 2 + 8 * shipScale,
        0,
        bodyHeight / 2,
      );
      ctx.closePath();
      ctx.fillStyle = shellGradient;
      ctx.fill();

      const finColor = "#d7d7d7";
      ctx.fillStyle = finColor;
      ctx.beginPath();
      ctx.moveTo(bodyLength * 0.2, bodyHeight / 2);
      ctx.lineTo(bodyLength * 0.05, bodyHeight / 2 + 18 * shipScale);
      ctx.lineTo(bodyLength * 0.45, bodyHeight / 2);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(bodyLength * 0.2, -bodyHeight / 2);
      ctx.lineTo(bodyLength * 0.05, -bodyHeight / 2 - 18 * shipScale);
      ctx.lineTo(bodyLength * 0.45, -bodyHeight / 2);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.ellipse(
        bodyLength * 0.55,
        0,
        bodyHeight * 0.22,
        bodyHeight * 0.35,
        0,
        0,
        Math.PI * 2,
      );
      const cockpitGradient = ctx.createRadialGradient(
        bodyLength * 0.6,
        -bodyHeight * 0.1,
        2,
        bodyLength * 0.55,
        0,
        bodyHeight * 0.35,
      );
      cockpitGradient.addColorStop(0, "rgba(0,0,0,0.85)");
      cockpitGradient.addColorStop(1, "rgba(40,40,40,0.9)");
      ctx.fillStyle = cockpitGradient;
      ctx.fill();

      ctx.globalAlpha = surgeActive ? 0.8 : 0.6;
      ctx.fillStyle = surgeActive ? "#ffffff" : "#f8f8f8";
      ctx.beginPath();
      ctx.moveTo(-14 * shipScale, 0);
      ctx.quadraticCurveTo(
        -46 * shipScale,
        -10 * shipScale - Math.sin(player.pulse) * 4,
        -78 * shipScale,
        0,
      );
      ctx.quadraticCurveTo(
        -46 * shipScale,
        10 * shipScale + Math.sin(player.pulse) * 4,
        -14 * shipScale,
        0,
      );
      ctx.closePath();
      ctx.fill();

      ctx.globalAlpha = 0.3;
      ctx.fillStyle = "#f0f0f0";
      ctx.beginPath();
      ctx.ellipse(
        -28 * shipScale,
        0,
        14 * shipScale,
        bodyHeight * 0.85 + Math.sin(player.pulse) * 6,
        0,
        0,
        Math.PI * 2,
      );
      ctx.fill();

      if (shieldActive) {
        ctx.globalAlpha = 0.45 + Math.sin(player.pulse * 2) * 0.15;
        ctx.lineWidth = 3;
        ctx.strokeStyle = BOOST_COLORS.shield;
        ctx.beginPath();
        ctx.ellipse(
          bodyLength * 0.2,
          0,
          bodyLength * 0.7,
          bodyHeight * 0.9 + Math.sin(player.pulse * 2) * 4,
          0,
          0,
          Math.PI * 2,
        );
        ctx.stroke();
      }

      ctx.restore();

      const horizonGradient = ctx.createLinearGradient(0, height - 220, 0, height);
      horizonGradient.addColorStop(0, "rgba(18,18,18,0)");
      horizonGradient.addColorStop(1, "rgba(4,4,4,0.85)");
      ctx.fillStyle = horizonGradient;
      ctx.fillRect(0, height - 220, width, 220);
    },
    [boostActive],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    let lastTime = performance.now();

    const loop = (time: number) => {
      const delta = Math.min((time - lastTime) / 1000, 0.033);
      lastTime = time;

      updateStars(delta);
      updateGame(delta, time);
      drawScene(ctx);
      animationRef.current = requestAnimationFrame(loop);
    };

    animationRef.current = requestAnimationFrame(loop);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [drawScene, updateGame, updateStars]);

  const startGame = useCallback(() => {
    const { height, width } = worldRef.current;
    playerRef.current = {
      x: width * 0.18,
      y: height / 2 - 12,
      width: 74,
      height: 30,
      velocityY: 0,
      pulse: 0,
      angle: 0,
    };
    asteroidsRef.current = [];
    boostOrbsRef.current = [];
    boostsRef.current = [];
    setActiveBoosts([]);
    difficultyRef.current = 0;
    runStartRef.current = performance.now();
    setLastRunDuration(0);
    lastAsteroidRef.current = performance.now();
    lastOrbRef.current = performance.now();
    keysRef.current = { up: false, down: false };
    setPhase("running");
  }, []);

  return (
    <div className="nightglide-stage">
      <canvas ref={canvasRef} className="nightglide-canvas" />

      <div className="nightglide-hud">
        {activeBoosts.length ? (
          activeBoosts.map((boost) => (
            <div
              key={boost.type}
              className={`nightglide-badge boost-${boost.type}`}
            >
              <p>{BOOST_LABELS[boost.type]}</p>
              <span>{BOOST_DESCRIPTIONS[boost.type]}</span>
              <small>{phase === "running" ? getRemainingLabel(boost.expiresAt) : ""}</small>
            </div>
          ))
        ) : (
          <div className="nightglide-badge subtle">
            <p>Boost cores</p>
            <span>Awaiting pickup</span>
          </div>
        )}
      </div>

      {phase === "running" && (
        <div className="nightglide-tip">
          Glide with `W`/`S` or arrow keys · snag boost cores for shield,
          nanoform, and surge effects.
        </div>
      )}

      {phase !== "running" && (
        <div className="nightglide-overlay">
          <div className="nightglide-card">
            <div>
              <p className="nightglide-label">Infinite night runner</p>
              <h1>NightGlide</h1>
              {phase === "idle" ? (
                <p>
                  Launch instantly. Collect luminous boost cores mid-run for a
                  shield bubble, nanoform silhouette, or thruster surge.
                </p>
              ) : (
                <p>
                  You drifted for <span>{lastRunDuration.toFixed(1)}</span>s.
                  Boosts reset on retry.
                </p>
              )}
            </div>
            <button onClick={startGame}>
              {phase === "idle" ? "Start" : "Try Again"}
            </button>
            <div className="nightglide-boost-row">
              {BOOST_TYPES.map((type) => (
                <div key={type} className="nightglide-boost-chip">
                  <strong>{BOOST_LABELS[type]}</strong>
                  <span>{BOOST_DESCRIPTIONS[type]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
