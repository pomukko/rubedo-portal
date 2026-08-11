import React from 'react';
import { Volume2, VolumeX, ArrowUpRight, Menu, X, ChevronRight } from 'lucide-react';
import { menuNavItems } from '../config/siteConfig';

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
        <button onClick={() => navigateTo('home')} className="flex items-center gap-4 group text-left">
          <div className="w-2.5 h-2.5 bg-[#8f121d] transition-transform duration-500 group-hover:scale-125 group-hover:bg-[#a81625] shadow-[0_0_14px_rgba(143,18,29,0.9)]"></div>
          <span className="font-serif tracking-[0.4em] text-xl font-medium text-white group-hover:text-[#d4b07b] transition-colors">RUBEDO</span>
        </button>

        <div className="flex items-center gap-6">
          <button onClick={() => setIsMuted(!isMuted)} className="p-2 text-[#71717a] hover:text-white transition-colors hidden sm:flex items-center gap-2 text-[10px] font-mono tracking-widest">
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-[#8f121d]" />}
            <span className="uppercase">{isMuted ? 'SOUND OFF' : 'SOUND ON'}</span>
          </button>
          <a href={CONFIG.LINKS.boothStore} target="_blank" rel="noreferrer" className="text-[10px] tracking-[0.3em] font-mono text-[#d4b07b] border border-[#d4b07b]/30 bg-[#d4b07b]/[0.02] px-5 py-2.5 hover:bg-[#d4b07b]/15 transition-all flex items-center gap-2">
            BOOTH <ArrowUpRight className="w-3 h-3" />
          </a>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={`p-2.5 border transition-all flex items-center gap-2 font-mono text-xs ${isMenuOpen ? 'border-[#8f121d] text-white bg-[#8f121d]/20' : 'border-white/10 hover:border-white/30 text-white'}`}>
            {isMenuOpen ? <X className="w-5 h-5 text-[#8f121d]" /> : <Menu className="w-5 h-5" />}
            <span className="hidden sm:inline text-[10px] tracking-widest text-[#a1a1aa]">{isMenuOpen ? 'CLOSE' : 'MENU'}</span>
          </button>
        </div>
      </div>

      {/* OVERLAY MENU DRAWER */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-[#040406] z-40 p-6 sm:p-12 lg:p-16 pt-28 sm:pt-36 flex flex-col justify-between overflow-y-auto min-h-screen">
          <div className="max-w-4xl mx-auto w-full space-y-8 my-auto py-6">
            <div className="flex justify-between items-center text-[10px] font-mono text-[#71717a] tracking-[0.3em] border-b border-white/10 pb-4">
              <span>SELECT NAVIGATION ARCHIVE</span>
              <span className="text-[#8f121d]">5 DESTINATIONS</span>
            </div>
            <nav className="grid grid-cols-1 gap-4">
              {menuNavItems.map((item) => (
                <button key={item.id} onClick={() => navigateTo(item.id)} className={`w-full text-left p-6 sm:p-8 border transition-all duration-300 flex items-center justify-between group relative overflow-hidden ${currentPage === item.id ? 'border-[#8f121d] bg-[#8f121d]/[0.12] text-white shadow-[inset_4px_0_0_#8f121d]' : 'border-white/10 bg-[#07070a] hover:border-white/30 hover:bg-white/[0.04] text-[#a1a1aa]'}`}>
                  <div className="flex items-start sm:items-center gap-6 z-10">
                    <span className={`font-mono text-xs sm:text-sm font-semibold tracking-widest ${currentPage === item.id ? 'text-[#8f121d]' : 'text-[#71717a] group-hover:text-white'}`}>{item.num}</span>
                    <div>
                      <div className="flex items-center gap-3">
                        <h2 className="font-serif text-lg sm:text-2xl font-medium tracking-[0.2em] text-[#e2e2e8] group-hover:text-white">{item.title}</h2>
                        {currentPage === item.id && <span className="inline-flex items-center gap-1 text-[9px] font-mono tracking-widest text-[#d4b07b] bg-[#d4b07b]/10 border border-[#d4b07b]/30 px-2 py-0.5">CURRENT</span>}
                      </div>
                      <p className="text-xs font-sans text-[#71717a] group-hover:text-[#a1a1aa] font-light leading-relaxed">{item.subtitle}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#52525b] group-hover:text-white group-hover:translate-x-2 transition-all" />
                </button>
              ))}
            </nav>
          </div>
          <div className="max-w-4xl mx-auto w-full pt-8 border-t border-white/10 font-mono text-[10px] text-[#52525b] tracking-widest flex justify-between items-center">
            <span>RUBEDO CREATIVE ARCHIVE &copy; 2026</span>
            <span className="text-[#8f121d]">FOUNDED BY NUMEN & MUMEN</span>
          </div>
        </div>
      )}
    </header>
  );
}
