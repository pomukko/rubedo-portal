import React from 'react';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-20 bg-[#030305] relative z-10 text-xs font-mono text-[#52525b]">
      <div className="max-w-7xl mx-auto px-8 sm:px-12 flex flex-col sm:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-4">
          <div className="w-2.5 h-2.5 bg-[#8f121d]"></div>
          <span className="font-serif text-lg text-white tracking-[0.2em]">RUBEDO</span>
          <span className="text-[10px] tracking-widest border-l border-white/10 pl-4">OFFICIAL CREATIVE ARCHIVE</span>
        </div>
        <div className="tracking-widest text-[10px]">&copy; 2026 RUBEDO BY NUMEN & MUMEN. ALL RIGHTS RESERVED.</div>
      </div>
    </footer>
  );
}
