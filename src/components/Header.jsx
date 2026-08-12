import React from 'react';
import { Volume2, VolumeX, ArrowUpRight, Menu, X } from 'lucide-react';

export default function Header({
  currentPage,
  navigateTo,
  isMenuOpen,
  setIsMenuOpen,
  scrolled,
  isMuted,
  setIsMuted,
  CONFIG
}) {
  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ${
      scrolled ? 'bg-[#040406]/90 backdrop-blur-2xl border-b border-white/10 py-5' : 'py-10'
    }`}>
      <div className="max-w-7xl mx-auto px-8 sm:px-12 flex justify-between items-center relative z-50">
        
        {/* LOGO & VOOTH LINK */}
        <div className="flex items-center gap-8">
          <button onClick={() => navigateTo('home')} className="flex items-center gap-4 group text-left cursor-pointer">
            <div className="w-2.5 h-2.5 bg-[#8f121d] transition-transform duration-500 group-hover:scale-125 group-hover:bg-[#a81625] shadow-[0_0_14px_rgba(143,18,29,0.9)]"></div>
            <span className="font-serif tracking-[0.4em] text-xl font-medium text-white group-hover:text-[#d4b07b] transition-colors">RUBEDO</span>
          </button>

          {/* 🌟 VOOTH 展覧会ページへの遷移ボタン */}
          <button 
            onClick={() => navigateTo('vooth')} 
            className={`text-xs font-mono tracking-widest transition-colors cursor-pointer border-l border-white/10 pl-6 ${
              currentPage === 'vooth' ? 'text-[#8f121d] font-bold' : 'text-[#a1a1aa] hover:text-white'
            }`}
          >
            VOOTH
          </button>
        </div>

        {/* RIGHT CONTROLS */}
        <div className="flex items-center gap-6">
          <button onClick={() => setIsMuted(!isMuted)} className="p-2 text-[#71717a] hover:text-white transition-colors hidden sm:flex items-center gap-2 text-[10px] font-mono tracking-widest cursor-pointer">
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-[#8f121d]" /> : <Volume2 className="w-3.5 h-3.5 text-[#8f121d]" />}
            <span className="uppercase">{isMuted ? 'SOUND OFF' : 'SOUND ON'}</span>
          </button>

          <a href={CONFIG.LINKS.boothStore} target="_blank" rel="noreferrer" className="text-[10px] tracking-[0.3em] font-mono text-[#d4b07b] border border-[#d4b07b]/30 bg-[#d4b07b]/[0.02] px-5 py-2.5 hover:bg-[#d4b07b]/15 transition-all flex items-center gap-2">
            BOOTH <ArrowUpRight className="w-3 h-3" />
          </a>

          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={`p-2.5 border transition-all flex items-center gap-2 font-mono text-xs cursor-pointer ${isMenuOpen ? 'border-[#8f121d] text-white bg-[#8f121d]/20' : 'border-white/10 text-[#71717a] hover:border-white/30 hover:text-white'}`}>
            {isMenuOpen ? <X className="w-5 h-5 text-[#8f121d]" /> : <Menu className="w-5 h-5" />}
            <span className="hidden sm:inline text-[10px] tracking-widest text-[#a1a1aa]">{isMenuOpen ? 'CLOSE' : 'MENU'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
