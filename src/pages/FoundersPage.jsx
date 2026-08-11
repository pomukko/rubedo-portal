import React from 'react';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';

export default function FoundersPage({ navigateTo, LINKS }) {
  return (
    <div className="pt-36 pb-32 max-w-7xl mx-auto px-8 sm:px-12 space-y-20 animate-fadeIn">
      <div className="flex justify-between items-center border-b border-white/10 pb-6">
        <button onClick={() => navigateTo('home')} className="text-xs font-mono text-[#a1a1aa] hover:text-white flex items-center gap-2 transition-colors tracking-widest">
          <ArrowLeft className="w-4 h-4 text-[#8f121d]" /> BACK TO PORTAL
        </button>
        <span className="text-[10px] font-mono text-[#d4b07b] tracking-[0.3em] uppercase">FOUNDERS PROFILE</span>
      </div>
      <h1 className="font-serif text-5xl sm:text-7xl text-white">Numen & MUMEN</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="bg-[#030305] border border-white/10 p-12 space-y-6">
          <h2 className="font-serif text-4xl text-white">Numen</h2>
          <p className="text-xs sm:text-sm text-[#a1a1aa] leading-[2.1] font-light">3D造形およびシェーディング・アルゴリズムを担当。現実における物質の質感・光の減衰をデジタル空間で再現し、「触れそうな質感」の極限を追求する。</p>
          <a href={LINKS.numenX} target="_blank" rel="noreferrer" className="text-xs font-mono text-[#71717a] hover:text-white flex items-center gap-1.5">X (@Numen_rubedovrc) <ArrowUpRight className="w-3.5 h-3.5" /></a>
        </div>
        <div className="bg-[#030305] border border-white/10 p-12 space-y-6">
          <h2 className="font-serif text-4xl text-white">MUMEN</h2>
          <p className="text-xs sm:text-sm text-[#a1a1aa] leading-[2.1] font-light">アートディレクションおよびアクセサリ・ビジュアル設計を担当。古典建築やグラフィックの文脈をアセットに注ぎ込み、世界観に圧倒的な深みを与える。</p>
          <a href={LINKS.mumenX} target="_blank" rel="noreferrer" className="text-xs font-mono text-[#71717a] hover:text-white flex items-center gap-1.5">X (@__MUMEN) <ArrowUpRight className="w-3.5 h-3.5" /></a>
        </div>
      </div>
    </div>
  );
}
