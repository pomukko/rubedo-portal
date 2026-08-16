import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowRight, ChevronLeft, ChevronRight, ExternalLink, 
  Sparkles, Layers, ShieldCheck, Flame, Compass, ArrowUpRight, Zap
} from 'lucide-react';
import SEO from '../components/SEO';

// 📰 ピックアップニュースのカスタム設定
// ※ 画像URL、タイトル、リンク先（内部記事ID または 外部URL）を自由に編集できます
const FEATURED_NEWS = [
  {
    id: 'news-1',
    category: 'RELEASE',
    tag: 'NEW ASSET',
    date: '2026.08.14',
    title: '最新フラグシップアセット「Vermilia」大型アップデート公開',
    description: 'テクスチャの解像度向上および最新SDKへの完全互換対応。表情ギミックと衣装シェーダーを最適化しました。',
    image: 'https://images.microcms-assets.io/assets/e09e3381a1794b79b2944b2fa68c67c5/8165350_thumb.jpg',
    // 内部ページ遷移の場合は 'journal' や記事ID、外部サイトはURLを記述
    targetType: 'internal', // 'internal' または 'external'
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
    category: 'BOOTH',
    tag: 'OFFICIAL STORE',
    date: '2026.08.01',
    title: 'RUBEDO Official BOOTH Store にて新作ギミック順次展開中',
    description: 'VRChat向けオリジナルシェーダー、アバター連動アクセサリー等の最新アイテムをチェック。',
    image: '/favicon.svg',
    targetType: 'external',
    targetPage: '',
    articleId: '',
    externalUrl: 'https://booth.pm/'
  }
];

export default function HomePage({ navigateTo, journalArticles = [] }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const slideInterval = useRef(null);

  // 自動スライド処理（ホバー時は停止）
  useEffect(() => {
    if (isHovered || FEATURED_NEWS.length <= 1) return;

    slideInterval.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % FEATURED_NEWS.length);
    }, 6000);

    return () => {
      if (slideInterval.current) clearInterval(slideInterval.current);
    };
  }, [isHovered]);

  const handlePrevSlide = (e) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev === 0 ? FEATURED_NEWS.length - 1 : prev - 1));
  };

  const handleNextSlide = (e) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev + 1) % FEATURED_NEWS.length);
  };

  // スライドクリック時の遷移制御
  const handleSlideClick = (item) => {
    if (item.targetType === 'external' && item.externalUrl) {
      window.open(item.externalUrl, '_blank', 'noopener,noreferrer');
    } else if (item.targetType === 'internal') {
      if (typeof navigateTo === 'function') {
        navigateTo(item.targetPage || 'journal', null, item.articleId || null);
      }
    }
  };

  const activeNews = FEATURED_NEWS[currentSlide];

  return (
    <div className="min-h-screen text-white space-y-24 pt-36 pb-32 overflow-hidden animate-fadeIn">
      <SEO 
        title="TOP"
        description="RUBEDO - 3Dアセットアーカイブ & クリエイティブポータル"
        type="website"
      />

      {/* 🏛️ ヒーローセクション */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 space-y-8 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 border border-[#8f121d]/40 bg-[#8f121d]/10 text-[#8f121d] font-mono text-xs tracking-widest uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          <span>RUBEDO DIGITAL ARCHIVE</span>
        </div>

        <div className="space-y-4 max-w-4xl">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-normal tracking-tight leading-[1.15]">
            追求したギミック。<br />
            ここに <span className="text-[#8f121d] font-semibold">RUBEDO</span> のすべてを集約します。
          </h1>
          <p className="text-[#a1a1aa] font-mono text-xs sm:text-sm tracking-widest leading-relaxed max-w-2xl">
            「静寂な高級感」と「所有の充足感」を刻む、ハイエンド・クリエイティブポータル。
            モデル造形、シェーディング、ギミックの極地を体感してください。
          </p>
        </div>

        {/* 📰 ピックアップニュース・カルーセル（中サイズ・スライダー） */}
        <div 
          className="pt-6"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2 font-mono text-xs text-[#d4b07b] tracking-[0.25em] uppercase">
              <Zap className="w-3.5 h-3.5 text-[#8f121d]" />
              <span>FEATURED TOPICS & NEWS</span>
            </div>
            
            {/* 左右スライドボタン */}
            <div className="flex items-center gap-2">
              <button 
                onClick={handlePrevSlide}
                className="p-2 border border-white/10 bg-white/[0.02] hover:border-[#8f121d] hover:text-[#8f121d] text-[#a1a1aa] transition-colors cursor-pointer"
                aria-label="Previous Slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={handleNextSlide}
                className="p-2 border border-white/10 bg-white/[0.02] hover:border-[#8f121d] hover:text-[#8f121d] text-[#a1a1aa] transition-colors cursor-pointer"
                aria-label="Next Slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* カルーセル本体カード */}
          <div 
            onClick={() => handleSlideClick(activeNews)}
            className="mt-4 group relative border border-white/10 bg-[#060609] hover:border-[#8f121d]/70 transition-all duration-300 cursor-pointer overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.6)]"
          >
            <div className="grid grid-cols-1 md:grid-cols-12 min-h-[220px] sm:min-h-[260px]">
              
              {/* サムネイル画像エリア */}
              <div className="md:col-span-5 relative bg-black/60 overflow-hidden aspect-video md:aspect-auto border-b md:border-b-0 md:border-r border-white/10">
                <img 
                  src={activeNews.image} 
                  alt={activeNews.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent md:hidden" />
                <span className="absolute top-3 left-3 px-2.5 py-1 bg-black/80 backdrop-blur-md border border-white/15 text-[10px] font-mono text-[#d4b07b] tracking-wider">
                  {activeNews.tag}
                </span>
              </div>

              {/* ニューステキスト詳細エリア */}
              <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
                    <span className="px-2.5 py-0.5 bg-[#8f121d] text-white font-bold tracking-wider text-[10px]">
                      {activeNews.category}
                    </span>
                    <span className="text-[#a1a1aa] text-[11px] tracking-widest">
                      {activeNews.date}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-2xl font-serif text-white group-hover:text-[#d4b07b] transition-colors leading-snug line-clamp-2">
                    {activeNews.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#a1a1aa] font-sans font-light leading-relaxed line-clamp-2">
                    {activeNews.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between font-mono text-xs text-[#8f121d]">
                  <span className="inline-flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                    {activeNews.targetType === 'external' ? 'OPEN EXTERNAL LINK' : 'READ DETAILS'}
                    {activeNews.targetType === 'external' ? (
                      <ExternalLink className="w-3.5 h-3.5" />
                    ) : (
                      <ArrowRight className="w-3.5 h-3.5" />
                    )}
                  </span>

                  {/* ドット・インジケーター */}
                  <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    {FEATURED_NEWS.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentSlide(idx)}
                        className={`h-1.5 transition-all cursor-pointer ${
                          currentSlide === idx 
                            ? 'w-6 bg-[#8f121d]' 
                            : 'w-2 bg-white/20 hover:bg-white/40'
                        }`}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 🔗 ポータル内主要セクションへのクイックアクセス */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div 
            onClick={() => navigateTo && navigateTo('journal')}
            className="p-8 border border-white/10 bg-[#060609] hover:border-[#8f121d] transition-all cursor-pointer group space-y-4"
          >
            <div className="w-10 h-10 border border-[#8f121d]/40 bg-[#8f121d]/10 flex items-center justify-center text-[#8f121d]">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-serif text-white group-hover:text-[#d4b07b] transition-colors">
              JOURNAL & LOG
            </h3>
            <p className="text-xs font-mono text-[#a1a1aa] leading-relaxed">
              制作アーカイブ、技術ノート、活動記録の総合インデックス。
            </p>
            <div className="pt-2 text-xs font-mono text-[#8f121d] flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
              <span>EXPLORE</span>
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>

          <div 
            onClick={() => navigateTo && navigateTo('archives')}
            className="p-8 border border-white/10 bg-[#060609] hover:border-[#8f121d] transition-all cursor-pointer group space-y-4"
          >
            <div className="w-10 h-10 border border-[#8f121d]/40 bg-[#8f121d]/10 flex items-center justify-center text-[#8f121d]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-serif text-white group-hover:text-[#d4b07b] transition-colors">
              3D ASSET ARCHIVE
            </h3>
            <p className="text-xs font-mono text-[#a1a1aa] leading-relaxed">
              Vermiliaをはじめとするオリジナルアバター＆ギミック一覧。
            </p>
            <div className="pt-2 text-xs font-mono text-[#8f121d] flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
              <span>VIEW ASSETS</span>
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>

          <div 
            onClick={() => navigateTo && navigateTo('founders')}
            className="p-8 border border-white/10 bg-[#060609] hover:border-[#8f121d] transition-all cursor-pointer group space-y-4"
          >
            <div className="w-10 h-10 border border-[#8f121d]/40 bg-[#8f121d]/10 flex items-center justify-center text-[#8f121d]">
              <Flame className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-serif text-white group-hover:text-[#d4b07b] transition-colors">
              FOUNDERS
            </h3>
            <p className="text-xs font-mono text-[#a1a1aa] leading-relaxed">
              NUMEN & MUMEN。RUBEDOを構成する創作者のビジョンと軌跡。
            </p>
            <div className="pt-2 text-xs font-mono text-[#8f121d] flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
              <span>ABOUT US</span>
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}