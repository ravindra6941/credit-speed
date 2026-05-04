"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "./ThemeProvider";

/* iOS-style sliding theme switch
   - Track shows BOTH sun + moon (active=bright, inactive=dimmed)
   - Glossy gradient thumb springs between positions
   - Active icon crossfades inside the thumb
   - Track tint shifts subtly between themes
*/

const SunIcon = ({ size = 11, className = "" }: { size?: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="4" fill="currentColor" stroke="none" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
  </svg>
);

const MoonIcon = ({ size = 11, className = "" }: { size?: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
  </svg>
);

// Track geometry
const TRACK_WIDTH = 56;
const TRACK_HEIGHT = 28;
const THUMB_SIZE = 22;
const PADDING = 3;
const TRAVEL = TRACK_WIDTH - THUMB_SIZE - PADDING * 2; // 25

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
      role="switch"
      aria-checked={isDark}
      style={{ width: TRACK_WIDTH, height: TRACK_HEIGHT }}
      className={`relative rounded-full transition-colors duration-500 cursor-pointer
        flex items-center group
        hover:scale-[1.04] active:scale-[0.96] transition-transform
        ${isDark
          ? "bg-white/[0.06] border border-white/[0.10] hover:border-white/[0.20]"
          : "bg-gradient-to-b from-gold-200/80 to-gold-300/60 border border-gold-400/40 hover:border-gold-500/50"
        }
        ${className}`}
    >
      {/* SUN — left side icon (visible at high opacity when light, dim when dark) */}
      <span
        className={`absolute top-1/2 -translate-y-1/2 transition-opacity duration-300 pointer-events-none ${
          isDark ? "opacity-30" : "opacity-0"
        }`}
        style={{ left: 8 }}
      >
        <SunIcon size={11} className="text-gold-400" />
      </span>

      {/* MOON — right side icon (visible at high opacity when dark, dim when light) */}
      <span
        className={`absolute top-1/2 -translate-y-1/2 transition-opacity duration-300 pointer-events-none ${
          isDark ? "opacity-0" : "opacity-30"
        }`}
        style={{ right: 8 }}
      >
        <MoonIcon size={10} className="text-navy-500" />
      </span>

      {/* SLIDING THUMB with active icon */}
      <motion.span
        initial={false}
        animate={{ x: isDark ? TRAVEL : 0 }}
        transition={{ type: "spring", stiffness: 600, damping: 40, mass: 0.7 }}
        style={{
          width: THUMB_SIZE,
          height: THUMB_SIZE,
          marginLeft: PADDING,
        }}
        className={`relative rounded-full flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.35)]
          ${isDark
            ? "bg-gradient-to-br from-navy-300 to-navy-500"
            : "bg-gradient-to-br from-white to-gold-100"
          }
          before:absolute before:inset-0 before:rounded-full
          before:bg-gradient-to-b before:from-white/30 before:to-transparent before:opacity-60
          before:pointer-events-none`}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <motion.span
              key="moon-thumb"
              initial={{ opacity: 0, rotate: -45, scale: 0.5 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 45, scale: 0.5 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="absolute"
            >
              <MoonIcon size={11} className="text-gold-300" />
            </motion.span>
          ) : (
            <motion.span
              key="sun-thumb"
              initial={{ opacity: 0, rotate: -45, scale: 0.5 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 45, scale: 0.5 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="absolute"
            >
              <SunIcon size={12} className="text-gold-600" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.span>
    </button>
  );
}
