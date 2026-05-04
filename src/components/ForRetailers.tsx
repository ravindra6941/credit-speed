"use client";
import { motion } from "framer-motion";

const benefits = [
  {
    title: "30–40% more sales",
    description: "Customers who couldn't pay upfront now buy on EMI.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
      </svg>
    ),
  },
  {
    title: "Live dashboard",
    description: "Track loans, commissions, approvals — one panel.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
  },
  {
    title: "Same-day activation",
    description: "Submit in the morning, sell EMI by afternoon.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
  },
  {
    title: "All brands",
    description: "Samsung, iPhone, Vivo, Oppo, Realme, Xiaomi, OnePlus.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3" />
      </svg>
    ),
  },
  {
    title: "Marketing kit",
    description: "Posters, standees, digital assets — branded for you.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395" />
      </svg>
    ),
  },
  {
    title: "Earn on every sale",
    description: "Competitive commissions. Sell more, earn more.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 8.25H9m6 3H9m3 6l-3-3h1.5a3 3 0 100-6M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

export default function ForRetailers() {
  return (
    <section id="retailers" className="bg-[#050B17] py-24 lg:py-32 relative overflow-hidden">
      {/* ambient gold glow */}
      <div className="absolute -right-40 top-1/3 w-[700px] h-[700px] rounded-full opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(212,168,83,0.18) 0%, transparent 60%)" }}
      />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5"
          >
            <p className="text-gold-400/80 text-xs font-medium tracking-[0.25em] uppercase mb-4">
              For Retailers
            </p>
            <h2 className="font-display text-white text-5xl sm:text-6xl lg:text-7xl tracking-tighter leading-[0.95] mb-6">
              Sell more.<br />
              <span className="bg-gradient-to-r from-gold-400 to-gold-200 bg-clip-text text-transparent">Earn more.</span>
            </h2>
            <p className="text-white/50 mb-10 max-w-md">
              Join the Credit Speed retailer network. Customers get EMI. You get commissions.
            </p>

            <div className="glass-strong rounded-2xl p-6">
              <p className="text-gold-400 text-[10px] font-semibold tracking-[0.25em] uppercase mb-5">
                Get Started in 3 Steps
              </p>
              <div className="space-y-5">
                {[
                  { step: "1", title: "Submit Documents", desc: "GST, cancelled cheque, bank statement" },
                  { step: "2", title: "Verify Identity", desc: "Aadhaar & PAN — fully digital" },
                  { step: "3", title: "Start Financing", desc: "Get Merchant ID, start offering EMI" },
                ].map((s) => (
                  <div key={s.step} className="flex gap-4">
                    <div className="w-8 h-8 bg-gold-400/15 border border-gold-400/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-gold-400 text-sm font-bold">{s.step}</span>
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{s.title}</p>
                      <p className="text-white/40 text-xs mt-0.5">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <a
                href="/partner"
                className="mt-7 block w-full bg-white hover:bg-gold-200 text-navy-500 py-3 rounded-full font-semibold text-sm text-center transition"
              >
                Become a Partner
              </a>
            </div>
          </motion.div>

          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-4">
            {benefits.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                whileHover={{ y: -3 }}
                className="glass rounded-2xl p-6 hover:border-gold-400/25 transition-colors"
              >
                <div className="w-10 h-10 bg-gold-400/10 border border-gold-400/15 rounded-xl flex items-center justify-center text-gold-400 mb-5">
                  {item.icon}
                </div>
                <h3 className="text-white font-display text-lg tracking-tight mb-1.5">
                  {item.title}
                </h3>
                <p className="text-white/45 text-sm leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
