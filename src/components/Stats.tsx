"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

type StatItem = {
  value: string;
  label: string;
  numericTarget: number | null;
  suffix: string;
};

const stats: StatItem[] = [
  { value: "500+", label: "Retailers", numericTarget: 500, suffix: "+" },
  { value: "5", label: "Min Approval", numericTarget: 5, suffix: "" },
  { value: "10+", label: "NBFC Partners", numericTarget: 10, suffix: "+" },
];

function CountUp({
  target,
  suffix,
  duration = 1600,
  trigger,
}: {
  target: number;
  suffix: string;
  duration?: number;
  trigger: boolean;
}) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!trigger) return;
    let raf: number;
    const start = performance.now();
    const animate = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [trigger, target, duration]);

  return (
    <>
      {value}
      {suffix}
    </>
  );
}

export default function Stats() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });

  return (
    <section className="bg-[#050B17] border-t border-white/5">
      <div ref={ref} className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12">
        <div className="flex flex-col sm:flex-row items-center justify-around gap-6 sm:gap-3">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className="flex items-baseline gap-3 sm:gap-4 relative"
            >
              {i > 0 && (
                <div className="hidden sm:block absolute -left-8 lg:-left-16 top-1/2 -translate-y-1/2 h-12 w-px bg-gradient-to-b from-transparent via-gold-400/40 to-transparent" />
              )}
              <p className="font-display text-white text-5xl sm:text-6xl lg:text-7xl tracking-tighter tabular-nums leading-none">
                {stat.numericTarget !== null ? (
                  <CountUp target={stat.numericTarget} suffix={stat.suffix} trigger={inView} />
                ) : (
                  stat.value
                )}
              </p>
              <p className="text-white/40 text-[11px] sm:text-xs font-medium tracking-[0.2em] uppercase">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
