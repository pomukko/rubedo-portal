import React from 'react';
import { ArrowLeft, ExternalLink, ShieldCheck, BookOpen, FileText, Heart, Sparkles } from 'lucide-react';

export default function ArchivesPage({ navigateTo, LINKS }) {
  const documents = [
    { title: '共同倫理ルールブック', badge: '必読指針', icon: <ShieldCheck className="w-6 h-6 text-[#8f121d]" />, desc: '優しき人々が搾取されず、安心して息ができる空間を維持するための防衛指針。コミュニティの基礎となる重要ルールを書き記しています。', link: LINKS.ethicalRulebook },
    { title: 'プロ向け二次創作・協業ガイドライン', badge: 'クリエイター向け', icon: <BookOpen className="w-6 h-6 text-[#d4b07b]" />, desc: 'クリエイター向けの特殊な申請制コミュニティ『勇気あるアルパカ』参加のための前提ガイドライン。商業・二次創作・協業についてのルール。', link: LINKS.vermiliaGuideline },
    { title: '『勇気あるアルパカ』への入り方ガイド', badge: '参加ステップ', icon: <FileText className="w-6 h-6 text-[#d4b07b]" />, desc: '特殊な申請制コミュニティ『勇気あるアルパカ』への参加手順。二次創作ガイドラインをお読みいただいた後にご覧ください。', link: LINKS.braveryAlpaca },
    { title: '愛のあるアルパカ / 入室ガイド', badge: 'フォロワー限定', icon: <Heart className="w-6 h-6 text-[#8f121d]" />, desc: 'フォロワー向けの安全な限定コミュニティ。強制的な活動はなく、匿名のご意見箱を通じて穏やかに関われる任意の場所です。', link: LINKS.loveAlpaca },
    { title: '公式設定資料集 (WORLD EXHIBITION)', badge: '世界観資料', icon: <Sparkles className="w-6 h-6 text-[#d4b07b]" />, desc: '自由な発想で二次創作を楽しんでいただくための、世界観をさらりとまとめた資料集。創作者へのエールを込めて公開しています。', link: LINKS.vermiliaExhibition }
  ];

  return (
    <div className="pt-36 pb-32 max-w-7xl mx-auto px-8 sm:px-12 space-y-16 animate-fadeIn">
      <div className="flex justify-between items-center border-b border-white/10 pb-6">
        <button onClick={() => navigateTo('home')} className="text-xs font-mono text-[#a1a1aa] hover:text-white flex items-center gap-2 transition-colors tracking-widest">
          <ArrowLeft className="w-4 h-4 text-[#8f121d]" /> BACK TO PORTAL
        </button>
        <span className="text-[10px] font-mono text-[#d4b07b] tracking-[0.3em] uppercase">OFFICIAL DOCUMENTS</span>
      </div>
      <h1 className="font-serif text-5xl sm:text-7xl text-white">THE ARCHIVES</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {documents.map((doc, idx) => (
          <a key={idx} href={doc.link} target="_blank" rel="noreferrer" className="bg-[#060609] border border-white/10 p-8 flex flex-col justify-between hover:border-[#8f121d]/70 transition-all group">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="p-2 bg-[#030305] border border-white/10">{doc.icon}</div>
                <span className="text-[9px] font-mono tracking-widest text-[#d4b07b] border border-[#d4b07b]/30 px-2 py-0.5">{doc.badge}</span>
              </div>
              <h2 className="font-serif text-xl text-white group-hover:text-[#d4b07b] transition-colors">{doc.title}</h2>
              <p className="text-xs text-[#a1a1aa] leading-relaxed font-light">{doc.desc}</p>
            </div>
            <div className="pt-6 mt-6 border-t border-white/5 flex justify-between font-mono text-[9px] text-[#71717a]">
              <span>VERGUIDE DOCUMENT</span>
              <span className="text-white flex items-center gap-1">VIEW <ExternalLink className="w-3 h-3 text-[#d4b07b]"/></span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
