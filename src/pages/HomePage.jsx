import React, { useRef } from 'react';
import { ArrowUpRight, ChevronRight, ChevronLeft, Aperture, Box, MessageSquare, ExternalLink } from 'lucide-react';
import { vermiliaAngles } from '../config/siteConfig';
import { formatDate, getCategoryName, getAuthorName, optimizeImage } from '../utils/formatters';
import NewsBanner from '../components/NewsBanner';

export default function HomePage({ navigateTo, articles = [], setSelectedArticleId, selectedAngle, setSelectedAngle, CONFIG }) {
  const currentAngleObj = vermiliaAngles.find(a => a.id === selectedAngle);
  const scrollRef = useRef(null);

  const latestEightArticles = [...articles]
    .sort((a, b) => {
      const dateA = new Date(a?.publishedAt || a?.createdAt || a?.updatedAt || 0);
      const dateB = new Date(b?.publishedAt || b?.createdAt || b?.updatedAt || 0);
      return dateB - dateA;
    })
    .slice(0, 8);

  const handleArticleClick = (articleId) => {
    if (typeof navigateTo === 'function') {
      navigateTo('journal', null, articleId);
    } else if (typeof setSelectedArticleId === 'function') {
      setSelectedArticleId(articleId);
    }
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="animate-fadeIn">
      {/* HERO SECTION */}
      <section className="min-h-screen pt-36 pb-20 flex flex-col justify-between max-w-7xl mx-auto px-8 sm:px-12 relative z-10">
        <div className="pt-12 sm:pt-20 space-y-10">
          <div className="inline-flex items-center gap-3 border border-white/10 px-3.5 py-1 bg-white/[0.015]">
            <span className="w-1.5 h-1.5 bg-[#8f121d] animate-pulse"></span>
            <span className="text-[10px] tracking-[0.35em] text-[#a1a1aa] font-mono uppercase">HIGH-END 3D ASSET ARCHIVE</span>
          </div>
          <div className="space-y-6">
            <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl font-normal tracking-[0.08em] text-white leading-none">
              RUBEDO
            </h1>
            <p className="font-serif text-lg sm:text-2xl lg:text-3xl text-[#d4b07b] font-light tracking-wide max-w-3xl leading-relaxed">
              「静寂な高級感」と「所有の充足感」を刻む、<br className="hidden sm:inline" />ハイエンド・クリエイティブポータル。
            </p>
          </div>
          <p className="text-xs sm:text-sm text-[#a1a1aa] font-light max-w-xl leading-[1.9] tracking-wide">
            Numen と MUMEN が主宰する創作の原点。妥協なき3Dモデル造形、シェーディングの極致、精度を追求したギミック。ここに RUBEDO のすべてを集約します。
          </p>
        </div>

        {/* 区切り線 */}
        <div className="pt-16 pb-8">
          <div className="w-full h-[1px] bg-gradient-to-r from-[#8f121d]/40 via-white/10 to-transparent"></div>
        </div>

        {/* ニュース欄（区切り線の下・中央コンパクト配置） */}
        <NewsBanner navigateTo={navigateTo} />
      </section>

      {/* SECTION 01: VERMILIA */}
      <section className="py-36 border-t border-white/10 bg-[#060609] relative z-10">
        <div className="max-w-7xl mx-auto px-8 sm:px-12 space-y-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-8 gap-6">
            <div className="space-y-3">
              <span className="text-[10px] tracking-[0.3em] text-[#8f121d] font-mono uppercase">01 / FLAGSHIP MODEL</span>
              <h2 className="font-serif text-4xl sm:text-6xl text-white font-normal tracking-wide">VERMILIA</h2>
            </div>
            <button 
              onClick={() => navigateTo('vermilia')}
              className="inline-flex items-center gap-2 text-xs font-mono text-[#d4b07b] hover:text-white transition-colors tracking-widest uppercase cursor-pointer"
            >
              <span>EXPLORE SPECIAL PAGE</span>
              <ArrowUpRight className="w-4 h-4 text-[#8f121d]" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-8 bg-[#030305] border border-white/10 aspect-video relative group overflow-hidden">
              {currentAngleObj && (
                <img 
                  src={optimizeImage(currentAngleObj.image)} 
                  alt={currentAngleObj.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              )}
              <div className="absolute top-6 left-6 font-mono text-[10px] tracking-widest text-[#a1a1aa] bg-black/60 backdrop-blur-md px-3 py-1.5 border border-white/10">
                ANGLE : {selectedAngle.toUpperCase()}
              </div>
            </div>

            <div className="lg:col-span-4 space-y-6">
              <span className="text-[10px] tracking-[0.25em] text-[#71717a] font-mono uppercase block">ANGLE SELECTOR</span>
              <div className="grid grid-cols-2 gap-4">
                {vermiliaAngles.map((angle) => (
                  <button
                    key={angle.id}
                    onClick={() => setSelectedAngle(angle.id)}
                    className={`aspect-square p-2 border transition-all cursor-pointer relative group ${
                      selectedAngle === angle.id 
                        ? 'border-[#8f121d] bg-[#8f121d]/10 shadow-[0_0_15px_rgba(143,18,29,0.3)]' 
                        : 'border-white/10 bg-[#030305] hover:border-white/30'
                    }`}
                  >
                    <img 
                      src={optimizeImage(angle.thumb || angle.image)} 
                      alt={angle.title} 
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 02: LATEST ARCHIVES */}
      <section className="py-36 border-t border-white/10 relative z-10">
        <div className="max-w-7xl mx-auto px-8 sm:px-12 space-y-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-8 gap-6">
            <div className="space-y-3">
              <span className="text-[10px] tracking-[0.3em] text-[#8f121d] font-mono uppercase">02 / JOURNAL & INSIGHTS</span>
              <h2 className="font-serif text-4xl sm:text-6xl text-white font-normal tracking-wide">LATEST ARCHIVES</h2>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => scroll('left')}
                  className="p-3 border border-white/10 text-white hover:border-[#8f121d] transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => scroll('right')}
                  className="p-3 border border-white/10 text-white hover:border-[#8f121d] transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <button 
                onClick={() => navigateTo('journal')}
                className="inline-flex items-center gap-2 text-xs font-mono text-[#d4b07b] hover:text-white transition-colors tracking-widest uppercase cursor-pointer"
              >
                <span>VIEW ALL JOURNALS</span>
                <ArrowUpRight className="w-4 h-4 text-[#8f121d]" />
              </button>
            </div>
          </div>

          <div 
            ref={scrollRef}
            className="flex gap-8 overflow-x-auto no-scrollbar pb-6 scroll-smooth"
          >
            {latestEightArticles.map((article) => {
              const articleDate = formatDate(article?.publishedAt || article?.createdAt || article?.updatedAt);
              const categoryName = getCategoryName(article);
              const authorName = getAuthorName(article?.author);
              const eyecatchUrl = article?.eyecatch?.url;

              return (
                <article
                  key={article.id}
                  onClick={() => handleArticleClick(article.id)}
                  className="w-[340px] sm:w-[400px] shrink-0 bg-[#060609] border border-white/10 p-8 space-y-6 flex flex-col justify-between hover:border-[#8f121d]/70 transition-all cursor-pointer group shadow-lg"
                >
                  {eyecatchUrl && (
                    <div className="aspect-video w-full overflow-hidden bg-[#030305] border border-white/10">
                      <img 
                        src={optimizeImage(eyecatchUrl)} 
                        alt={article.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between font-mono text-[10px]">
                      <span className="text-[#8f121d] font-bold">{categoryName}</span>
                      <span className="text-[#71717a]">{articleDate}</span>
                    </div>
                    <h3 className="font-serif text-xl text-white group-hover:text-[#d4b07b] transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-xs text-[#a1a1aa] line-clamp-3 font-light leading-relaxed">
                      {article.lead || ''}
                    </p>
                  </div>
                  <div className="pt-6 border-t border-white/5 flex justify-between font-mono text-[10px] text-[#71717a]">
                    <span>BY {authorName}</span>
                    <span className="text-white flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      READ <ArrowRight className="w-3.5 h-3.5 text-[#8f121d]" />
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 03: BOOTH ARCHIVE */}
      <section className="py-36 border-t border-white/10 bg-[#060609] relative z-10">
        <div className="max-w-7xl mx-auto px-8 sm:px-12 space-y-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-8 gap-6">
            <div className="space-y-3">
              <span className="text-[10px] tracking-[0.3em] text-[#8f121d] font-mono uppercase">03 / DIGITAL ASSET COLLECTION</span>
              <h2 className="font-serif text-4xl sm:text-6xl text-white font-normal tracking-wide">BOOTH ARCHIVE</h2>
            </div>
            <button 
              onClick={() => navigateTo('vooth')}
              className="inline-flex items-center gap-2 text-xs font-mono text-[#d4b07b] hover:text-white transition-colors tracking-widest uppercase cursor-pointer"
            >
              <span>EXPLORE ASSETS</span>
              <ArrowUpRight className="w-4 h-4 text-[#8f121d]" />
            </button>
          </div>

          <div 
            onClick={() => navigateTo('vooth')}
            className="border border-white/10 p-12 sm:p-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 hover:border-[#8f121d] transition-all cursor-pointer group bg-[#030305]"
          >
            <div className="space-y-4 max-w-2xl">
              <h3 className="font-serif text-2xl sm:text-3xl text-white group-hover:text-[#d4b07b] transition-colors">
                RUBEDO OFFICIAL BOOTH STORE
              </h3>
              <p className="font-mono text-xs sm:text-sm text-[#a1a1aa] leading-relaxed">
                オリジナル3Dアバター、Unity用シェーダー、衣装アセット、VRChat向けシステムギミックの公式ラインナップ。
              </p>
            </div>
            <div className="px-8 py-4 bg-white/5 border border-white/10 font-mono text-xs text-white group-hover:bg-[#8f121d] group-hover:border-[#8f121d] transition-all flex items-center gap-3 shrink-0">
              <span>VISIT STORE ARCHIVE</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 04: FOUNDERS */}
      <section className="py-36 border-t border-white/10 relative z-10">
        <div className="max-w-7xl mx-auto px-8 sm:px-12 space-y-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-8 gap-6">
            <div className="space-y-3">
              <span className="text-[10px] tracking-[0.3em] text-[#8f121d] font-mono uppercase">04 / CORE ARCHITECTS</span>
              <h2 className="font-serif text-4xl sm:text-6xl text-white font-normal tracking-wide">FOUNDERS</h2>
            </div>
            <button 
              onClick={() => navigateTo('founders')}
              className="inline-flex items-center gap-2 text-xs font-mono text-[#d4b07b] hover:text-white transition-colors tracking-widest uppercase cursor-pointer"
            >
              <span>ABOUT CREATORS</span>
              <ArrowUpRight className="w-4 h-4 text-[#8f121d]" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div 
              onClick={() => navigateTo('founders')}
              className="border border-white/10 p-10 space-y-6 bg-[#060609] hover:border-[#8f121d] transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-2xl text-white group-hover:text-[#d4b07b] transition-colors">Numen</h3>
                <span className="font-mono text-[10px] tracking-widest text-[#8f121d] uppercase">3D MODELING & GIMMICK</span>
              </div>
              <p className="font-mono text-xs text-[#a1a1aa] leading-relaxed">
                3Dモデリング、メッシュトポロジー設計、Unityギミック開発およびシステム実装全般を担当。
              </p>
            </div>

            <div 
              onClick={() => navigateTo('founders')}
              className="border border-white/10 p-10 space-y-6 bg-[#060609] hover:border-[#8f121d] transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-2xl text-white group-hover:text-[#d4b07b] transition-colors">MUMEN</h3>
                <span className="font-mono text-[10px] tracking-widest text-[#8f121d] uppercase">DESIGN & TEXTURE</span>
              </div>
              <p className="font-mono text-xs text-[#a1a1aa] leading-relaxed">
                キャラクターコンセプトデザイン、衣装・テクスチャ制作、ブランドPRおよび監修を担当。
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}