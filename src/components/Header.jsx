import React from 'react';
import { Volume2, VolumeX, ArrowUpRight, Menu, X, ChevronRight } from 'lucide-react';

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
  const navItems = [
    { id: 'home', label: '01 / HOME', desc: 'ポータル トップ' },
    { id: 'vermilia', label: '02 / VERMILIA', desc: 'フラッグシップ 3Dモデル' },
    { id: 'journal', label: '03 / JOURNAL', desc: '開発ログ & How-To' },
    { id: 'vooth', label: '04 / VOOTH EXHIBITION', desc: 'コンセプト 3D展覧会ホール' },
    { id: 'founders', label: '05 / FOUNDERS', desc: 'Numen & MUMEN について' },
    { id: 'archives', label: '06 / ARCHIVES', desc: 'アセット・マテリアル統合アーカイブ' }
  ];

  return (
    <>
      {/* HEADER BAR */}
      <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ${
        scrolled ? 'bg-[#040406]/90 backdrop-blur-2xl border-b border-white/10 py-5' : 'py-10'
      }`}>
        <div className="max-w-7xl mx-auto px-8 sm:px-12 flex justify-between items-center relative z-50">
          
          {/* RUBEDO LOGO */}
          <button onClick={() => navigateTo('home')} className="flex items-center gap-4 group text-left cursor-pointer">
            <div className="w-2.5 h-2.5 bg-[#8f121d] transition-transform duration-500 group-hover:scale-125 group-hover:bg-[#a81625] shadow-[0_0_14px_rgba(143,18,29,0.9)]"></div>
            <span className="font-serif tracking-[0.4em] text-xl font-medium text-white group-hover:text-[#d4b07b] transition-colors">RUBEDO</span>
          </button>

          {/* RIGHT CONTROLS */}
          <div className="flex items-center gap-6">
            {/* SOUND TOGGLE */}
            <button onClick={() => setIsMuted(!isMuted)} className="p-2 text-[#71717a] hover:text-white transition-colors hidden sm:flex items-center gap-2 text-[10px] font-mono tracking-widest cursor-pointer">
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-[#8f121d]" /> : <Volume2 className="w-3.5 h-3.5 text-[#8f121d]" />}
              <span className="uppercase">{isMuted ? 'SOUND OFF' : 'SOUND ON'}</span>
            </button>

            {/* BOOTH STORE LINK */}
            <a href={CONFIG?.LINKS?.boothStore || '#'} target="_blank" rel="noreferrer" className="text-[10px] tracking-[0.3em] font-mono text-[#d4b07b] border border-[#d4b07b]/30 bg-[#d4b07b]/[0.02] px-5 py-2.5 hover:bg-[#d4b07b]/15 transition-all flex items-center gap-2">
              BOOTH <ArrowUpRight className="w-3 h-3" />
            </a>

            {/* MENU BUTTON */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className={`p-2.5 border transition-all flex items-center gap-2 font-mono text-xs cursor-pointer ${
                isMenuOpen ? 'border-[#8f121d] text-white bg-[#8f121d]/20' : 'border-white/10 text-[#71717a] hover:border-white/30 hover:text-white'
              }`}
            >
              {isMenuOpen ? <X className="w-5 h-5 text-[#8f121d]" /> : <Menu className="w-5 h-5" />}
              <span className="hidden sm:inline text-[10px] tracking-widest text-[#a1a1aa]">{isMenuOpen ? 'CLOSE' : 'MENU'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* 🌟 OVERLAY MENU（縦スクロール最優先 ＆ すり抜け防止適用） */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-[#040406]/98 z-40 backdrop-blur-3xl flex flex-col justify-between p-6 sm:p-16 animate-fadeIn overflow-y-auto overscroll-contain">
          <div className="pt-24 pb-8 max-w-4xl mx-auto w-full space-y-8 flex-1 flex flex-col justify-center">
            <span className="text-[10px] font-mono tracking-[0.4em] text-[#8f121d] uppercase block">NAVIGATION INDEX</span>
            <div className="space-y-3 sm:space-y-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigateTo(item.id)}
                  className="w-full text-left py-3 sm:py-4 border-b border-white/5 group flex items-center justify-between hover:border-[#8f121d] transition-all cursor-pointer"
                >
                  <div className="space-y-1">
                    <div className={`font-serif text-xl sm:text-3xl lg:text-4xl transition-colors ${
                      currentPage === item.id ? 'text-[#d4b07b]' : 'text-white group-hover:text-[#d4b07b]'
                    }`}>
                      {item.label}
                    </div>
                    <div className="font-mono text-[11px] sm:text-xs text-[#71717a]">{item.desc}</div>
                  </div>
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-[#71717a] group-hover:text-[#8f121d] group-hover:translate-x-2 transition-all flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>

          <div className="max-w-4xl mx-auto w-full pt-6 pb-2 border-t border-white/10 flex justify-between items-center font-mono text-[10px] text-[#71717a] flex-shrink-0">
            <span>RUBEDO CREATIVE PORTAL</span>
            <span>© 2026 RUBEDO</span>
          </div>
        </div>
      )}
    </>
  );
}
