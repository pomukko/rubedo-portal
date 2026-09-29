import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Box, ArrowUpRight, Aperture, ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';
import { vermiliaAngles } from '../config/siteConfig';
import { optimizeImage } from '../utils/formatters';

export default function VermiliaPage({ navigateTo, selectedAngle, setSelectedAngle, LINKS, CONFIG }) {
  const currentAngleObj = vermiliaAngles.find(a => a.id === selectedAngle);
  const angleScrollRef = useRef(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // BOOTHリンクの安全参照
  const boothLink = LINKS?.vermiliaItem || CONFIG?.LINKS?.vermiliaItem || 'https://rubedo0.booth.pm/items/8165350';

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

  // アングルセレクターのスライド処理
  const scrollAngles = (direction) => {
    if (angleScrollRef.current) {
      const { clientWidth } = angleScrollRef.current;
      const scrollAmount = clientWidth / 3;
      angleScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="pt-32 pb-32 max-w-7xl mx-auto px-6 sm:px-10 space-y-8 animate-fadeIn">
      {/* 上部ナビゲーションバー */}
      <div className="flex justify-between items-center border-b border-white/10 pb-4">
        <button 
          onClick={() => navigateTo('home')} 
          className="text-xs font-mono text-[#a1a1aa] hover:text-white flex items-center gap-2 transition-colors tracking-widest cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#8f121d]" /> BACK TO PORTAL
        </button>
        <span className="text-[10px] font-mono text-[#d4b07b] tracking-[0.3em] uppercase">
          FLAGSHIP // VERMILIA SPECIAL
        </span>
      </div>

      {/* ページタイトル ＆ コンセプト */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-6">
        <div className="space-y-2">
          <span className="text-[10px] tracking-[0.4em] text-[#8f121d] uppercase font-mono block font-semibold">
            THE FLAGSHIP 3D MODEL
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl text-white tracking-wide">VERMILIA</h1>
        </div>
        <p className="text-xs sm:text-sm text-[#a1a1aa] font-light max-w-md leading-relaxed">
          空間に置いたその瞬間、空気のトーンが変わるかのような、凛とした余韻と存在感。細部をミリ単位でチューニングした輪郭が、所有の充足感を深く満たします。
        </p>
      </div>

      {/* 👑 ルックブック全体コンテナ 👑 */}
      <div className="bg-[#030305] border border-white/10 p-3 sm:p-5 space-y-3 shadow-2xl">
        {/* 上部ステータスバー */}
        <div className="flex justify-between items-center text-[10px] font-mono tracking-widest text-[#71717a] border-b border-white/10 pb-2 px-1">
          <div className="flex items-center gap-2">
            <Aperture className="w-3.5 h-3.5 text-[#8f121d]" />
            <span className="text-white">CINEMATIC LOOKBOOK</span>
          </div>
          <span className="text-[#d4b07b] font-serif tracking-wider">{currentAngleObj?.title}</span>
        </div>

        {/* 🌟 メインコンテンツ：左（大画面＋スライダー） × 右（下端まで伸びる説明枠） 🌟 */}
        <div className="flex flex-col lg:flex-row gap-3 items-stretch">
          
          {/* 【左カラム】：特大画像枠 ＋ 直下のアングルセレクタースライダー */}
          <div className="lg:w-[73%] xl:w-[75%] flex flex-col justify-between space-y-3">
            {/* メイン写真枠（高さ630pxの特大シネマティック枠） */}
            <div 
              onClick={() => setIsLightboxOpen(true)}
              className="w-full h-[420px] sm:h-[500px] lg:h-[630px] bg-[#010103] border border-white/10 relative overflow-hidden flex items-center justify-center p-4 sm:p-6 cursor-zoom-in group"
            >
              {/* 四隅のL字クロップマーク */}
              <div className="absolute top-3.5 left-3.5 w-3.5 h-3.5 border-t border-l border-white/25 pointer-events-none"></div>
              <div className="absolute top-3.5 right-3.5 w-3.5 h-3.5 border-t border-r border-white/25 pointer-events-none"></div>
              <div className="absolute bottom-3.5 left-3.5 w-3.5 h-3.5 border-b border-l border-white/25 pointer-events-none"></div>
              <div className="absolute bottom-3.5 right-3.5 w-3.5 h-3.5 border-b border-r border-white/25 pointer-events-none"></div>

              {currentAngleObj?.image ? (
                <img 
                  src={optimizeImage(currentAngleObj.image)} 
                  alt={currentAngleObj.title || 'Vermilia View'} 
                  className="max-h-[380px] sm:max-h-[460px] lg:max-h-[610px] w-auto max-w-full object-contain drop-shadow-[0_25px_50px_rgba(0,0,0,0.95)] group-hover:scale-[1.015] transition-transform duration-500"
                />
              ) : (
                <div className="space-y-4 max-w-sm mx-auto text-center">
                  <div className="w-16 h-16 mx-auto border border-[#8f121d]/40 bg-[#8f121d]/10 backdrop-blur-md flex items-center justify-center shadow-[0_0_40px_rgba(143,18,29,0.22)]">
                    <Box className="w-8 h-8 text-[#d4b07b]" />
                  </div>
                  <div className="text-xs font-mono tracking-[0.3em] text-white uppercase">{currentAngleObj?.title}</div>
                  <p className="text-xs text-[#a1a1aa] font-light leading-relaxed">{currentAngleObj?.desc}</p>
                </div>
              )}

              {/* 拡大案内バッジ */}
              {currentAngleObj?.image && (
                <div className="absolute bottom-3.5 right-3.5 z-20 px-2.5 py-1 bg-black/80 backdrop-blur-md border border-white/15 text-[9px] font-mono text-[#d4b07b] flex items-center gap-1.5 opacity-80 group-hover:opacity-100 group-hover:border-[#8f121d] transition-all">
                  <Maximize2 className="w-3 h-3 text-[#8f121d]" />
                  <span>CLICK TO EXPAND</span>
                </div>
              )}
            </div>

            {/* 🌟 アングルセレクター（3つ表示 ＋ 左右スライドボタン） 🌟 */}
            <div className="flex items-center gap-2">
              <button 
                onClick={() => scrollAngles('left')}
                className="p-2.5 border border-white/10 bg-white/[0.02] hover:border-[#8f121d] hover:text-white text-[#71717a] transition-colors shrink-0 cursor-pointer h-full flex items-center justify-center"
                title="Previous Angles"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* 3つ分だけ表示するスライダーコンテナ */}
              <div 
                ref={angleScrollRef}
                className="flex-1 flex gap-2.5 overflow-x-hidden scroll-smooth select-none"
              >
                {vermiliaAngles.map((angle) => {
                  const isActive = selectedAngle === angle.id;
                  return (
                    <button 
                      key={angle.id} 
                      onClick={() => setSelectedAngle(angle.id)} 
                      className={`shrink-0 w-[calc((100%-1.25rem)/3)] py-2.5 px-3 text-left border transition-all cursor-pointer relative group ${
                        isActive 
                          ? 'border-[#8f121d] bg-[#8f121d]/15 text-white shadow-[0_0_20px_rgba(143,18,29,0.35)]' 
                          : 'border-white/5 bg-white/[0.01] text-[#71717a] hover:border-white/20 hover:text-[#a1a1aa]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-[9px] font-mono tracking-wider ${isActive ? 'text-[#d4b07b]' : 'text-[#52525b]'}`}>{angle.id}</span>
                        {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#8f121d] animate-pulse"></span>}
                      </div>
                      <div className={`text-[11px] font-serif truncate ${isActive ? 'text-white font-medium' : ''}`}>
                        {angle.title.split('. ')[1] || angle.title}
                      </div>
                    </button>
                  );
                })}
              </div>

              <button 
                onClick={() => scrollAngles('right')}
                className="p-2.5 border border-white/10 bg-white/[0.02] hover:border-[#8f121d] hover:text-white text-[#71717a] transition-colors shrink-0 cursor-pointer h-full flex items-center justify-center"
                title="Next Angles"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 【右カラム】：下端まで一体化して伸びるインスペクターパネル */}
          <div className="lg:w-[27%] xl:w-[25%] p-6 bg-[#040407] border border-white/10 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-[9px] font-mono text-[#71717a] border-b border-white/10 pb-2.5">
                <span className="tracking-widest uppercase">{currentAngleObj?.id}</span>
                <span className="text-[#8f121d] font-bold">VERMILIA ARCHIVE</span>
              </div>

              <div className="space-y-1.5">
                <div className="text-[10px] font-mono tracking-[0.2em] text-[#d4b07b] uppercase">
                  {currentAngleObj?.subtitle}
                </div>
                <h4 className="font-serif text-xl sm:text-2xl text-white tracking-wide leading-snug">
                  {currentAngleObj?.title}
                </h4>
              </div>

              <p className="text-xs text-[#a1a1aa] font-light leading-relaxed">
                {currentAngleObj?.desc}
              </p>

              <div className="pt-3 border-t border-white/5 space-y-2">
                <span className="text-[10px] font-mono tracking-widest text-[#d4b07b] uppercase block">
                  PHILOSOPHY NOTE
                </span>
                <p className="text-[11px] text-[#71717a] font-light leading-relaxed">
                  過飾を削ぎ落としたシルエットと、光を美しく吸い込むマテリアルの設計。VR空間に身を置いた一瞬の静寂と、所有する歓びをあなたに。
                </p>
              </div>
            </div>

            {/* 下部スペック ＆ BOOTH直通ボタン */}
            <div className="space-y-4 pt-4 border-t border-white/10">
              <div className="grid grid-cols-2 gap-2 text-[9px] font-mono">
                <div className="p-2.5 border border-white/5 bg-white/[0.015]">
                  <span className="text-[#71717a] block text-[8px] mb-0.5 uppercase">RELEASE</span>
                  <span className="text-[#d4b07b]">RUBEDO 01</span>
                </div>
                <div className="p-2.5 border border-white/5 bg-white/[0.015]">
                  <span className="text-[#71717a] block text-[8px] mb-0.5 uppercase">SYSTEM</span>
                  <span className="text-white">UNITY / VRCHAT</span>
                </div>
              </div>

              <a 
                href={boothLink} 
                target="_blank" 
                rel="noreferrer"
                className="w-full py-3.5 px-4 bg-[#8f121d] hover:bg-[#a31625] text-white text-[11px] font-mono tracking-[0.2em] flex items-center justify-center gap-2 transition-all duration-300 shadow-[0_0_20px_rgba(143,18,29,0.35)] cursor-pointer group"
              >
                <span>ACQUIRE ON BOOTH</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* 👑 FULLSCREEN LIGHTBOX MODAL 👑 */}
      {isLightboxOpen && currentAngleObj?.image && (
        <div 
          onClick={() => setIsLightboxOpen(false)}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 sm:p-8 animate-fadeIn cursor-zoom-out"
        >
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
    </div>
  );
}