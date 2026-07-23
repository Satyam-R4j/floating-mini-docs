import React, { useRef } from "react";
import { motion } from "motion/react";
import {
  LuSparkles,
  LuMove,
  LuUpload,
  LuDatabase,
  LuPalette,
  LuSearch,
  LuZap,
  LuShieldCheck,
  LuArrowRight,
  LuCheck,
  LuLayers,
  LuStar,
  LuFileText,
  LuDownload,
  LuLock
} from "react-icons/lu";

const FEATURES = [
  {
    icon: LuMove,
    title: "Physics-Driven Drag Canvas",
    desc: "Experience fluid drag-and-drop mechanics with physics boundaries, spring transitions, and interactive scale gestures.",
    badge: "Interactive",
    color: "from-emerald-500 to-teal-400"
  },
  {
    icon: LuUpload,
    title: "Local & Cloud Attachments",
    desc: "Upload PDFs, docs, images, and text files up to 10MB directly to local storage or MongoDB Atlas backend.",
    badge: "Storage",
    color: "from-blue-500 to-indigo-400"
  },
  {
    icon: LuDatabase,
    title: "MongoDB Atlas Cloud Sync",
    desc: "Secure multi-device state synchronization with JWT authentication, ensuring your workspace is always backed up.",
    badge: "Database",
    color: "from-violet-500 to-purple-400"
  },
  {
    icon: LuPalette,
    title: "Custom Tag Color Palettes",
    desc: "Customize document cards with vibrant preset action banners (Emerald, Ocean Blue, Rose, Amber, Amethyst).",
    badge: "Design",
    color: "from-rose-500 to-pink-400"
  },
  {
    icon: LuSearch,
    title: "Real-time Instant Search",
    desc: "Filter through dozens of mini-doc cards instantaneously by title, description, or custom tag text.",
    badge: "Productivity",
    color: "from-amber-500 to-yellow-400"
  },
  {
    icon: LuShieldCheck,
    title: "Enterprise Workspace Profile",
    desc: "Track total storage space, count documents, update credentials, and manage password security in one modal.",
    badge: "Security",
    color: "from-cyan-500 to-blue-400"
  }
];

const DEMO_CARDS = [
  {
    title: "React 19 Specs.pdf",
    desc: "Comprehensive breakdown of React 19 architecture, Server Components, and hook optimizations.",
    fileSize: "1.8mb",
    tagTitle: "High Priority",
    tagColor: "bg-emerald-600",
    ext: "PDF"
  },
  {
    title: "Design System Tokens",
    desc: "Tailwind CSS v4 color tokens, glassmorphism blur values, and fluid typography scale guide.",
    fileSize: ".6mb",
    tagTitle: "Completed",
    tagColor: "bg-blue-600",
    ext: "DOC"
  },
  {
    title: "MongoDB Atlas Schemas",
    desc: "Mongoose models for document cards, user auth tokens, and file metadata relationships.",
    fileSize: "1.2mb",
    tagTitle: "In Progress",
    tagColor: "bg-amber-600",
    ext: "JSON"
  }
];

function LandingPage({ onLaunchApp, onOpenAuth }) {
  const demoRef = useRef(null);

  const scrollToFeatures = () => {
    const el = document.getElementById("features-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-['Poppins'] selection:bg-emerald-500 selection:text-zinc-950 overflow-x-hidden relative">
      {/* Background Radial Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-emerald-600/15 via-teal-600/5 to-transparent blur-[120px] pointer-events-none rounded-full" />

      {/* Navigation Bar Header */}
      <header className="sticky top-3 sm:top-4 z-50 px-4 sm:px-8 max-w-7xl mx-auto transition-all">
        <div className="w-full backdrop-blur-xl bg-zinc-950/80 border border-zinc-800/80 rounded-2xl sm:rounded-3xl shadow-2xl px-4 sm:px-7 py-2.5 sm:py-3 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <img src="/logo.png" alt="Doddle Docs Logo" className="h-12 sm:h-16 w-auto object-contain drop-shadow-md" />
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-100 hidden xs:inline">
              Doddle<span className="text-emerald-400">Docs</span>
            </span>
          </div>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-zinc-400">
            <a href="#features-section" className="hover:text-emerald-400 transition-colors">Features</a>
            <a href="#demo-section" className="hover:text-emerald-400 transition-colors">Live Preview</a>
            <a href="#tech-section" className="hover:text-emerald-400 transition-colors">Architecture</a>
            <a href="#testimonials-section" className="hover:text-emerald-400 transition-colors">Reviews</a>
          </nav>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenAuth}
              className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-300 hover:text-white hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-all cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={onLaunchApp}
              className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/40 hover:shadow-emerald-600/20 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
            >
              <span>Launch App</span>
              <LuArrowRight size="1.1em" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 pb-16 sm:pb-28 px-4 sm:px-8 max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6 max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-wide shadow-inner">
            <LuSparkles className="animate-spin text-emerald-400" size="1.1em" />
            <span>Next-Gen Floating Workspace Canvas</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.1] text-zinc-100">
            Organize Docs With <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Fluid Motion & Intelligence
            </span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed font-medium">
            Doddle Docs replaces rigid note tables with a physics-driven, drag-and-drop floating mini-doc canvas. Store notes, attach files, and sync instantly to the cloud.
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={onLaunchApp}
              className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-zinc-950 font-extrabold text-sm shadow-xl shadow-emerald-950/50 hover:shadow-emerald-500/25 active:scale-[0.98] transition-all cursor-pointer flex items-center gap-2.5"
            >
              <span>Get Started Free</span>
              <LuArrowRight size="1.2em" />
            </button>
            <button
              onClick={scrollToFeatures}
              className="px-7 py-3.5 rounded-2xl bg-zinc-900/80 hover:bg-zinc-900 text-zinc-200 border border-zinc-800/80 hover:border-zinc-700 font-bold text-sm transition-all cursor-pointer flex items-center gap-2"
            >
              <span>Explore Features</span>
              <LuZap size="1.1em" className="text-amber-400" />
            </button>
          </div>

          {/* Key Value Pill Tags */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-zinc-400 font-medium">
            <div className="flex items-center gap-2">
              <LuCheck className="text-emerald-400" size="1.1em" />
              <span>MongoDB Atlas Backed</span>
            </div>
            <div className="flex items-center gap-2">
              <LuCheck className="text-emerald-400" size="1.1em" />
              <span>JWT Authentication</span>
            </div>
            <div className="flex items-center gap-2">
              <LuCheck className="text-emerald-400" size="1.1em" />
              <span>Drag & Drop Physics</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Live Interactive Sandbox Preview Section */}
      <section id="demo-section" className="py-16 sm:py-24 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-10 space-y-3">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Interactive <span className="text-emerald-400">Live Preview</span> Canvas
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto">
            Try dragging the cards below! Experience spring physics, boundary collision, and fluid card transitions in real-time.
          </p>
        </div>

        {/* Interactive Drag Canvas Box */}
        <div
          ref={demoRef}
          className="relative w-full h-[460px] sm:h-[520px] rounded-[32px] sm:rounded-[40px] bg-zinc-900/40 border border-zinc-800/80 backdrop-blur-xl p-4 overflow-hidden shadow-2xl flex flex-col justify-between"
        >
          {/* Subtle grid pattern watermark */}
          <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:24px_24px] opacity-30 pointer-events-none" />

          {/* Floating Instruction Banner */}
          <div className="relative z-10 mx-auto bg-zinc-950/80 border border-zinc-800 px-5 py-2 rounded-full text-xs font-semibold text-zinc-400 flex items-center gap-2 select-none shadow-md">
            <LuMove className="text-emerald-400 animate-bounce" size="1.1em" />
            <span>Interactive Sandbox • Drag cards anywhere inside this frame</span>
          </div>

          {/* Cards Playground */}
          <div className="relative z-10 flex-1 w-full h-full flex flex-wrap gap-4 p-2 sm:p-6 justify-center items-center overflow-hidden">
            {DEMO_CARDS.map((card, idx) => (
              <motion.div
                key={idx}
                drag
                dragConstraints={demoRef}
                whileDrag={{ scale: 1.06, boxShadow: "0 25px 30px -5px rgba(0, 0, 0, 0.7)" }}
                dragElastic={0.15}
                className="w-56 h-64 sm:w-64 sm:h-72 rounded-[32px] bg-zinc-950/90 border border-zinc-800/90 p-5 flex flex-col justify-between cursor-pointer select-none shadow-xl hover:border-emerald-500/50 transition-colors"
              >
                <div>
                  <div className="flex justify-between items-center text-zinc-400 mb-3">
                    <LuFileText size="1.2em" />
                    <span className="text-[9px] font-black bg-zinc-900 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-md tracking-wider">
                      {card.ext}
                    </span>
                  </div>
                  <h4 className="text-sm font-extrabold text-zinc-100 mb-2 line-clamp-1">
                    {card.title}
                  </h4>
                  <p className="text-xs text-zinc-400 leading-relaxed line-clamp-4 font-medium">
                    {card.desc}
                  </p>
                </div>

                <div className="-mx-5 -mb-5 rounded-b-[32px] overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-3 bg-zinc-900/60">
                    <span className="text-[11px] font-medium text-zinc-400">{card.fileSize}</span>
                    <span className="w-7 h-7 rounded-full bg-emerald-600/20 flex items-center justify-center text-emerald-400">
                      <LuDownload size="0.9em" />
                    </span>
                  </div>
                  <div className={`w-full py-2.5 ${card.tagColor} text-center`}>
                    <span className="text-[10px] font-bold text-white uppercase tracking-wider">{card.tagTitle}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="relative z-10 text-center pb-2 text-[11px] font-semibold text-zinc-500 select-none">
            🚀 Full workspace supports unlimited documents, file uploads & cloud persistence.
          </div>
        </div>
      </section>

      {/* Bento Grid Features Section */}
      <section id="features-section" className="py-16 sm:py-28 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-bold text-emerald-400">
            <LuLayers size="1.1em" />
            <span>Power Packed Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Designed For Modern <span className="text-emerald-400">Workflows</span>
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto">
            Everything you need to capture, organize, and manage micro-documentation smoothly.
          </p>
        </div>

        {/* Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {FEATURES.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -6 }}
                className="group relative rounded-[28px] sm:rounded-[32px] bg-zinc-900/40 border border-zinc-800/80 hover:border-zinc-700/80 p-6 sm:p-8 backdrop-blur-lg flex flex-col justify-between transition-all duration-300 shadow-lg"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`p-3.5 rounded-2xl bg-gradient-to-tr ${feat.color} text-zinc-950 shadow-md`}>
                      <Icon size="1.4em" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 bg-zinc-800/80 px-2.5 py-1 rounded-full border border-zinc-700/50">
                      {feat.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-zinc-100 group-hover:text-emerald-400 transition-colors">
                    {feat.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-medium">
                    {feat.desc}
                  </p>
                </div>

                <div className="pt-6 mt-4 border-t border-zinc-800/40 flex items-center justify-between text-xs font-semibold text-emerald-400 opacity-90 group-hover:opacity-100">
                  <span>Learn capabilities</span>
                  <LuArrowRight className="transition-transform group-hover:translate-x-1" size="1.1em" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Tech Architecture & Cloud Security Section */}
      <section id="tech-section" className="py-16 sm:py-24 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="rounded-[36px] sm:rounded-[48px] bg-gradient-to-b from-zinc-900/90 to-zinc-950/90 border border-zinc-800 p-8 sm:p-14 relative overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                <LuLock size="1.1em" />
                <span>Production Grade Security</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                Built On Robust <br />
                <span className="text-emerald-400">Full-Stack Cloud Architecture</span>
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-medium">
                Doddle Docs connects a Vite + React 19 frontend to an Express + Node.js backend. User documents and authentication credentials are encrypted and stored inside MongoDB Atlas cloud.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-xs text-zinc-300 font-semibold">
                  <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400"><LuCheck size="1.1em" /></span>
                  <span>JWT Auth with Bearer token header validation</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-zinc-300 font-semibold">
                  <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400"><LuCheck size="1.1em" /></span>
                  <span>Multer disk storage with automatic file size calculations</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-zinc-300 font-semibold">
                  <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400"><LuCheck size="1.1em" /></span>
                  <span>Mongoose schemas with auto-seeding default cards</span>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={onLaunchApp}
                  className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold shadow-lg shadow-emerald-950/50 transition-all cursor-pointer flex items-center gap-2"
                >
                  <span>Launch Workspace</span>
                  <LuArrowRight size="1.1em" />
                </button>
              </div>
            </div>

            {/* Architecture Card Graphic */}
            <div className="bg-zinc-950/80 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-900">
                <span className="text-xs font-bold text-zinc-400">System Stack</span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-md border border-emerald-800/40">ONLINE</span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/60">
                  <span className="font-semibold text-zinc-300">Frontend Layer</span>
                  <span className="text-emerald-400 font-bold">React 19 + Vite + Motion</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/60">
                  <span className="font-semibold text-zinc-300">API Gateway</span>
                  <span className="text-teal-400 font-bold">Express 4.19 + Router</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/60">
                  <span className="font-semibold text-zinc-300">Cloud Database</span>
                  <span className="text-indigo-400 font-bold">MongoDB Atlas Cluster</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/60">
                  <span className="font-semibold text-zinc-300">File Storage</span>
                  <span className="text-amber-400 font-bold">Multer Local Engine</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials-section" className="py-16 sm:py-24 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Loved By <span className="text-emerald-400">Developers & Creators</span>
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto">
            See how teams use Doddle Docs to streamline their daily micro-notes and document organization.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-zinc-900/30 border border-zinc-800/80 space-y-4">
            <div className="flex text-amber-400 gap-1">
              {[...Array(5)].map((_, i) => (
                <LuStar key={i} size="1.1em" />
              ))}
            </div>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-medium">
              "The drag and drop fluid motion is ridiculously smooth! It makes organizing code snippets and sprint guidelines feel like a game."
            </p>
            <div className="pt-2 border-t border-zinc-800/50">
              <h5 className="text-xs font-bold text-zinc-100">Alex Rivera</h5>
              <span className="text-[10px] text-zinc-500 font-medium">Senior Frontend Engineer</span>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-zinc-900/30 border border-zinc-800/80 space-y-4">
            <div className="flex text-amber-400 gap-1">
              {[...Array(5)].map((_, i) => (
                <LuStar key={i} size="1.1em" />
              ))}
            </div>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-medium">
              "Uploading file attachments and viewing document specs directly from floating cards saves us so much tab-switching hassle."
            </p>
            <div className="pt-2 border-t border-zinc-800/50">
              <h5 className="text-xs font-bold text-zinc-100">Sophia Lin</h5>
              <span className="text-[10px] text-zinc-500 font-medium">Product Designer</span>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-zinc-900/30 border border-zinc-800/80 space-y-4">
            <div className="flex text-amber-400 gap-1">
              {[...Array(5)].map((_, i) => (
                <LuStar key={i} size="1.1em" />
              ))}
            </div>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-medium">
              "Having MongoDB Atlas cloud sync with JWT authentication built right in makes this the perfect personal micro-doc workspace."
            </p>
            <div className="pt-2 border-t border-zinc-800/50">
              <h5 className="text-xs font-bold text-zinc-100">Marcus Vance</h5>
              <span className="text-[10px] text-zinc-500 font-medium">Full Stack Architect</span>
            </div>
          </div>
        </div>
      </section>

      {/* Call To Action Banner */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="rounded-[36px] sm:rounded-[48px] bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 p-8 sm:p-16 text-center space-y-6 text-zinc-950 relative overflow-hidden shadow-2xl">
          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              Ready To Elevate Your Workspace?
            </h2>
            <p className="text-xs sm:text-base font-semibold text-emerald-100/90 leading-relaxed">
              Start creating floating micro-doc cards in seconds with real-time cloud synchronization.
            </p>
            <div className="pt-4">
              <button
                onClick={onLaunchApp}
                className="px-8 py-4 rounded-2xl bg-zinc-950 hover:bg-zinc-900 text-white font-extrabold text-sm shadow-2xl transition-all cursor-pointer inline-flex items-center gap-3 active:scale-95"
              >
                <span>Launch Free App</span>
                <LuArrowRight size="1.2em" className="text-emerald-400" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-10 px-4 sm:px-8 bg-zinc-950/80 text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Doddle Docs Logo" className="h-8 w-auto object-contain" />
            <span className="font-bold text-zinc-300 text-sm">Doddle Docs</span>
          </div>

          <div className="flex flex-wrap gap-6 font-medium">
            <a href="#features-section" className="hover:text-zinc-300 transition-colors">Features</a>
            <a href="#demo-section" className="hover:text-zinc-300 transition-colors">Interactive Demo</a>
            <a href="#tech-section" className="hover:text-zinc-300 transition-colors">Tech Stack</a>
          </div>

          <p>© {new Date().getFullYear()} Doddle Docs. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
