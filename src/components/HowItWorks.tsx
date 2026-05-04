"use client";
import { motion, useMotionValue, useSpring, useTransform, MotionValue } from "framer-motion";
import { MouseEvent, ReactNode, useRef } from "react";

/* =========================================================================
   3D TILT CARD WRAPPER
   - Card physically tilts toward cursor (max ±9°)
   - A gold radial spotlight follows the cursor across the surface
   - Subtle outer drop-shadow + inner highlight for depth
   - Spring-smoothed motion (no jitter)
   ========================================================================= */

function TiltCard({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0); // -0.5 to 0.5
  const y = useMotionValue(0);

  const xSpring = useSpring(x, { stiffness: 240, damping: 22 });
  const ySpring = useSpring(y, { stiffness: 240, damping: 22 });

  const rotateX = useTransform(ySpring, [-0.5, 0.5], [9, -9]);
  const rotateY = useTransform(xSpring, [-0.5, 0.5], [-9, 9]);

  // Spotlight position as percentages
  const spotX = useTransform(xSpring, [-0.5, 0.5], [0, 100]);
  const spotY = useTransform(ySpring, [-0.5, 0.5], [0, 100]);
  const spotlight = useTransform<number, string>(
    [spotX, spotY] as unknown as MotionValue<number>,
    (latest) => {
      const arr = latest as unknown as number[];
      return `radial-gradient(circle 280px at ${arr[0]}% ${arr[1]}%, rgba(212,168,83,0.22), transparent 60%)`;
    }
  );

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 1200,
      }}
      className={`relative rounded-3xl cursor-pointer
                  shadow-[0_20px_60px_-20px_rgba(0,0,0,0.45)]
                  hover:shadow-[0_30px_80px_-15px_rgba(212,168,83,0.25)]
                  transition-shadow duration-500
                  ${className}`}
    >
      {/* Glass background layer — separate from 3D transform to avoid
          backdrop-filter + preserve-3d compositing bug that blurs content */}
      <div className="absolute inset-0 rounded-3xl glass pointer-events-none" />

      {/* Cursor-following gold spotlight */}
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-3xl opacity-0 hover:opacity-100"
        style={{ background: spotlight, transition: "opacity 0.4s" }}
      />

      {/* Inner highlight on top edge — adds glass depth */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />

      {/* Content — no preserve-3d here so SVGs render crisply */}
      <div className="relative p-7 lg:p-9">
        {children}
      </div>
    </motion.div>
  );
}

/* =========================================================================
   ANIMATED SVG ILLUSTRATIONS
   ========================================================================= */

/**
 * Step 1: Stack of 3 ID cards with checkmark
 *   - Three cards fan out + the top one shows a gold checkmark drawing in
 */
function RetailerIllustration() {
  return (
    <svg viewBox="0 0 200 140" className="w-full h-auto" fill="none">
      {/* Bottom card (Aadhaar mock) */}
      <motion.g
        initial={{ y: 24, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <rect
          x="50" y="56" width="110" height="64" rx="10"
          fill="rgba(212,168,83,0.06)"
          stroke="rgba(212,168,83,0.25)"
          strokeWidth="1"
        />
        <rect x="62" y="68" width="32" height="3" rx="1.5" fill="rgba(212,168,83,0.4)" />
        <rect x="62" y="76" width="60" height="2" rx="1" fill="rgba(255,255,255,0.15)" />
      </motion.g>

      {/* Middle card (PAN mock) */}
      <motion.g
        initial={{ y: 18, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.45, duration: 0.6 }}
      >
        <rect
          x="40" y="36" width="110" height="64" rx="10"
          fill="rgba(255,255,255,0.04)"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="1"
        />
        <rect x="52" y="48" width="32" height="3" rx="1.5" fill="rgba(255,255,255,0.4)" />
        <rect x="52" y="56" width="50" height="2" rx="1" fill="rgba(255,255,255,0.15)" />
      </motion.g>

      {/* Top card (with checkmark) */}
      <motion.g
        initial={{ y: 12, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        <rect
          x="30" y="16" width="110" height="64" rx="10"
          fill="rgba(10,22,40,0.85)"
          stroke="#D4A853"
          strokeWidth="1.5"
        />
        <rect x="42" y="28" width="34" height="4" rx="2" fill="rgba(255,255,255,0.55)" />
        <rect x="42" y="38" width="58" height="2.5" rx="1.25" fill="rgba(255,255,255,0.25)" />
        <rect x="42" y="46" width="48" height="2.5" rx="1.25" fill="rgba(255,255,255,0.25)" />
        <rect x="42" y="54" width="54" height="2.5" rx="1.25" fill="rgba(255,255,255,0.25)" />
        <rect x="42" y="62" width="40" height="2.5" rx="1.25" fill="rgba(255,255,255,0.25)" />

        {/* Gold checkmark badge */}
        <motion.circle
          cx="120" cy="50" r="13"
          fill="#D4A853"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.1, type: "spring", stiffness: 380, damping: 18 }}
        />
        <motion.path
          d="M 114 50 L 119 55 L 127 47"
          stroke="#0A1628"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.3, duration: 0.4 }}
        />
      </motion.g>

      {/* Floating sparkle particles */}
      {[
        { cx: 165, cy: 30, delay: 1.5 },
        { cx: 172, cy: 80, delay: 1.7 },
        { cx: 22, cy: 45, delay: 1.9 },
      ].map((p, i) => (
        <motion.circle
          key={i}
          cx={p.cx}
          cy={p.cy}
          r="1.5"
          fill="#D4A853"
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
          viewport={{ once: true }}
          transition={{ delay: p.delay, duration: 1.2, repeat: Infinity, repeatDelay: 2 }}
        />
      ))}
    </svg>
  );
}

/**
 * Step 2: Smartphone with tap ripple + product cards floating in
 */
function CustomerIllustration() {
  return (
    <svg viewBox="0 0 200 140" className="w-full h-auto" fill="none">
      {/* Ambient gold glow */}
      <defs>
        <radialGradient id="cust-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(212,168,83,0.25)" />
          <stop offset="100%" stopColor="rgba(212,168,83,0)" />
        </radialGradient>
      </defs>
      <ellipse cx="100" cy="80" rx="60" ry="40" fill="url(#cust-glow)" />

      {/* Phone body */}
      <motion.g
        initial={{ y: 12, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.6 }}
        style={{ transformOrigin: "100px 70px" }}
      >
        <rect
          x="78" y="16" width="44" height="92" rx="9"
          fill="#0A1628"
          stroke="#D4A853"
          strokeWidth="1.5"
        />
        <rect x="80" y="18" width="40" height="88" rx="7" fill="#050B17" />
        {/* notch */}
        <rect x="92" y="22" width="16" height="3" rx="1.5" fill="#000" />
        {/* screen content lines */}
        <rect x="86" y="34" width="28" height="3" rx="1.5" fill="rgba(212,168,83,0.5)" />
        <rect x="86" y="42" width="20" height="2" rx="1" fill="rgba(255,255,255,0.25)" />
        <rect x="86" y="48" width="24" height="2" rx="1" fill="rgba(255,255,255,0.25)" />

        {/* Mini "select phone" tile */}
        <rect x="86" y="60" width="28" height="22" rx="3" fill="rgba(212,168,83,0.15)" stroke="#D4A853" strokeWidth="0.6" />
        <circle cx="100" cy="68" r="3" fill="#D4A853" />
        <rect x="92" y="74" width="16" height="2" rx="1" fill="rgba(255,255,255,0.4)" />

        {/* Action button */}
        <rect x="86" y="88" width="28" height="10" rx="5" fill="#D4A853" />
        <rect x="93" y="91" width="14" height="4" rx="2" fill="#0A1628" />
      </motion.g>

      {/* Tap ripple at button */}
      <motion.circle
        cx="100" cy="93" r="6"
        fill="none"
        stroke="#D4A853"
        strokeWidth="1.5"
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: [0, 3, 4.5], opacity: [0, 0.6, 0] }}
        viewport={{ once: true }}
        transition={{ delay: 1, duration: 1.6, repeat: Infinity, repeatDelay: 1.4 }}
        style={{ transformOrigin: "100px 93px" }}
      />

      {/* Aadhaar + PAN floating mini cards (alternating in) */}
      <motion.g
        initial={{ x: -20, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.9, duration: 0.5 }}
      >
        <rect x="14" y="40" width="48" height="22" rx="4" fill="rgba(10,22,40,0.85)" stroke="rgba(212,168,83,0.3)" strokeWidth="1" />
        <rect x="20" y="46" width="14" height="3" rx="1.5" fill="rgba(212,168,83,0.6)" />
        <rect x="20" y="53" width="28" height="2" rx="1" fill="rgba(255,255,255,0.3)" />
        <text x="38" y="52" fontFamily="Inter, sans-serif" fontSize="6" fontWeight="700" fill="rgba(212,168,83,0.9)">PAN</text>
      </motion.g>
      <motion.g
        initial={{ x: 20, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 1.05, duration: 0.5 }}
      >
        <rect x="138" y="68" width="48" height="22" rx="4" fill="rgba(10,22,40,0.85)" stroke="rgba(212,168,83,0.3)" strokeWidth="1" />
        <rect x="144" y="74" width="14" height="3" rx="1.5" fill="rgba(212,168,83,0.6)" />
        <rect x="144" y="81" width="28" height="2" rx="1" fill="rgba(255,255,255,0.3)" />
        <text x="160" y="80" fontFamily="Inter, sans-serif" fontSize="6" fontWeight="700" fill="rgba(212,168,83,0.9)">UID</text>
      </motion.g>
    </svg>
  );
}

/**
 * Step 3: Stopwatch with gold arc sweeping + checkmark on completion
 */
function ApprovalIllustration() {
  return (
    <svg viewBox="0 0 200 140" className="w-full h-auto" fill="none">
      {/* Stopwatch crown */}
      <motion.g
        initial={{ y: -8, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <rect x="92" y="14" width="16" height="6" rx="2" fill="rgba(255,255,255,0.4)" />
        <rect x="86" y="20" width="28" height="4" rx="1" fill="#D4A853" />
      </motion.g>

      {/* Outer ring + ambient glow */}
      <defs>
        <radialGradient id="appr-glow" cx="50%" cy="60%" r="50%">
          <stop offset="0%" stopColor="rgba(212,168,83,0.25)" />
          <stop offset="100%" stopColor="rgba(212,168,83,0)" />
        </radialGradient>
        <linearGradient id="appr-arc" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#E1B751" />
          <stop offset="100%" stopColor="#C4922A" />
        </linearGradient>
      </defs>
      <circle cx="100" cy="80" r="50" fill="url(#appr-glow)" />

      <motion.g
        initial={{ scale: 0.85, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.35, duration: 0.6, type: "spring", stiffness: 240 }}
        style={{ transformOrigin: "100px 80px" }}
      >
        {/* Watch face */}
        <circle cx="100" cy="80" r="34" fill="rgba(10,22,40,0.85)" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />

        {/* Minute markers */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30 - 90) * (Math.PI / 180);
          const x1 = 100 + Math.cos(angle) * 30;
          const y1 = 80 + Math.sin(angle) * 30;
          const x2 = 100 + Math.cos(angle) * 26;
          const y2 = 80 + Math.sin(angle) * 26;
          return (
            <line
              key={i}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={i % 3 === 0 ? "#D4A853" : "rgba(255,255,255,0.25)"}
              strokeWidth={i % 3 === 0 ? 1.5 : 0.8}
              strokeLinecap="round"
            />
          );
        })}

        {/* Background ring (track) */}
        <circle
          cx="100" cy="80" r="22"
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="3.5"
        />
        {/* Animated gold progress arc — sweeps once on view */}
        <motion.circle
          cx="100" cy="80" r="22"
          fill="none"
          stroke="url(#appr-arc)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray="138.23"
          initial={{ strokeDashoffset: 138.23 }}
          whileInView={{ strokeDashoffset: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.7, duration: 1.6, ease: "easeOut" }}
          style={{ transform: "rotate(-90deg)", transformOrigin: "100px 80px" }}
        />

        {/* Center checkmark */}
        <motion.g
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 2.2, type: "spring", stiffness: 380, damping: 18 }}
          style={{ transformOrigin: "100px 80px" }}
        >
          <circle cx="100" cy="80" r="11" fill="#D4A853" />
          <motion.path
            d="M 95 80 L 99 84 L 106 76"
            stroke="#0A1628"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 2.4, duration: 0.35 }}
          />
        </motion.g>

        {/* "5 MIN" label */}
        <motion.text
          x="100" y="120" textAnchor="middle"
          fontFamily="Inter, sans-serif"
          fontSize="7"
          fontWeight="700"
          letterSpacing="2"
          fill="rgba(212,168,83,0.85)"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.4, duration: 0.5 }}
        >
          5 MIN
        </motion.text>
      </motion.g>
    </svg>
  );
}

/* =========================================================================
   MAIN COMPONENT
   ========================================================================= */

const steps = [
  {
    num: "01",
    title: "Retailer signs up.",
    desc: "GST, PAN, Aadhaar. Activated within hours, not days.",
    Illustration: RetailerIllustration,
  },
  {
    num: "02",
    title: "Customer walks in.",
    desc: "Picks any phone. Aadhaar + PAN — that's all.",
    Illustration: CustomerIllustration,
  },
  {
    num: "03",
    title: "Approval in 5 minutes.",
    desc: "NBFC decisions in real time. Walk out with the phone.",
    Illustration: ApprovalIllustration,
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="bg-[#050B17] py-24 lg:py-32 relative overflow-hidden"
    >
      {/* Ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full opacity-20 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(212,168,83,0.18) 0%, transparent 60%)",
        }}
      />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl mb-16 lg:mb-20"
        >
          <p className="text-gold-400/80 text-xs font-medium tracking-[0.25em] uppercase mb-4">
            How It Works
          </p>
          <h2 className="font-display text-white text-5xl sm:text-6xl lg:text-7xl tracking-tighter leading-[0.95]">
            Three steps.
            <br />
            <span className="text-white/40">That&apos;s the whole process.</span>
          </h2>
        </motion.div>

        <div
          className="grid md:grid-cols-3 gap-5 lg:gap-6"
          style={{ perspective: "1200px" }}
        >
          {steps.map((s, i) => (
            <TiltCard key={s.num} delay={i * 0.15}>
              {/* Illustration sits at top */}
              <div className="h-[140px] lg:h-[160px] flex items-center justify-center mb-5">
                <s.Illustration />
              </div>

              {/* Step number */}
              <p className="font-display text-gold-400/40 text-5xl tracking-tighter leading-none mb-3">
                {s.num}
              </p>

              {/* Title */}
              <h3 className="font-display text-white text-2xl tracking-tight mb-2">
                {s.title}
              </h3>

              {/* Description */}
              <p className="text-white/50 text-sm leading-relaxed">
                {s.desc}
              </p>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}
