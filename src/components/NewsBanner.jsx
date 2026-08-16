import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, ExternalLink, Zap } from 'lucide-react';

const TOP_NEWS_ITEMS = [
  {
    id: 'news-1',
    category: 'RELEASE',
    tag: 'NEW ASSET',
    date: '2026.08.14',
    title: 'すーぱーねこちゃんぱんちの最新作情報が公開',
    description: 'どうでもいいと思っていた世界が恋しくなる確率バリ硬ランキング堂々の18位！',
    image: 'https://images.microcms-assets.io/assets/e09e3381a1794b79b2944b2fa68c67c5/8165350_thumb.jpg',
    targetType: 'internal',
    targetPage: 'journal',
    articleId: 'cw_eczjbi',
    externalUrl: ''
  },
  {
    id: 'news-2',
    category: 'JOURNAL',
    tag: 'TIPS & TECH',
    date: '2026.08.10',
    title: 'Numenのスーパー自己紹介① & 制作フローの裏側',
    description: 'BlenderとUnityを行き来する実践的3Dモデリングワークフローと、RUBEDOの設計思想についての記録。',
    image: 'https://images.microcms-assets.io/assets/8165350/default-ogp.png',
    targetType: 'internal',
    targetPage: 'journal',
    articleId: 'cw_eczjbi',
    externalUrl: ''
  },
  {
    id: 'news-3',
    category: 'OFFICIAL',
    tag: 'BOOTH STORE',
    date: '2026.08.01',
    title: 'RUBEDO Official BOOTH Store にて新作アイテム展開中',
    description: 'VRChat向けオリジナルシェーダー、アバター連動アクセサリー等の最新ラインナップ。',
    image: '/favicon.svg',
    targetType: 'external',
    targetPage: '',
    articleId: '',
    externalUrl: 'https://booth.pm/'
  },
  {
    id: 'news-4',
    category: 'OFFICIAL',
    tag: 'NEW BOOK READY',
    date: '2026.08.01',
    title: 'ぱーふぇくとにんげんさんの労働基準監督署3巻',
    description: '露骨に下ネタを避けてきたぱーふぇくとにんげんさんの労働基準監督署3巻がついに発売！',
    image: '/favicon.svg',
    targetType: 'external',
    targetPage: '',
    articleId: '',
    externalUrl: 'https://booth.pm/'
  },
  {
    id: 'news-5',
    category: 'COMMUNITY',
    tag: 'DISCORD',
    date: '2026.07.25',
    title: 'RUBEDO 公式Discordサーバーにて制作進捗＆サポート展開中',
    description: 'アセットの最新アップデート情報、制作裏話、技術的な質問受付などの公式コミュニティ。',
    image: '/favicon.svg',
    targetType: 'external',
    targetPage: '',
    articleId: '',
    externalUrl: 'https://discord.com/'
  }
];

export default function NewsBanner({ navigateTo }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isHovered || TOP_NEWS_ITEMS.length <= 1) return;
    timerRef.current = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % TOP_NEWS_ITEMS.length);
    }, 5500);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isHovered]);

  const activeNews = TOP_NEWS_ITEMS[currentIdx];

  const handleClick = () => {
    if (activeNews.targetType === 'external' && activeNews.externalUrl) {
      window.open(activeNews.externalUrl, '_blank', 'noopener,noreferrer');
    } else if (activeNews.targetType === 'internal' && typeof navigateTo === 'function') {
      navigateTo(activeNews.targetPage || 'journal', null, activeNews.articleId || null);
    }
  };

  return (
    <div 
      className="w-full max-w-3xl mx-auto pt-2 pb-6"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ニュース見出しバー */}
      <div className="flex items-center justify-between pb-2 border-b border-white/10 text-[11px] font-mono">
        <div className="flex items-center gap-2 text-[#d4b07b] tracking-[0.2em] uppercase">
          <Zap className="w-3 h-3 text-[#8f121d]" />
          <span>TOPICS & DISPATCH</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button 
            onClick={(e) => { e.stopPropagation(); setCurrentIdx((prev) => (prev === 0 ? TOP_NEWS_ITEMS.length - 1 : prev - 1)); }}
            className="p-1 border border-white/10 bg-white/[0.02] hover:border-[#8f121d] hover:text-[#8f121d] text-[#a1a1aa] transition-colors cursor-pointer"
            title="Prev"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); setCurrentIdx((prev) => (prev + 1) % TOP_NEWS_ITEMS.length); }}
            className="p-1 border border-white/10 bg-white/[0.02] hover:border-[#8f121d] hover:text-[#8f121d] text-[#a1a1aa] transition-colors cursor-pointer"
            title="Next"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* コンパクトカード */}
      <div 
        onClick={handleClick}
        className="mt-3 group border border-white/10 bg-[#060609] hover:border-[#8f121d]/70 transition-all duration-300 cursor-pointer overflow-hidden shadow-xl"
      >
        <div className="flex flex-col sm:flex-row sm:h-36">
          {/* サムネイル画像 */}
          <div className="sm:w-48 md:w-56 shrink-0 relative bg-black/60 overflow-hidden aspect-video sm:aspect-auto border-b sm:border-b-0 sm:border-r border-white/10">
            <img 
              src={activeNews.image} 
              alt={activeNews.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100" 
            />
            <span className="absolute top-2 left-2 px-2 py-0.5 bg-black/80 backdrop-blur-md border border-white/15 text-[9px] font-mono text-[#d4b07b] tracking-wider">
              {activeNews.tag}
            </span>
          </div>

          {/* テキスト詳細 */}
          <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-2">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5 font-mono text-[10px]">
                <span className="px-2 py-0.5 bg-[#8f121d] text-white font-bold tracking-wider text-[9px]">
                  {activeNews.category}
                </span>
                <span className="text-[#71717a] tracking-wider">
                  {activeNews.date}
                </span>
              </div>

              <h3 className="text-sm sm:text-base font-serif text-white group-hover:text-[#d4b07b] transition-colors leading-snug line-clamp-1">
                {activeNews.title}
              </h3>

              <p className="text-[11px] sm:text-xs text-[#a1a1aa] font-sans font-light leading-relaxed line-clamp-2">
                {activeNews.description}
              </p>
            </div>

            {/* フッターリンク ＆ インジケーター（自動で5つ並びます） */}
            <div className="pt-2 border-t border-white/5 flex items-center justify-between font-mono text-[10px] text-[#8f121d]">
              <span className="inline-flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                {activeNews.targetType === 'external' ? 'VISIT EXTERNAL LINK' : 'READ DISPATCH'}
                {activeNews.targetType === 'external' ? <ExternalLink className="w-3 h-3" /> : <ArrowRight className="w-3 h-3" />}
              </span>

              <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                {TOP_NEWS_ITEMS.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIdx(idx)}
                    className={`h-1 transition-all cursor-pointer ${currentIdx === idx ? 'w-4 bg-[#8f121d]' : 'w-1.5 bg-white/20 hover:bg-white/40'}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}