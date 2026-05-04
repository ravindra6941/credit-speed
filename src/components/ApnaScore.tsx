"use client";
import { motion } from "framer-motion";

export default function ApnaScore() {
  return (
    <section className="bg-[#050B17] py-24 lg:py-32 border-t border-white/5 relative overflow-hidden">
      <div className="absolute right-0 top-0 w-[500px] h-[500px] rounded-full opacity-15 pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(212,168,83,0.18) 0%, transparent 60%)" }}
      />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5 flex justify-center"
          >
            <div className="glass-strong rounded-3xl p-8 w-full max-w-sm">
              <p className="text-gold-400 text-[10px] font-semibold tracking-[0.25em] uppercase mb-6">
                Apna Score
              </p>

              <div className="flex justify-center mb-7">
                <div className="relative w-44 h-44">
                  <svg className="w-44 h-44 -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                    <motion.circle
                      cx="60"
                      cy="60"
                      r="54"
                      fill="none"
                      stroke="#D4A853"
                      strokeWidth="8"
                      strokeDasharray="339.29"
                      strokeLinecap="round"
                      initial={{ strokeDashoffset: 339.29 }}
                      whileInView={{ strokeDashoffset: 84.82 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.8, ease: "easeOut" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-white font-display text-4xl tracking-tight">742</span>
                    <span className="text-gold-400 text-[10px] font-medium tracking-widest mt-1">EXCELLENT</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="bg-white/5 border border-white/5 rounded-xl p-3.5">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-white/70 text-xs font-medium">EMI Streak</span>
                    <span className="text-gold-400 text-xs font-bold tabular-nums">6/6 on time</span>
                  </div>
                  <div className="bg-white/8 rounded-full h-1.5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: "100%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, delay: 0.4 }}
                      className="bg-gold-400 h-1.5 rounded-full"
                    />
                  </div>
                </div>

                <div className="bg-white/5 border border-white/5 rounded-xl p-3.5">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-white/70 text-xs font-medium">Credit Limit</span>
                    <span className="text-gold-400 text-xs font-bold tabular-nums">&#8377;18,000</span>
                  </div>
                  <div className="bg-white/8 rounded-full h-1.5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: "75%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, delay: 0.6 }}
                      className="bg-gold-400 h-1.5 rounded-full"
                    />
                  </div>
                </div>

                <div className="bg-gold-400/10 border border-gold-400/20 rounded-xl p-3.5 text-center">
                  <p className="text-gold-400 text-xs font-semibold">
                    Next milestone: 8 on-time payments
                  </p>
                  <p className="text-gold-400/60 text-[11px] mt-0.5">
                    Unlock &#8377;25,000 pre-approved limit
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7"
          >
            <p className="text-gold-400/80 text-xs font-medium tracking-[0.25em] uppercase mb-4">
              Build Credit. Unlock More.
            </p>
            <h2 className="font-display text-white text-5xl sm:text-6xl lg:text-7xl tracking-tighter leading-[0.95] mb-6">
              Introducing<br />
              <span className="bg-gradient-to-r from-gold-400 to-gold-200 bg-clip-text text-transparent">
                Apna Score.
              </span>
            </h2>
            <p className="text-white/50 mb-10 max-w-md">
              Every on-time EMI builds your credit profile. Higher score, higher limits, faster approvals.
            </p>

            <div className="space-y-5">
              {[
                { n: "1", t: "Pay EMIs on time", d: "Each payment grows your score." },
                { n: "2", t: "Watch your score grow", d: "Hit milestones, unlock limits." },
                { n: "3", t: "Upgrade seamlessly", d: "Pre-approved — zero documents next time." },
              ].map((s) => (
                <div key={s.n} className="flex gap-4">
                  <div className="w-9 h-9 bg-gold-400/10 border border-gold-400/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-gold-400 text-sm font-bold">{s.n}</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{s.t}</p>
                    <p className="text-white/45 text-xs mt-0.5">{s.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
