import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Section {
  heading: string;
  body: string;
}

interface LegalPageProps {
  title: string;
  lastUpdated: string;
  sections: Section[];
}

export default function LegalPage({ title, lastUpdated, sections }: LegalPageProps) {
  return (
    <>
      <Navbar />
      <main className="bg-[#050B17] min-h-screen">
        <section className="pt-36 pb-14 px-6 text-center relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full opacity-20 pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(212,168,83,0.18) 0%, transparent 60%)" }}
          />
          <h1 className="font-display text-white text-5xl sm:text-6xl lg:text-7xl tracking-tighter leading-[0.95] relative">
            {title}.
          </h1>
          <p className="text-white/40 text-xs mt-4 tracking-widest uppercase relative">Last updated: {lastUpdated}</p>
        </section>

        <section className="px-6 pb-20">
          <div className="max-w-3xl mx-auto glass-strong rounded-3xl p-8 sm:p-12">
            {sections.map((s) => (
              <div key={s.heading} className="mb-10 last:mb-0">
                <h2 className="font-display text-white text-2xl sm:text-3xl tracking-tight mb-3">
                  {s.heading}
                </h2>
                <p className="text-white/55 text-sm leading-relaxed whitespace-pre-line">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
