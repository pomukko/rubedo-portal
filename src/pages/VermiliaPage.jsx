import React from 'react';
import { ArrowLeft, Box, ArrowUpRight } from 'lucide-react';
import { vermiliaAngles } from '../config/siteConfig';

export default function VermiliaPage({ navigateTo, selectedAngle, setSelectedAngle, LINKS }) {
  const currentAngleObj = vermiliaAngles.find(a => a.id === selectedAngle);
  
  return (
    <div className="pt-36 pb-32 max-w-7xl mx-auto px-8 sm:px-12 space-y-16 animate-fadeIn">
      <div className="flex justify-between items-center border-b border-white/10 pb-6">
        <button onClick={() => navigateTo('home')} className="text-xs font-mono text-[#a1a1aa] hover:text-white flex items-center gap-2 transition-colors tracking-widest">
          <ArrowLeft className="w-4 h-4 text-[#8f121d]" /> BACK TO PORTAL
        </button>
        <span className="text-[10px] font-mono text-[#d4b07b] tracking-[0.3em] uppercase">VERMILIA SPECIAL PAGE</span>
      </div>
      <h1 className="font-serif text-5xl sm:text-7xl text-white">VERMILIA</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
        <div className="lg:col-span-8 bg-[#030305] border border-white/10 p-8 sm:p-12 space-y-8">
          <div className="aspect-[16/10] bg-[#07070a] border border-white/5 relative overflow-hidden flex items-center justify-center p-12">
            <div className="text-center space-y-6 max-w-md mx-auto">
              <div className="w-32 h-32 mx-auto border border-[#8f121d]/40 bg-[#8f121d]/10 backdrop-blur-md flex items-center justify-center shadow-[0_0_70px_rgba(143,18,29,0.25)]">
                <Box className="w-16 h-16 text-[#d4b07b]" />
              </div>
              <div className="text-sm font-mono tracking-[0.35em] text-white uppercase">{currentAngleObj?.title}</div>
              <p className="text-xs text-[#a1a1aa] font-light leading-[1.9] pt-4 border-t border-white/10">{currentAngleObj?.desc}</p>
            </div>
          </div>
        </div>
        <div className="lg:col-span-4 bg-[#030305] border border-white/10 p-10 sm:p-12 flex flex-col justify-between space-y-10">
          <div className="space-y-6">
            <h3 className="font-serif text-2xl text-white border-b border-white/10 pb-6">光と深紅の交錯</h3>
            <p className="text-xs sm:text-sm text-[#a1a1aa] leading-[2.1] font-light">
              空間に置いたその瞬間、空気のトーンが変わるかのような、凛とした余韻と存在感。細部をミリ単位でチュニングした輪郭が、所有の充足感を深く満たします。
            </p>
          </div>
          <a href={LINKS.vermiliaItem} target="_blank" rel="noreferrer" className="w-full bg-[#8f121d] text-white text-xs font-mono tracking-[0.3em] py-5 text-center transition-all flex items-center justify-center gap-3 hover:bg-[#a31625]">
            ACQUIRE ON BOOTH <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
