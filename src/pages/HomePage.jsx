import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowUpRight, ChevronRight, ChevronLeft, Aperture, Box, 
  MessageSquare, ExternalLink, ArrowRight, Sparkles, Layers, ShieldCheck, Flame, Zap
} from 'lucide-react';
import { vermiliaAngles } from '../config/siteConfig';
import { formatDate, getCategoryName, getAuthorName, optimizeImage } from '../utils/formatters';

// 📰 ニュース欄に表示するデータ（画像・タイトル・飛び先はここを編集するだけで変更可能）
const TOP_NEWS_ITEMS = [
  {
    id: 'news-1',
    category: 'RELEASE',
    tag: 'NEW ASSET',
    date: '2026.08.14',
    title: '最新フラグシップアセット「Vermilia」大型アップデート公開',
    description: 'テクスチャの解像度向上および最新SDKへの完全互換対応。表情ギミックと衣装シェーダーを最適化しました。',
    image: 'https://images.microcms-assets.io/assets/e09e3381a1794b79b2944b2fa68c67c5/8165350_thumb.jpg',
    targetType: 'internal', // 'internal'（サイト内記事）または 'external'（外部URL）
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
  const [selectedAngle, setSelectedAngle] = useState(0);
  
  // ニュースカルーセル用の状態管理
  const [currentNewsIdx, setCurrentNewsIdx] = useState(0);
  const [isNewsHovered, setIsNewsHovered] = useState(false);
  const newsTimerRef = useRef(null);

  // 自動スライド（ホバー時は一時停止）
  useEffect(() => {
    if (isNewsHovered || TOP_NEWS_ITEMS.length <= 1) return;

    newsTimerRef.current = setInterval(() => {
      setCurrentNewsIdx((prev) => (prev + 1) % TOP_NEWS_ITEMS.length);
    }, 5500);

    return () => {
      if (newsTimerRef.current) clearInterval(newsTimerRef.current);
    };
  }, [isNewsHovered]);

  const handlePrevNews = (e) => {
    e.stopPropagation();
    setCurrentNewsIdx((prev) => (prev === 0 ? TOP_NEWS_ITEMS.length - 1 : prev - 1));
  };

  const handleNextNews = (e) => {
    e.stopPropagation();
    setCurrentNewsIdx((prev) => (prev + 1) % TOP_NEWS_ITEMS.length);
  };

  const handleNewsClick = (item) => {
    if (item.targetType === 'external' && item.externalUrl) {
      window.open(item.externalUrl, '_blank', 'noopener,noreferrer');
    } else if (item.targetType === 'internal') {
      if (typeof navigateTo === 'function') {
        navigateTo(item.targetPage || 'journal', null, item.articleId || null);
      }
    }
  };

  const activeNews = TOP_NEWS_ITEMS[currentNewsIdx];

  return (
    <div className="space-y-32 sm:space-y-44 pb-32 animate-fadeIn w-full overflow-hidden">
      
      {/* ========================================================
          🏛️ ヒーローセクション ＆ 追加ニュースカルーセル
      ======================================================== */}
      <section className="pt-36 sm:pt-48 px-6 sm:px-12 max-w-7xl mx-auto space-y-12">
        {/* 既存のタイトル＆説明文 */}
        <div className="space-y-8 max-w-4xl">
          <div className="space-y-4">
            <h1 className="font-serif text-4xl sm:text-6xl text-white font-normal leading-tight tracking-wide">
              「静寂な高級感」と「所有の充足感」を刻む、<br className="hidden sm:inline" />
              ハイエンド・クリエイティブポータル。
            </h1>
            <p className="text-xs sm:text-sm font-mono text-[#a1a1aa] leading-relaxed tracking-wider">
              Numen と MUMEN が主宰する創作の原点。妥協なき3Dモデル造形、シェーディングの極致、精度を
              追求したギミック。ここに RUBEDO のすべてを集約します。
            </p>
          </div>
        </div>

        {/* 👑 【指定の空きスペースに追加】横スライド式・中サイズニュースカルーセル */}
        <div 
          className="pt-2"
          onMouseEnter={() => setIsNewsHovered(true)}
          onMouseLeave={() => setIsNewsHovered(false)}
        >
          {/* ヘッダーバー */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs font-mono">
            <div className="flex items-center gap-2 text-[#d4b07b] tracking-[0.2em] uppercase">
              <Zap className="w-3.5 h-3.5 text-[#8f121d]" />
              <span>TOPICS & DISPATCH</span>
            </div>

            {/* ナビゲーションボタン */}
            <div className="flex items-center gap-2">
              <button 
                onClick={handlePrevNews}
                className="p-1.5 border border-white/10 bg-white/[0.02] hover:border-[#8f121d] hover:text-[#8f121d] text-[#a1a1aa] transition-colors cursor-pointer"
                title="Previous"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={handleNextNews}
                className="p-1.5 border border-white/10 bg-white/[0.02] hover:border-[#8f121d] hover:text-[#8f121d] text-[#a1a1aa] transition-colors cursor-pointer"
                title="Next"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* スライド本体カード */}
          <div 
            onClick={() => handleNewsClick(activeNews)}
            className="mt-4 group border border-white/10 bg-[#060609] hover:border-[#8f121d]/70 transition-all duration-300 cursor-pointer overflow-hidden shadow-2xl relative"
          >
            <div className="grid grid-cols-1 md:grid-cols-12 min-h-[190px] sm:min-h-[220px]">
              
              {/* サムネイル画像（中サイズ・比率最適化） */}
              <div className="md:col-span-4 relative bg-black/60 overflow-hidden aspect-video md:aspect-auto border-b md:border-b-0 md:border-r border-white/10">
                <img 
                  src={activeNews.image} 
                  alt={activeNews.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100" 
                />
                <span className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-black/80 backdrop-blur-md border border-white/15 text-[10px] font-mono text-[#d4b07b] tracking-wider">
                  {activeNews.tag}
                </span>
              </div>

              {/* ニューステキスト詳細 */}
              <div className="md:col-span-8 p-5 sm:p-7 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 font-mono text-xs">
                    <span className="px-2 py-0.5 bg-[#8f121d] text-white font-bold tracking-wider text-[10px]">
                      {activeNews.category}
                    </span>
                    <span className="text-[#a1a1aa] text-[11px] tracking-widest">
                      {activeNews.date}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-xl font-serif text-white group-hover:text-[#d4b07b] transition-colors leading-snug line-clamp-2">
                    {activeNews.title}
                  </h3>

                  <p className="text-xs text-[#a1a1aa] font-sans font-light leading-relaxed line-clamp-2">
                    {activeNews.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between font-mono text-xs text-[#8f121d]">
                  <span className="inline-flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                    {activeNews.targetType === 'external' ? 'VISIT EXTERNAL LINK' : 'READ DISPATCH'}
                    {activeNews.targetType === 'external' ? (
                      <ExternalLink className="w-3.5 h-3.5" />
                    ) : (
                      <ArrowRight className="w-3.5 h-3.5" />
                    )}
                  </span>

                  {/* インジケーターバー */}
                  <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    {TOP_NEWS_ITEMS.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentNewsIdx(idx)}
                        className={`h-1 transition-all cursor-pointer ${
                          currentNewsIdx === idx ? 'w-5 bg-[#8f121d]' : 'w-2 bg-white/20 hover:bg-white/40'
                        }`}
                        aria-label={`Slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          01 / FLAGSHIP MODEL : VERMILIA（既存セクション完全維持）
      ======================================================== */}
      <section className="px-6 sm:px-12 max-w-7xl mx-auto space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-white/10 pb-6 gap-4">
          <div className="space-y-2">
            <span className="text-xs font-mono text-[#8f121d] tracking-[0.3em] uppercase">01 / FLAGSHIP MODEL</span>
            <h2 className="font-serif text-3xl sm:text-5xl text-white tracking-wide">VERMILIA</h2>
          </div>
          <button 
            onClick={() => navigateTo && navigateTo('vermilia')}
            className="inline-flex items-center gap-2 text-xs font-mono text-[#d4b07b] hover:text-white transition-colors tracking-widest uppercase cursor-pointer"
          >
            <span>EXPLORE SPECIAL PAGE</span>
            <ArrowUpRight className="w-4 h-4 text-[#8f121d]" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* メインプレビュー */}
          <div className="lg:col-span-8 bg-[#060609] border border-white/10 aspect-[16/10] overflow-hidden relative group">
            {vermiliaAngles && vermiliaAngles[selectedAngle] ? (
              <img 
                src={vermiliaAngles[selectedAngle].url} 
                alt="Vermilia Preview" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#71717a] font-mono text-xs">
                VERMILIA ARCHIVE
              </div>
            )}
            <div className="absolute top-4 left-4 bg-black/80 px-3 py-1 border border-white/10 font-mono text-xs text-white">
              ANGLE : {String(selectedAngle + 1).padStart(2, '0')}
            </div>
          </div>

          {/* アングルセレクター */}
          <div className="lg:col-span-4 space-y-4">
            <p className="text-xs font-mono text-[#a1a1aa] tracking-wider uppercase">ANGLE SELECTOR</p>
            <div className="grid grid-cols-3 gap-3">
              {vermiliaAngles && vermiliaAngles.map((angle, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedAngle(idx)}
                  className={`aspect-square border p-1 transition-all cursor-pointer bg-[#060609] ${
                    selectedAngle === idx 
                      ? 'border-[#8f121d] shadow-[0_0_15px_rgba(143,18,29,0.5)]' 
                      : 'border-white/10 hover:border-white/40'
                  }`}
                >
                  <img src={angle.url} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          02 / JOURNAL & INSIGHTS（既存セクション完全維持）
      ======================================================== */}
      <section className="px-6 sm:px-12 max-w-7xl mx-auto space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-white/10 pb-6 gap-4">
          <div className="space-y-2">
            <span className="text-xs font-mono text-[#8f121d] tracking-[0.3em] uppercase">02 / JOURNAL & INSIGHTS</span>
            <h2 className="font-serif text-3xl sm:text-5xl text-white tracking-wide">LATEST ARCHIVES</h2>
          </div>
          <button 
            onClick={() => navigateTo && navigateTo('journal')}
            className="inline-flex items-center gap-2 text-xs font-mono text-[#d4b07b] hover:text-white transition-colors tracking-widest uppercase cursor-pointer"
          >
            <span>VIEW ALL JOURNALS</span>
            <ArrowUpRight className="w-4 h-4 text-[#8f121d]" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {journalArticles.slice(0, 3).map((article) => {
            const articleDate = formatDate(article?.publishedAt || article?.createdAt || article?.updatedAt);
            const categoryName = getCategoryName(article);
            const authorName = getAuthorName(article?.author);
            const eyecatchUrl = article?.eyecatch?.url;

            return (
              <div
                key={article.id}
                onClick={() => navigateTo && navigateTo('journal', null, article.id)}
                className="bg-[#060609] border border-white/10 p-6 flex flex-col justify-between space-y-6 hover:border-[#8f121d] transition-all cursor-pointer group shadow-lg"
              >
                {eyecatchUrl && (
                  <div className="aspect-video w-full overflow-hidden bg-black/40 border border-white/10">
                    <img 
                      src={optimizeImage(eyecatchUrl)} 
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  </div>
                )}
                <div className="space-y-3">
                  <div className="flex items-center justify-between font-mono text-[10px]">
                    <span className="text-[#8f121d] font-bold">{categoryName}</span>
                    <span className="text-[#71717a]">{articleDate}</span>
                  </div>
                  <h3 className="font-serif text-lg text-white group-hover:text-[#d4b07b] transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  {article.lead && (
                    <p className="text-xs text-[#a1a1aa] line-clamp-2 font-light leading-relaxed">
                      {article.lead}
                    </p>
                  )}
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between font-mono text-[10px] text-[#71717a]">
                  <span>BY {authorName}</span>
                  <span className="text-white flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    READ <ArrowRight className="w-3 h-3 text-[#8f121d]" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================
          03 / DIGITAL ASSETS : VOOTH（既存セクション完全維持）
      ======================================================== */}
      <section className="px-6 sm:px-12 max-w-7xl mx-auto space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-white/10 pb-6 gap-4">
          <div className="space-y-2">
            <span className="text-xs font-mono text-[#8f121d] tracking-[0.3em] uppercase">03 / DIGITAL ASSET COLLECTION</span>
            <h2 className="font-serif text-3xl sm:text-5xl text-white tracking-wide">BOOTH ARCHIVE</h2>
          </div>
          <button 
            onClick={() => navigateTo && navigateTo('vooth')}
            className="inline-flex items-center gap-2 text-xs font-mono text-[#d4b07b] hover:text-white transition-colors tracking-widest uppercase cursor-pointer"
          >
            <span>EXPLORE ASSETS</span>
            <ArrowUpRight className="w-4 h-4 text-[#8f121d]" />
          </button>
        </div>

        <div 
          onClick={() => navigateTo && navigateTo('vooth')}
          className="p-8 sm:p-12 border border-white/10 bg-[#060609] hover:border-[#8f121d] transition-all cursor-pointer group flex flex-col md:flex-row items-center justify-between gap-8"
        >
          <div className="space-y-3 text-center md:text-left">
            <h3 className="font-serif text-2xl sm:text-3xl text-white group-hover:text-[#d4b07b] transition-colors">
              RUBEDO OFFICIAL BOOTH STORE
            </h3>
            <p className="text-xs sm:text-sm font-mono text-[#a1a1aa] max-w-xl leading-relaxed">
              オリジナル3Dアバター、Unity用シェーダー、衣装アセット、VRChat向けシステムギミックの公式ラインナップ。
            </p>
          </div>
          <div className="px-6 py-3 bg-white/5 border border-white/10 font-mono text-xs text-white group-hover:bg-[#8f121d] group-hover:border-[#8f121d] transition-all flex items-center gap-2 shrink-0">
            <span>VISIT STORE ARCHIVE</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </section>

      {/* ========================================================
          04 / FOUNDERS（既存セクション完全維持）
      ======================================================== */}
      <section className="px-6 sm:px-12 max-w-7xl mx-auto space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-white/10 pb-6 gap-4">
          <div className="space-y-2">
            <span className="text-xs font-mono text-[#8f121d] tracking-[0.3em] uppercase">04 / CORE ARCHITECTS</span>
            <h2 className="font-serif text-3xl sm:text-5xl text-white tracking-wide">FOUNDERS</h2>
          </div>
          <button 
            onClick={() => navigateTo && navigateTo('founders')}
            className="inline-flex items-center gap-2 text-xs font-mono text-[#d4b07b] hover:text-white transition-colors tracking-widest uppercase cursor-pointer"
          >
            <span>ABOUT CREATORS</span>
            <ArrowUpRight className="w-4 h-4 text-[#8f121d]" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div 
            onClick={() => navigateTo && navigateTo('founders')}
            className="p-8 border border-white/10 bg-[#060609] hover:border-[#8f121d] transition-all cursor-pointer group space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-2xl text-white group-hover:text-[#d4b07b] transition-colors">Numen</h3>
              <span className="font-mono text-xs text-[#8f121d]">3D MODELING & GIMMICK</span>
            </div>
            <p className="font-mono text-xs text-[#a1a1aa] leading-relaxed">
              3Dモデリング、メッシュトポロジー設計、Unityギミック開発およびシステム実装全般を担当。
            </p>
          </div>

          <div 
            onClick={() => navigateTo && navigateTo('founders')}
            className="p-8 border border-white/10 bg-[#060609] hover:border-[#8f121d] transition-all cursor-pointer group space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-2xl text-white group-hover:text-[#d4b07b] transition-colors">MUMEN</h3>
              <span className="font-mono text-xs text-[#8f121d]">DESIGN & TEXTURE</span>
            </div>
            <p className="font-mono text-xs text-[#a1a1aa] leading-relaxed">
              キャラクターコンセプトデザイン、衣装・テクスチャ制作、ブランドPRおよび監修を担当。
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}