import React from 'react';
import { motion } from 'framer-motion';
import { Sun } from 'lucide-react';
import Cityscape from './Cityscape';

const navItems = ['Home', 'Services', 'About Us', 'Contact Us'];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15 + 0.2, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

export default function Overlay() {
  return (
    <div className="w-full h-full flex flex-col pointer-events-none select-none">
      {/* ── Navigation Bar ── */}
      <nav className="relative z-10 flex justify-center w-full p-6 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="
            pointer-events-auto flex items-center justify-evenly w-full max-w-3xl
          "
        >
          {navItems.map((item) => (
            <button
              key={item}
              className="
                font-edu text-sm font-semibold text-[#382B25]
                px-3 py-1.5
                hover:opacity-60 transition-opacity duration-200
                whitespace-nowrap
              "
            >
              {item}
            </button>
          ))}

          {/* Day/Night toggle */}
          <div className="w-px h-5 bg-[#382B25]/20 mx-2" />
          <button
            className="
              flex items-center gap-1.5 font-edu text-sm font-semibold text-[#382B25]
              px-3 py-1.5
              hover:opacity-60 transition-opacity duration-200
              pointer-events-auto
            "
            aria-label="Toggle day mode"
          >
            <Sun size={20} strokeWidth={2.5} className="text-yellow-600" />
            <span className="hidden sm:inline">Day</span>
          </button>
        </motion.div>
      </nav>

      {/* ── Hero Section ── */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pb-20">
        {/* Pill badge */}
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="
            mb-6 px-5 py-1.5 rounded-full
            backdrop-blur-sm bg-white/25 border border-white/50
            text-xs font-semibold tracking-[0.2em] uppercase
            text-[#6B5344]
          "
        >
          Bengaluru&apos;s Premier PG Finder
        </motion.div>

        {/* Main headline */}
        <motion.h1
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="
            font-oswald tracking-wide
            text-center font-bold leading-[0.95]
            text-[#382B25]
            text-5xl sm:text-6xl md:text-7xl lg:text-[7rem]
            drop-shadow-sm
            mb-4
          "
        >
          FIND THE BEST STAY
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="
            text-center font-medium tracking-[0.25em] uppercase
            text-[#594A42]
            text-sm sm:text-base md:text-lg lg:text-xl
            mb-10
          "
        >
          For Your Studies, Work &amp; Lifestyle
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row gap-4 pointer-events-auto"
        >
          <button
            className="
              px-8 py-3.5 rounded-full font-semibold text-sm tracking-wide
              bg-[#382B25] text-white
              shadow-lg hover:shadow-xl
              hover:bg-[#6B5344] transition-all duration-300
              active:scale-95
            "
          >
            Explore PGs →
          </button>
          <button
            className="
              px-8 py-3.5 rounded-full font-semibold text-sm tracking-wide
              backdrop-blur-md bg-white/30 border border-white/50
              text-[#382B25] shadow-lg
              hover:bg-white/50 transition-all duration-300
              active:scale-95
            "
          >
            Learn More
          </button>
        </motion.div>
      </div>

      {/* ── Bottom scroll hint ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="relative z-10 flex justify-center pb-8"
      >
        <div className="flex flex-col items-center gap-2 text-[#594A42]/80">
          <span className="text-xs tracking-[0.2em] uppercase font-medium">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
            className="w-5 h-8 rounded-full border-2 border-[#594A42]/50 flex items-start justify-center pt-1.5"
          >
            <div className="w-1 h-2 rounded-full bg-[#594A42]/60" />
          </motion.div>
        </div>
      </motion.div>
      <Cityscape />
    </div>
  );
}
