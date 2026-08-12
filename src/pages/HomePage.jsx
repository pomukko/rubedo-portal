import React, { useRef } from 'react';
import { ArrowUpRight, ChevronRight, ChevronLeft, Aperture, Box, MessageSquare, ExternalLink } from 'lucide-react';
import { vermiliaAngles } from '../config/siteConfig';
import { formatDate, getCategoryName } from '../utils/formatters';

export default function HomePage({ navigateTo, articles = [], setSelectedArticleId, selectedAngle, setSelectedAngle, CONFIG }) {
  const currentAngleObj = vermiliaAngles.find(a => a.id === selectedAngle);
  const scrollRef = useRef(null);

  // 最新順ソート ＆ 上限8件制限
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

  // スライド操作用
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
      <section className="min-h-screen pt-36 pb-28 flex flex-col justify-between max-w-7xl mx-auto px-8 sm:px-12 relative z-10">
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
        <div className="pt-24">
          <div className="w-full h-[1px] bg-gradient-to-r from-[#8f121d]/40 via-white/10 to-transparent"></div>
        </div>
      </section>

      {/* SECTION 01: VERMILIA */}
      <section className="py-36 border-t border-white/10 bg-[#060609] relative z-10">
        <div className="max-w-7xl mx-auto px-8 sm:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <div className="space-y-3">
              <span className="text-[10px] tracking-[0.4em] text-[#8f121d] uppercase font-mono block font-semibold">01 / FLAGSHIP MODEL</span>
              <h2 className="font-serif text-4xl sm:text-6xl text-white tracking-wide">VERMILIA</h2>
            </div>
            <button onClick={() => navigateTo('vermilia')} className="text-xs text-[#d4b07b] font-mono tracking-[0.25em] flex items-center gap-2 hover:text-white transition-colors">
              EXPLORE SPECIAL PAGE <ArrowUpRight className="w-4 h-4 text-[#8f121d]" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
            <div className="lg:col-span-7 bg-[#030305] border border-white/10 p-8 sm:p-10 flex flex-col justify-between space-y-8">
              <div className="flex justify-between items-center text-[10px] font-mono tracking-widest text-[#71717a] border-b border-white/10 pb-4">
                <div className="flex items-center gap-2.5">
                  <Aperture className="w-3.5 h-3.5 text-[#8f121d]" />
                  <span className="text-white">CINEMATIC VIEW</span>
                </div>
                <span className="text-[#d4b07b] font-serif">{currentAngleObj?.title}</span>
              </div>
              <div className="aspect-[16/10] bg-[#07070a] border border-white/5 relative overflow-hidden flex items-center justify-center p-10 group">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(143,18,29,0.14)_0%,_transparent_75%)] pointer-events-none"></div>
                <div className="text-center space-y-5 z-10 max-w-md mx-auto">
                  <div className="w-28 h-28 mx-auto border border-[#8f121d]/40 bg-[#8f121d]/10 backdrop-blur-md flex items-center justify-center relative shadow-[0_0_60px_rgba(143,18,29,0.22)]">
                    <Box className="w-14 h-14 text-[#d4b07b]" />
                  </div>
                  <div className="space-y-2 pt-2">
                    <div className="text-xs font-mono tracking-[0.35em] text-white uppercase font-medium">{currentAngleObj?.title}</div>
                    <div className="text-xs font-serif text-[#d4b07b]">{currentAngleObj?.subtitle}</div>
                  </div>
                  <p className="text-xs text-[#a1a1aa] font-light leading-[1.8] pt-4 border-t border-white/10">{currentAngleObj?.desc}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {vermiliaAngles.map((angle) => (
                  <button key={angle.id} onClick={() => setSelectedAngle(angle.id)} className={`p-4 text-left border transition-all ${selectedAngle === angle.id ? 'border-[#8f121d] bg-[#8f121d]/10 text-white' : 'border-white/5 bg-white/[0.01] text-[#71717a] hover:border-white/20'}`}>
                    <div className="text-[9px] font-mono text-[#52525b] mb-1.5">{angle.id}</div>
                    <div className="text-[11px] font-serif truncate">{angle.title.split('. ')[1]}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 bg-[#030305] border border-white/10 p-10 sm:p-12 flex flex-col justify-between space-y-12">
              <div className="space-y-8">
                <div className="border-b border-white/10 pb-8 space-y-3">
                  <span className="text-[10px] font-mono tracking-[0.3em] text-[#d4b07b] uppercase">THE PHILOSOPHY</span>
                  <h3 className="font-serif text-3xl text-white">深遠なる造形と存在感</h3>
                </div>
                <p className="text-xs sm:text-sm text-[#a1a1aa] leading-[2] font-light">
                  ヴェルミリアは、RUBEDOが提示する「充足感」を物理的な造形へと昇華させたモデルです。過飾を削ぎ落としたシルエットと、光を美しく吸い込むマテリアルの設計。VR空間に身を置いた一瞬の静寂と、所有する歓びをあなたに届けます。
                </p>
              </div>
              <div className="space-y-6 pt-8 border-t border-white/10">
                <a href={CONFIG.LINKS.vermiliaItem} target="_blank" rel="noreferrer" className="w-full bg-[#8f121d] text-white text-xs font-mono tracking-[0.3em] py-5 text-center transition-all flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(143,18,29,0.35)] hover:bg-[#a31625]">
                  ACQUIRE ON BOOTH <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 02: 新着記事 (NEW ARRIVALS / 広域ディープフェードぼかし仕様) */}
      <section className="py-36 border-t border-white/10 relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 sm:px-12 mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-3">
              <span className="text-[10px] tracking-[0.4em] text-[#8f121d] uppercase font-mono block font-semibold">02 / NEW ARRIVALS</span>
              <h2 className="font-serif text-4xl sm:text-6xl text-white tracking-wide">新着記事</h2>
            </div>
            
            <div className="flex items-center gap-6">
              {/* 左右スライド操作ボタン */}
              <div className="flex items-center gap-2 font-mono z-30">
                <button 
                  onClick={() => scroll('left')}
                  className="p-3 border border-white/10 text-white hover:border-[#8f121d] transition-colors bg-[#040406]/90 backdrop-blur-md"
                  aria-label="Previous Articles"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => scroll('right')}
                  className="p-3 border border-white/10 text-white hover:border-[#8f121d] transition-colors bg-[#040406]/90 backdrop-blur-md"
                  aria-label="Next Articles"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <button onClick={() => navigateTo('journal')} className="text-xs font-mono text-[#d4b07b] tracking-[0.25em] flex items-center gap-2 hover:text-white transition-colors z-30">
                FULL ARCHIVE <ArrowUpRight className="w-4 h-4 text-[#8f121d]" />
              </button>
            </div>
          </div>
        </div>

        {/* 🌟 左右両端の広域ディープぼかしマスク */}
        <div className="relative w-full">
          <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-48 lg:w-64 bg-gradient-to-r from-[#040406] via-[#040406]/80 to-transparent z-20 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-32 sm:w-64 lg:w-96 bg-gradient-to-l from-[#040406] via-[#040406]/80 to-transparent z-20 pointer-events-none"></div>

          {/* 横スライドカルーセル */}
          <div 
            ref={scrollRef}
            className="flex gap-8 overflow-x-auto scrollbar-none px-8 sm:px-12 lg:pl-[calc((100vw-80rem)/2+3rem)] lg:pr-24 scroll-smooth pb-8"
          >
            {latestEightArticles.map((article) => {
              const articleDate = formatDate(article?.publishedAt || article?.createdAt || article?.updatedAt);
              const categoryName = getCategoryName(article?.category);
              const eyecatchUrl = article?.eyecatch?.url;

              return (
                <article 
                  key={article.id} 
                  onClick={() => handleArticleClick(article.id)} 
                  className="flex-none w-[280px] sm:w-[360px] lg:w-[380px] bg-[#060609] border border-white/10 overflow-hidden flex flex-col justify-between hover:border-[#8f121d]/70 transition-all duration-500 cursor-pointer group relative z-10"
                >
                  {eyecatchUrl && (
                    <div className="aspect-video w-full overflow-hidden bg-[#030305] border-b border-white/10 relative">
                      <img 
                        src={eyecatchUrl} 
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
                      <span>BY {article.author || 'RUBEDO'}</span>
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
            <span className="text-[10px] tracking-[0.4em] text-[#8f121d] uppercase font-mono block mb-3 font-semibold">03 / EXTERNAL INDEX</span>
            <h2 className="font-serif text-4xl sm:text-6xl text-white tracking-wide">RUBEDO DIRECTORY</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <a href={CONFIG.LINKS.discordServer} target="_blank" rel="noreferrer" className="md:col-span-2 border border-[#d4b07b]/40 bg-[#d4b07b]/[0.02] hover:bg-[#d4b07b]/[0.06] p-10 sm:p-14 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-10 transition-all duration-500 group">
              <div className="space-y-4">
                <div className="flex items-center gap-2.5 text-[10px] font-mono tracking-[0.3em] text-[#d4b07b]">
                  <MessageSquare className="w-4 h-4" />
                  <span>OFFICIAL DISCORD COMMUNITY</span>
                </div>
                <h3 className="font-serif text-3xl sm:text-4xl text-white group-hover:text-[#d4b07b] transition-colors">RUBEDO 公式Discordサーバー</h3>
                <p className="text-xs text-[#a1a1aa] font-light max-w-xl leading-[1.9]">アセットの最新アップデート、制作進捗、不具合報告やサポート、クリエイター同士の情報交換が集まる公式コミュニティ。</p>
              </div>
              <div className="inline-flex items-center gap-2 text-xs font-mono text-[#d4b07b] tracking-[0.25em] border-b border-[#d4b07b]/40 pb-1">ENTER DISCORD <ExternalLink className="w-3.5 h-3.5" /></div>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
