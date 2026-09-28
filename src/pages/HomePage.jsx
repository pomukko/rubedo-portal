import React, { useState, useEffect, useRef } from 'react';
import { ArrowUpRight, ChevronRight, ChevronLeft, Aperture, Box, MessageSquare, ExternalLink, Maximize2, X } from 'lucide-react';
import { vermiliaAngles } from '../config/siteConfig';
import { formatDate, getCategoryName, getAuthorName, optimizeImage } from '../utils/formatters';
import NewsBanner from '../components/NewsBanner';

export default function HomePage({ navigateTo, articles = [], setSelectedArticleId, selectedAngle, setSelectedAngle, CONFIG }) {
  const currentAngleObj = vermiliaAngles.find(a => a.id === selectedAngle);
  const scrollRef = useRef(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Escキーでライトボックスを閉じる ＆ モーダル表示中のスクロール制御
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsLightboxOpen(false);
    };
    if (isLightboxOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isLightboxOpen]);

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
            <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl font-normal tracking-[0.08em] text-white leading-none">RUBEDO</h1>
            <p className="font-serif text-lg sm:text-2xl lg:text-3xl text-[#d4b07b] font-light tracking-wide max-w-3xl leading-[1.4]">
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

        {/* ニュース欄 */}
        <NewsBanner navigateTo={navigateTo} />
      </section>

      {/* SECTION 01: VERMILIA */}
      <section className="py-36 border-t border-white/10 bg-[#060609] relative z-10">
        <div className="max-w-7xl mx-auto px-8 sm:px-12 space-y-12">
          {/* セクションヘッダー */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/10 pb-8">
            <div className="space-y-3">
              <span className="text-[10px] tracking-[0.4em] text-[#8f121d] uppercase font-mono block font-semibold">01 / FLAGSHIP MODEL</span>
              <h2 className="font-serif text-4xl sm:text-6xl text-white tracking-wide">VERMILIA</h2>
            </div>
            <button onClick={() => navigateTo('vermilia')} className="text-xs text-[#d4b07b] font-mono tracking-[0.25em] flex items-center gap-2 hover:text-white transition-colors cursor-pointer">
              EXPLORE SPECIAL PAGE <ArrowUpRight className="w-4 h-4 text-[#8f121d]" />
            </button>
          </div>

          {/* 👑 ワイド・ルックブック プレゼンテーション 👑 */}
          <div className="bg-[#030305] border border-white/10 p-6 sm:p-10 space-y-8 shadow-2xl">
            {/* 上部ステータスバー */}
            <div className="flex justify-between items-center text-[10px] font-mono tracking-widest text-[#71717a] border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <Aperture className="w-3.5 h-3.5 text-[#8f121d]" />
                <span className="text-white">CINEMATIC LOOKBOOK</span>
              </div>
              <span className="text-[#d4b07b] font-serif tracking-wider">{currentAngleObj?.title}</span>
            </div>

            {/* ルックブック・スプリット表示枠 */}
            <div className="bg-[#020204] border border-white/10 relative overflow-hidden flex flex-col lg:flex-row min-h-[480px]">
              {currentAngleObj?.image ? (
                <>
                  {/* 左側：メイン写真枠（パキッとシャープに全身を表示・四隅L字クロップ付き） */}
                  <div 
                    onClick={() => setIsLightboxOpen(true)}
                    className="lg:w-7/12 min-h-[380px] lg:min-h-[500px] relative overflow-hidden flex items-center justify-center p-6 bg-[#010103] border-b lg:border-b-0 lg:border-r border-white/10 cursor-zoom-in group"
                  >
                    {/* コーナークロップマーク */}
                    <div className="absolute top-4 left-4 w-3 h-3 border-t border-l border-white/25 pointer-events-none"></div>
                    <div className="absolute top-4 right-4 w-3 h-3 border-t border-r border-white/25 pointer-events-none"></div>
                    <div className="absolute bottom-4 left-4 w-3 h-3 border-b border-l border-white/25 pointer-events-none"></div>
                    <div className="absolute bottom-4 right-4 w-3 h-3 border-b border-r border-white/25 pointer-events-none"></div>

                    <img 
                      src={optimizeImage(currentAngleObj.image)} 
                      alt={currentAngleObj.title || 'Vermilia View'} 
                      className="max-h-[440px] lg:max-h-[480px] w-auto max-w-full object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.95)] group-hover:scale-[1.02] transition-transform duration-500"
                    />

                    {/* 拡大案内バッジ */}
                    <div className="absolute bottom-4 right-4 z-20 px-3 py-1.5 bg-black/80 backdrop-blur-md border border-white/15 text-[9px] font-mono text-[#d4b07b] flex items-center gap-1.5 opacity-80 group-hover:opacity-100 group-hover:border-[#8f121d] transition-all">
                      <Maximize2 className="w-3 h-3 text-[#8f121d]" />
                      <span>CLICK TO EXPAND</span>
                    </div>
                  </div>

                  {/* 右側：仕様解説 ＆ BOOTH購入ボタン */}
                  <div className="lg:w-5/12 p-8 sm:p-10 flex flex-col justify-between space-y-8 bg-[#040407]">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between text-[10px] font-mono text-[#71717a] border-b border-white/10 pb-3">
                        <span className="tracking-widest uppercase">SPECIFICATION // {currentAngleObj?.id}</span>
                        <span className="text-[#8f121d] font-bold">RUBEDO OFFICIAL</span>
                      </div>

                      <div className="space-y-2">
                        <div className="text-[11px] font-mono tracking-[0.25em] text-[#d4b07b] uppercase">
                          {currentAngleObj?.subtitle}
                        </div>
                        <h4 className="font-serif text-2xl sm:text-3xl text-white tracking-wide">
                          {currentAngleObj?.title}
                        </h4>
                      </div>

                      <p className="text-xs sm:text-sm text-[#a1a1aa] font-light leading-[1.9]">
                        {currentAngleObj?.desc}
                      </p>
                    </div>

                    {/* スペックグリッド ＆ BOOTH直通ボタン */}
                    <div className="space-y-5 pt-6 border-t border-white/10">
                      <div className="grid grid-cols-2 gap-3 text-[10px] font-mono">
                        <div className="p-3 border border-white/5 bg-white/[0.015]">
                          <span className="text-[#71717a] block text-[9px] mb-0.5">CATEGORY</span>
                          <span className="text-[#d4b07b]">FLAGSHIP 3D</span>
                        </div>
                        <div className="p-3 border border-white/5 bg-white/[0.015]">
                          <span className="text-[#71717a] block text-[9px] mb-0.5">PLATFORM</span>
                          <span className="text-white">VRCHAT & UNITY</span>
                        </div>
                      </div>

                      {/* 👑 BOOTH URL直通ボタン 👑 */}
                      <a 
                        href={CONFIG.LINKS.vermiliaItem} 
                        target="_blank" 
                        rel="noreferrer"
                        className="w-full py-4 px-6 bg-[#8f121d] hover:bg-[#a31625] text-white text-xs font-mono tracking-[0.25em] flex items-center justify-center gap-3 transition-all duration-300 shadow-[0_0_25px_rgba(143,18,29,0.35)] cursor-pointer group"
                      >
                        <span>ACQUIRE ON BOOTH</span>
                        <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </a>
                    </div>
                  </div>
                </>
              ) : (
                /* 画像未設定時のフォールバック */
                <div className="w-full h-full min-h-[380px] flex items-center justify-center p-8 text-center">
                  <div className="space-y-4 max-w-sm mx-auto">
                    <div className="w-20 h-20 mx-auto border border-[#8f121d]/40 bg-[#8f121d]/10 backdrop-blur-md flex items-center justify-center shadow-[0_0_40px_rgba(143,18,29,0.22)]">
                      <Box className="w-10 h-10 text-[#d4b07b]" />
                    </div>
                    <div className="text-xs font-mono tracking-[0.3em] text-white uppercase">{currentAngleObj?.title}</div>
                    <p className="text-xs text-[#a1a1aa] font-light leading-relaxed">{currentAngleObj?.desc}</p>
                  </div>
                </div>
              )}
            </div>

            {/* アングルセレクター */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {vermiliaAngles.map((angle) => {
                const isActive = selectedAngle === angle.id;
                return (
                  <button 
                    key={angle.id} 
                    onClick={() => setSelectedAngle(angle.id)} 
                    className={`p-4 text-left border transition-all cursor-pointer relative group ${
                      isActive 
                        ? 'border-[#8f121d] bg-[#8f121d]/15 text-white shadow-[0_0_20px_rgba(143,18,29,0.35)]' 
                        : 'border-white/5 bg-white/[0.01] text-[#71717a] hover:border-white/20 hover:text-[#a1a1aa]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-[9px] font-mono ${isActive ? 'text-[#d4b07b]' : 'text-[#52525b]'}`}>{angle.id}</span>
                      {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#8f121d] animate-pulse"></span>}
                    </div>
                    <div className={`text-[11px] font-serif truncate ${isActive ? 'text-white font-medium' : ''}`}>
                      {angle.title.split('. ')[1] || angle.title}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 👑 FULLSCREEN LIGHTBOX MODAL 👑 */}
      {isLightboxOpen && currentAngleObj?.image && (
        <div 
          onClick={() => setIsLightboxOpen(false)}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 sm:p-8 animate-fadeIn cursor-zoom-out"
        >
          {/* 右上ヘッダー / 閉じるボタン */}
          <div className="absolute top-6 right-6 flex items-center gap-4 z-50" onClick={(e) => e.stopPropagation()}>
            <span className="font-mono text-[10px] tracking-widest text-[#71717a] hidden sm:inline">
              PRESS [ESC] OR CLICK ANYWHERE TO CLOSE
            </span>
            <button 
              onClick={() => setIsLightboxOpen(false)}
              className="p-2.5 border border-white/20 bg-white/5 hover:border-[#8f121d] hover:bg-[#8f121d]/20 text-white transition-all cursor-pointer group shadow-2xl"
              aria-label="Close Lightbox"
            >
              <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>

          {/* 中央フルスクリーン画像 */}
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="relative max-h-[85vh] max-w-[90vw] flex items-center justify-center cursor-default"
          >
            <img 
              src={optimizeImage(currentAngleObj.image)} 
              alt={currentAngleObj.title} 
              className="max-h-[82vh] max-w-[88vw] object-contain border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.95)]"
            />
          </div>

          {/* 下部キャプション */}
          <div 
            onClick={(e) => e.stopPropagation()}
            className="mt-4 text-center space-y-1 font-mono cursor-default pointer-events-none"
          >
            <div className="text-xs text-[#d4b07b] tracking-[0.3em] uppercase">
              {currentAngleObj.title} — {currentAngleObj.subtitle}
            </div>
            <div className="text-[10px] text-[#71717a] tracking-widest uppercase">
              RUBEDO HIGH-END ASSET ARCHIVE
            </div>
          </div>
        </div>
      )}

      {/* SECTION 02: 新着記事 */}
      <section className="py-36 border-t border-white/10 relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 sm:px-12 mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-3">
              <span className="text-[10px] tracking-[0.4em] text-[#8f121d] uppercase font-mono block font-semibold">02 / NEW ARRIVALS</span>
              <h2 className="font-serif text-4xl sm:text-6xl text-white tracking-wide">新着記事</h2>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 font-mono z-30">
                <button 
                  onClick={() => scroll('left')}
                  className="p-3 border border-white/10 text-white hover:border-[#8f121d] transition-colors bg-[#040406]/90 backdrop-blur-md cursor-pointer"
                  aria-label="Previous Articles"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => scroll('right')}
                  className="p-3 border border-white/10 text-white hover:border-[#8f121d] transition-colors bg-[#040406]/90 backdrop-blur-md cursor-pointer"
                  aria-label="Next Articles"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <button onClick={() => navigateTo('journal')} className="text-xs font-mono text-[#d4b07b] tracking-[0.25em] flex items-center gap-2 hover:text-white transition-colors z-30 cursor-pointer">
                FULL ARCHIVE <ArrowUpRight className="w-4 h-4 text-[#8f121d]" />
              </button>
            </div>
          </div>
        </div>

        <div className="relative w-full">
          <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-48 lg:w-64 bg-gradient-to-r from-[#040406] via-[#040406]/80 to-transparent z-20 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-32 sm:w-64 lg:w-96 bg-gradient-to-l from-[#040406] via-[#040406]/80 to-transparent z-20 pointer-events-none"></div>

          <div 
            ref={scrollRef}
            className="flex gap-8 overflow-x-auto scrollbar-none px-8 sm:px-12 lg:pl-[calc((100vw-80rem)/2+3rem)] lg:pr-24 scroll-smooth pb-8"
          >
            {latestEightArticles.map((article) => {
              const articleDate = formatDate(article?.publishedAt || article?.createdAt || article?.updatedAt);
              const categoryName = getCategoryName(article?.category);
              const eyecatchUrl = article?.eyecatch?.url;
              const authorName = getAuthorName(article?.author);

              return (
                <article 
                  key={article.id} 
                  onClick={() => handleArticleClick(article.id)} 
                  className="flex-none w-[280px] sm:w-[360px] lg:w-[380px] bg-[#060609] border border-white/10 overflow-hidden flex flex-col justify-between hover:border-[#8f121d]/70 transition-all duration-500 cursor-pointer group relative z-10"
                >
                  {eyecatchUrl && (
                    <div className="aspect-video w-full overflow-hidden bg-[#030305] border-b border-white/10 relative">
                      <img 
                        src={optimizeImage(eyecatchUrl)} 
                        alt={article.title || ''} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                    </div>
                  )}

                  <div className="p-8 space-y-6 flex-1 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center text-[10px] font-mono tracking-widest text-[#71717a]">
                        <span className="text-[#8f121d] font-bold">{categoryName}</span>
                        <span>{articleDate}</span>
                      </div>
                      <h3 className="font-serif text-xl sm:text-2xl text-white group-hover:text-[#d4b07b] transition-colors leading-[1.4] line-clamp-2">
                        {article.title || 'Untitled'}
                      </h3>
                      <p className="text-xs text-[#a1a1aa] font-light leading-[1.9] line-clamp-3">
                        {article.lead || ''}
                      </p>
                    </div>

                    <div className="pt-6 mt-6 border-t border-white/5 flex justify-between items-center font-mono text-[10px] text-[#71717a]">
                      <span>BY {authorName}</span>
                      <span className="text-white group-hover:translate-x-2 transition-transform flex items-center gap-1.5">
                        READ <ChevronRight className="w-3.5 h-3.5 text-[#8f121d]" />
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 03: DIRECTORY */}
      <section className="py-36 border-t border-white/10 bg-[#060609] relative z-10">
        <div className="max-w-7xl mx-auto px-8 sm:px-12">
          <div className="mb-20">
            <span className="text-[10px] tracking-[0.4em] text-[#8f121d] uppercase font-mono block mb-3 font-semibold">03 / EXTERNAL & EXHIBITION INDEX</span>
            <h2 className="font-serif text-4xl sm:text-6xl text-white tracking-wide">RUBEDO DIRECTORY</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <a 
              href={CONFIG.LINKS.discordServer} 
              target="_blank" 
              rel="noreferrer" 
              className="border border-[#d4b07b]/40 bg-[#d4b07b]/[0.02] hover:bg-[#d4b07b]/[0.06] hover:border-[#d4b07b] p-8 sm:p-12 flex flex-col justify-between gap-8 transition-all duration-500 group cursor-pointer"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-2.5 text-[10px] font-mono tracking-[0.3em] text-[#d4b07b]">
                  <MessageSquare className="w-4 h-4" />
                  <span>OFFICIAL DISCORD COMMUNITY</span>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl text-white group-hover:text-[#d4b07b] transition-colors">
                  RUBEDO 公式Discordサーバー
                </h3>
                <p className="text-xs text-[#a1a1aa] font-light leading-[1.9]">
                  アセットの最新アップデート、制作進捗、不具合報告やサポート、クリエイター同士の情報交換が集まる公式コミュニティ。
                </p>
              </div>
              <div className="inline-flex items-center gap-2 text-xs font-mono text-[#d4b07b] tracking-[0.25em] border-b border-[#d4b07b]/40 pb-1 self-start">
                ENTER DISCORD <ExternalLink className="w-3.5 h-3.5" />
              </div>
            </a>

            <div 
              onClick={() => navigateTo('vooth')} 
              className="border border-[#8f121d]/50 bg-[#8f121d]/[0.03] hover:bg-[#8f121d]/[0.10] hover:border-[#8f121d] p-8 sm:p-12 flex flex-col justify-between gap-8 transition-all duration-500 group cursor-pointer shadow-[0_0_30px_rgba(143,18,29,0.15)]"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-2.5 text-[10px] font-mono tracking-[0.3em] text-[#8f121d] font-bold">
                  <Box className="w-4 h-4 text-[#8f121d]" />
                  <span>CONCEPT 3D EXHIBITION</span>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl text-white group-hover:text-[#d4b07b] transition-colors">
                  VOOTH 3D展覧会ホール
                </h3>
                <p className="text-xs text-[#a1a1aa] font-light leading-[1.9]">
                  BOOTH未公開のコンセプト3Dモデル、開発中の試作品、実験的アセットを集約・展示したオンラインバーチャルギャラリー。
                </p>
              </div>
              <div className="inline-flex items-center gap-2 text-xs font-mono text-white tracking-[0.25em] border-b border-[#8f121d] pb-1 self-start group-hover:text-[#d4b07b] transition-colors">
                ENTER VOOTH <ArrowUpRight className="w-3.5 h-3.5 text-[#8f121d]" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}