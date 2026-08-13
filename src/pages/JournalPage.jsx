import React, { useState, useMemo, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Search, List, Image as ImageIcon, Link as LinkIcon, Tag, User, Layers, Clock, Copy, Check, Share2, X, RefreshCw } from 'lucide-react';
import { formatDate, getCategoryName, getSubCategories, getAuthorName, optimizeImage } from '../utils/formatters';

const SUB_CATEGORIES_MAP = {
  'CREATIVE / 3DCG': [
    'VRChat',
    'Blender & 3D',
    'Shader & Material',
    'Gimmick & SDK',
    'Unity & UE5'
  ],
  'NEWS / RELEASE': [
    'Update',
    'Event & Info',
    'Dialogue & Note'
  ],
  'LAB / RESEARCH': [
    'Mental & Mind',
    'Nutrition & Cooking',
    'Essay & Philosophy',
    'Physical & Tuning',
    'Self Experiment'
  ]
};

// 🌟【完全修正版】画面中央固定 ＆ 黒スモーク ＆ 完璧スクロールロック対応ライトボックス
function ImageLightboxModal({ src, onClose }) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  // 背景スクロールを完全ロック ＆ ホイールイベントによる画面移動を禁止
  useEffect(() => {
    const originalStyle = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e) => {
      e.preventDefault();
      e.stopPropagation();

      const delta = -e.deltaY * 0.002;
      setScale((prevScale) => {
        const nextScale = Math.min(Math.max(1, prevScale + delta), 5);
        if (nextScale === 1) setPosition({ x: 0, y: 0 });
        return nextScale;
      });
    };

    // passive: false で画面スクロールを物理的に絶対防止
    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      document.body.style.overflow = originalStyle;
      container.removeEventListener('wheel', handleWheel);
    };
  }, []);

  // ESCキーで閉じる
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleMouseDown = (e) => {
    if (scale <= 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || scale <= 1) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const resetZoom = (e) => {
    if (e) e.stopPropagation();
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  // createPortalで document.body 直下にレンダリングし、画面の中心に100%固定！
  return createPortal(
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center overflow-hidden select-none"
      style={{ top: 0, left: 0, width: '100vw', height: '100vh' }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* 閉じる ＆ リセットボタン */}
      <div className="absolute top-6 right-6 z-[10000] flex items-center gap-3">
        {scale > 1 && (
          <button 
            onClick={resetZoom}
            className="text-xs font-mono text-white bg-white/10 px-3.5 py-2 rounded-full hover:bg-[#8f121d] transition-colors cursor-pointer border border-white/20 flex items-center gap-1.5 shadow-xl"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>RESET ({Math.round(scale * 100)}%)</span>
          </button>
        )}
        <button 
          onClick={onClose}
          className="text-white bg-white/10 p-2.5 rounded-full hover:bg-[#8f121d] transition-colors cursor-pointer border border-white/20 shadow-xl"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* 操作ガイド */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[10000] bg-black/80 border border-white/20 px-5 py-2 text-[11px] font-mono text-[#d1d1d6] pointer-events-none rounded-full shadow-xl">
        ホイールで拡大縮小 / ドラッグで移動 / 背景クリックで閉じる
      </div>

      {/* 画像本体 */}
      <div 
        className={`w-full h-full flex items-center justify-center p-4 ${scale > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-zoom-out'}`}
        onMouseDown={handleMouseDown}
        onClick={(e) => {
          if (e.target === e.currentTarget && !isDragging) onClose();
        }}
      >
        <img 
          src={src} 
          alt="Zoomed" 
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transition: isDragging ? 'none' : 'transform 0.1s ease-out',
            maxHeight: '88vh',
            maxWidth: '88vw',
            objectFit: 'contain'
          }}
          className="shadow-2xl border border-white/10 pointer-events-auto" 
          draggable={false}
        />
      </div>
    </div>,
    document.body
  );
}

export default function JournalPage({ 
  journalArticles = [], 
  activeTab, 
  setActiveTab, 
  selectedArticle, 
  setSelectedArticleId,
  navigateTo,
  searchQuery,
  setSearchQuery
}) {
  const categories = ['all', 'CREATIVE / 3DCG', 'NEWS / RELEASE', 'LAB / RESEARCH'];
  const [activeSubTab, setActiveSubTab] = useState('all');
  const [page, setPage] = useState(1);
  const [lightboxImg, setLightboxImg] = useState(null);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const articleBodyRef = useRef(null);
  const ITEMS_PER_PAGE = 12;

  const handleMainTabChange = (cat) => {
    setActiveTab(cat);
    setActiveSubTab('all');
    setPage(1);
  };

  const handleSubTabChange = (subCat) => {
    setActiveSubTab(subCat);
    setPage(1);
  };

  const currentSubCategories = useMemo(() => {
    if (activeTab === 'all') {
      return [];
    }
    return SUB_CATEGORIES_MAP[activeTab] || [];
  }, [activeTab]);

  const sortedArticles = useMemo(() => {
    return [...journalArticles].sort((a, b) => {
      const dateA = new Date(a?.publishedAt || a?.createdAt || a?.updatedAt || 0);
      const dateB = new Date(b?.publishedAt || b?.createdAt || b?.updatedAt || 0);
      return dateB - dateA;
    });
  }, [journalArticles]);

  const filteredArticles = useMemo(() => {
    return sortedArticles.filter(a => {
      const catName = getCategoryName(a?.category);
      const subCatList = getSubCategories(a);

      const matchMain = activeTab === 'all' || catName.trim().toLowerCase() === activeTab.trim().toLowerCase();
      const matchSub = activeSubTab === 'all' || subCatList.some(s => typeof s === 'string' && s.trim().toLowerCase() === activeSubTab.trim().toLowerCase());

      return matchMain && matchSub;
    });
  }, [sortedArticles, activeTab, activeSubTab]);

  const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE) || 1;
  const paginatedArticles = filteredArticles.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleArticleClick = (articleId) => {
    if (typeof navigateTo === 'function') {
      navigateTo('journal', null, articleId);
    } else if (typeof setSelectedArticleId === 'function') {
      setSelectedArticleId(articleId);
    }
  };

  const handleBackToList = () => {
    if (typeof navigateTo === 'function') {
      navigateTo('journal', null, null);
    } else if (typeof setSelectedArticleId === 'function') {
      setSelectedArticleId(null);
    }
  };

  // ⏱️ 読了時間 ＆ 文字数計算
  const readTimeStats = useMemo(() => {
    if (!selectedArticle?.body) return { minutes: 1, count: 0 };
    const plainText = selectedArticle.body.replace(/<[^>]+>/g, '').replace(/\s+/g, '');
    const count = plainText.length;
    const minutes = Math.max(1, Math.ceil(count / 600));
    return { minutes, count };
  }, [selectedArticle]);

  // 前の記事 / 次の記事 取得
  const { prevArticle, nextArticle } = useMemo(() => {
    if (!selectedArticle) return { prevArticle: null, nextArticle: null };
    const idx = sortedArticles.findIndex(a => a.id === selectedArticle.id);
    if (idx === -1) return { prevArticle: null, nextArticle: null };
    return {
      prevArticle: sortedArticles[idx + 1] || null,
      nextArticle: sortedArticles[idx - 1] || null
    };
  }, [selectedArticle, sortedArticles]);

  // 自動目次抽出 (H1, H2, H3)
  const tocList = useMemo(() => {
    if (!selectedArticle?.body) return [];
    const html = selectedArticle.body;
    const regex = /<h([123])\b[^>]*>(.*?)<\/h[123]>/gi;
    const items = [];
    let match;
    let index = 0;

    while ((match = regex.exec(html)) !== null) {
      const level = parseInt(match[1], 10);
      const rawText = match[2].replace(/<[^>]+>/g, '');
      if (rawText.trim()) {
        items.push({
          id: `heading-${index++}`,
          level,
          text: rawText.trim()
        });
      }
    }
    return items;
  }, [selectedArticle]);

  // ヘッダー高さを考慮した目次ジャンプ
  const scrollToHeading = (text) => {
    const headings = document.querySelectorAll('.article-body h1, .article-body h2, .article-body h3');
    for (let h of headings) {
      if (h.textContent.trim() === text) {
        const HEADER_OFFSET = 150;
        const elementPosition = h.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - HEADER_OFFSET;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        break;
      }
    }
  };

  // 本文内画像クリック ＆ コードコピー機能の初期化
  useEffect(() => {
    if (!selectedArticle || !articleBodyRef.current) return;

    const images = articleBodyRef.current.querySelectorAll('img');
    images.forEach(img => {
      img.onclick = () => setLightboxImg(img.src);
    });

    const pres = articleBodyRef.current.querySelectorAll('pre');
    pres.forEach((pre) => {
      if (pre.parentNode.classList.contains('code-wrapper')) return;

      const wrapper = document.createElement('div');
      wrapper.className = 'code-wrapper relative group';
      pre.parentNode.insertBefore(wrapper, pre);
      wrapper.appendChild(pre);

      const btn = document.createElement('button');
      btn.className = 'absolute top-3 right-3 bg-white/10 hover:bg-[#8f121d] text-white text-[10px] font-mono px-2.5 py-1 transition-all cursor-pointer border border-white/10 flex items-center gap-1.5 opacity-80 group-hover:opacity-100';
      btn.innerHTML = `<span>COPY</span>`;
      btn.onclick = () => {
        navigator.clipboard.writeText(pre.innerText);
        btn.innerHTML = `<span class="text-[#d4b07b]">COPIED!</span>`;
        setTimeout(() => {
          btn.innerHTML = `<span>COPY</span>`;
        }, 2000);
      };
      wrapper.appendChild(btn);
    });
  }, [selectedArticle]);

  const handleShareX = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`「${selectedArticle?.title || ''}」- RUBEDO PORTAL`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  // 記事詳細表示時
  if (selectedArticle) {
    const articleDate = formatDate(selectedArticle.publishedAt || selectedArticle.createdAt || selectedArticle.updatedAt);
    const categoryName = getCategoryName(selectedArticle.category);
    const subCategories = getSubCategories(selectedArticle);
    const authorName = getAuthorName(selectedArticle.author);

    const rawMultipleImages = selectedArticle.images || selectedArticle.gallery || selectedArticle.multiple_images || selectedArticle.multipleImages || [];
    const multipleImages = Array.isArray(rawMultipleImages) ? rawMultipleImages : [];

    const rawTags = selectedArticle.tags || selectedArticle.tag_list || [];
    const tags = Array.isArray(rawTags) 
      ? rawTags.map(t => (typeof t === 'object' ? t.name || t.title || t.id : String(t)))
      : (typeof rawTags === 'string' ? rawTags.split(',') : []);

    const rawRelated = selectedArticle.related || selectedArticle.related_articles || selectedArticle.relatedArticles || [];
    const relatedArticles = Array.isArray(rawRelated) ? rawRelated : (typeof rawRelated === 'object' ? [rawRelated] : []);

    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-8 pt-36 sm:pt-44 pb-32 space-y-12 animate-fadeIn w-full overflow-hidden">
        {/* 一覧に戻るボタン */}
        <button 
          onClick={handleBackToList} 
          className="inline-flex items-center gap-2 font-mono text-xs text-[#a1a1aa] hover:text-white transition-colors tracking-widest cursor-pointer group border border-white/10 px-4 py-2 bg-white/[0.02] hover:border-[#8f121d]"
        >
          <ArrowLeft className="w-4 h-4 text-[#8f121d] group-hover:-translate-x-1 transition-transform" /> 
          <span>RETURN TO JOURNAL LIST</span>
        </button>

        {/* 記事ヘッダー情報 */}
        <div className="space-y-6 border-b border-white/10 pb-8 w-full overflow-hidden">
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[#a1a1aa]">
            <span className="bg-[#8f121d] text-white px-3 py-1 font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(143,18,29,0.5)] break-all">
              {categoryName}
            </span>

            {subCategories.map((subName, idx) => (
              <span key={idx} className="border border-[#d4b07b]/60 text-[#d4b07b] bg-[#d4b07b]/10 px-3 py-1 font-semibold tracking-wider break-all">
                {subName}
              </span>
            ))}

            {articleDate && <span className="tracking-widest ml-2">{articleDate}</span>}
            
            <div className="flex items-center gap-1.5 text-[#a1a1aa] border-l border-white/10 pl-3">
              <Clock className="w-3.5 h-3.5 text-[#d4b07b]" />
              <span>約{readTimeStats.minutes}分（{readTimeStats.count.toLocaleString()}文字）</span>
            </div>

            <div className="flex items-center gap-2 border-l border-white/10 pl-3 text-[#d4b07b]">
              <User className="w-3.5 h-3.5 text-[#8f121d]" />
              <span>BY {authorName}</span>
            </div>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl text-white font-normal leading-[1.3] tracking-wide break-all [overflow-wrap:anywhere]">
            {selectedArticle.title || 'Untitled'}
          </h1>

          {tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <Tag className="w-3.5 h-3.5 text-[#d4b07b]" />
              {tags.map((tag, idx) => (
                <span key={idx} className="text-[10px] font-mono text-[#a1a1aa] border border-white/10 px-2.5 py-0.5 bg-white/[0.01]">
                  #{tag.trim()}
                </span>
              ))}
            </div>
          )}

          {selectedArticle.lead && (
            <p className="text-lg sm:text-xl text-[#d4b07b]/90 border-l-2 border-[#8f121d] pl-5 py-1.5 font-light leading-relaxed italic bg-[#8f121d]/[0.03] break-all [overflow-wrap:anywhere]">
              {selectedArticle.lead}
            </p>
          )}
        </div>

        {/* アイキャッチ画像 */}
        {selectedArticle.eyecatch?.url && (
          <div className="w-full my-6">
            <img 
              src={optimizeImage(selectedArticle.eyecatch.url)} 
              alt={selectedArticle.title || ''} 
              onClick={() => setLightboxImg(selectedArticle.eyecatch.url)}
              className="webtoon-image border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] cursor-zoom-in" 
            />
          </div>
        )}

        {/* 上下余白 ＆ 高級グラデーション区切り線付き目次 */}
        {tocList.length > 0 && (
          <div className="my-14 space-y-8">
            <hr className="border-0 h-[1px] bg-gradient-to-r from-[#8f121d]/80 via-white/15 to-transparent my-0" />

            <div className="bg-[#060609] border border-[#8f121d]/40 p-6 sm:p-8 space-y-4 my-0 relative overflow-hidden shadow-[0_0_30px_rgba(143,18,29,0.1)]">
              <div className="flex items-center gap-2.5 text-xs font-mono tracking-[0.3em] text-[#d4b07b] border-b border-white/10 pb-3">
                <List className="w-4 h-4 text-[#8f121d]" />
                <span>INDEX / 目次</span>
              </div>
              <ul className="space-y-2.5 font-mono text-xs text-[#a1a1aa]">
                {tocList.map((item, idx) => (
                  <li 
                    key={idx} 
                    onClick={() => scrollToHeading(item.text)}
                    className={`cursor-pointer hover:text-white transition-colors flex items-center gap-2 ${
                      item.level === 3 ? 'pl-6 text-[11px] text-[#71717a]' : item.level === 2 ? 'pl-3 font-medium text-[#e2e2e8]' : 'font-bold text-white'
                    }`}
                  >
                    <span className="text-[#8f121d] text-[9px]">►</span>
                    <span className="hover:underline underline-offset-4 decoration-[#8f121d]">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            <hr className="border-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-[#8f121d]/80 my-0" />
          </div>
        )}

        {/* リッチテキスト本文 */}
        <div 
          ref={articleBodyRef}
          className="article-body max-w-none w-full overflow-hidden"
          dangerouslySetInnerHTML={{ __html: selectedArticle.body || '<p class="text-[#71717a]">本文がありません。</p>' }}
        />

        {/* 𝕏 シェア ＆ URLコピーエリア */}
        <div className="pt-8 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs font-mono text-[#a1a1aa] uppercase tracking-widest">
            SHARE THIS ARCHIVE
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleShareX}
              className="px-4 py-2 bg-white/5 border border-white/10 text-white text-xs font-mono flex items-center gap-2 hover:bg-[#8f121d] hover:border-[#8f121d] transition-all cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>POST ON 𝕏</span>
            </button>
            <button 
              onClick={handleCopyUrl}
              className="px-4 py-2 bg-white/5 border border-white/10 text-white text-xs font-mono flex items-center gap-2 hover:border-[#d4b07b] hover:text-[#d4b07b] transition-all cursor-pointer"
            >
              {copiedUrl ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedUrl ? 'COPIED!' : 'COPY URL'}</span>
            </button>
          </div>
        </div>

        {/* 前の記事 / 次の記事 ナビゲーション */}
        {(prevArticle || nextArticle) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-10 border-t border-white/10">
            {nextArticle ? (
              <div 
                onClick={() => handleArticleClick(nextArticle.id)}
                className="bg-[#060609] border border-white/10 p-6 space-y-2 cursor-pointer hover:border-[#8f121d] transition-all group"
              >
                <span className="text-[10px] font-mono text-[#8f121d] flex items-center gap-1">
                  <ArrowLeft className="w-3 h-3" /> NEXT ARCHIVE (NEWER)
                </span>
                <h4 className="font-serif text-sm text-white group-hover:text-[#d4b07b] transition-colors line-clamp-1">
                  {nextArticle.title}
                </h4>
              </div>
            ) : <div />}

            {prevArticle && (
              <div 
                onClick={() => handleArticleClick(prevArticle.id)}
                className="bg-[#060609] border border-white/10 p-6 space-y-2 cursor-pointer hover:border-[#8f121d] transition-all group text-right"
              >
                <span className="text-[10px] font-mono text-[#8f121d] flex items-center justify-end gap-1">
                  PREV ARCHIVE (OLDER) <ArrowRight className="w-3 h-3" />
                </span>
                <h4 className="font-serif text-sm text-white group-hover:text-[#d4b07b] transition-colors line-clamp-1">
                  {prevArticle.title}
                </h4>
              </div>
            )}
          </div>
        )}

        {/* 複数画像ギャラリー */}
        {multipleImages.length > 0 && (
          <div className="space-y-6 pt-10 border-t border-white/10">
            <div className="flex items-center gap-2 text-xs font-mono text-[#d4b07b] tracking-widest uppercase">
              <ImageIcon className="w-4 h-4 text-[#8f121d]" />
              <span>ARCHIVE GALLERY ({multipleImages.length})</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {multipleImages.map((imgObj, idx) => {
                const imgUrl = typeof imgObj === 'string' ? imgObj : imgObj?.url;
                if (!imgUrl) return null;
                return (
                  <div key={idx} onClick={() => setLightboxImg(imgUrl)} className="aspect-square bg-[#060609] border border-white/10 overflow-hidden group relative cursor-zoom-in">
                    <img 
                      src={optimizeImage(imgUrl)} 
                      alt={`Gallery Image ${idx + 1}`} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 関連記事 */}
        {relatedArticles.length > 0 && (
          <div className="space-y-6 pt-10 border-t border-white/10">
            <div className="flex items-center gap-2 text-xs font-mono text-[#d4b07b] tracking-widest uppercase">
              <LinkIcon className="w-4 h-4 text-[#8f121d]" />
              <span>RELATED ARCHIVES</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {relatedArticles.map((relItem, idx) => {
                if (!relItem || typeof relItem !== 'object') return null;
                return (
                  <div 
                    key={idx} 
                    onClick={() => handleArticleClick(relItem.id)}
                    className="bg-[#060609] border border-white/10 p-6 space-y-3 cursor-pointer hover:border-[#8f121d] transition-all group"
                  >
                    <span className="text-[9px] font-mono text-[#8f121d] uppercase block">RECOMMENDED</span>
                    <h4 className="font-serif text-lg text-white group-hover:text-[#d4b07b] transition-colors line-clamp-2">
                      {relItem.title || 'Untitled Article'}
                    </h4>
                    {relItem.lead && <p className="text-xs text-[#a1a1aa] line-clamp-2 font-light">{relItem.lead}</p>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* フッターナビ */}
        <div className="pt-12 border-t border-white/10 flex justify-between items-center">
          <button 
            onClick={handleBackToList} 
            className="inline-flex items-center gap-2 font-mono text-xs text-[#d4b07b] hover:text-white transition-colors tracking-widest cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#8f121d]" /> 
            <span>RETURN TO JOURNAL LIST</span>
          </button>
        </div>

        {/* 🔍【完全解決版】画面中央固定 ＆ スクロール非連動ライトボックス */}
        {lightboxImg && (
          <ImageLightboxModal 
            src={lightboxImg} 
            onClose={() => setLightboxImg(null)} 
          />
        )}
      </div>
    );
  }

  // 記事一覧表示時
  return (
    <div className="pt-36 pb-32 max-w-7xl mx-auto px-8 sm:px-12 space-y-10 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-8 gap-6">
        <div className="space-y-4">
          <h1 className="font-serif text-5xl sm:text-7xl text-white">JOURNAL & HOW-TO</h1>
        </div>

        {/* 全文検索バー */}
        <div className="relative w-full md:w-80">
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="記事をキーワード検索..."
            className="w-full bg-[#060609] border border-white/10 px-4 py-2.5 text-xs text-white placeholder-[#71717a] font-mono focus:outline-none focus:border-[#8f121d] transition-colors pl-10"
          />
          <Search className="w-4 h-4 text-[#71717a] absolute left-3 top-1/2 -translate-y-1/2" />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#71717a] hover:text-white font-mono cursor-pointer"
            >
              CLEAR
            </button>
          )}
        </div>
      </div>
      
      {/* 1段目：メインカテゴリーの切り替えタブ */}
      <div className="space-y-4">
        <div className="flex flex-wrap gap-3 text-xs font-mono">
          {categories.map(cat => (
            <button 
              key={cat} 
              onClick={() => handleMainTabChange(cat)} 
              className={`px-5 py-2.5 border uppercase transition-all cursor-pointer ${
                activeTab.toLowerCase() === cat.toLowerCase() 
                  ? 'border-[#8f121d] bg-[#8f121d] text-white font-bold shadow-[0_0_15px_rgba(143,18,29,0.5)]' 
                  : 'border-white/10 text-[#71717a] hover:text-white hover:border-white/30'
              }`}
            >
              {cat === 'all' ? 'ALL ARCHIVES' : cat}
            </button>
          ))}
        </div>

        {/* 2段目：個別メインカテゴリー選択時のみ表示されるサブタグバー */}
        {currentSubCategories.length > 0 && (
          <div className="bg-[#060609] border border-white/10 p-4 flex flex-wrap items-center gap-2 text-xs font-mono animate-fadeIn">
            <div className="flex items-center gap-1.5 text-[#d4b07b] mr-3 font-bold border-r border-white/10 pr-4">
              <Layers className="w-3.5 h-3.5 text-[#8f121d]" />
              <span>SUB-CATEGORY:</span>
            </div>

            <button
              onClick={() => handleSubTabChange('all')}
              className={`px-3 py-1 rounded-none border transition-all cursor-pointer ${
                activeSubTab === 'all'
                  ? 'border-[#d4b07b] bg-[#d4b07b]/20 text-white font-bold'
                  : 'border-white/10 text-[#71717a] hover:text-white'
              }`}
            >
              ALL SUB
            </button>

            {currentSubCategories.map(subCat => (
              <button
                key={subCat}
                onClick={() => handleSubTabChange(subCat)}
                className={`px-3 py-1 rounded-none border transition-all cursor-pointer ${
                  activeSubTab.toLowerCase() === subCat.toLowerCase()
                    ? 'border-[#d4b07b] bg-[#d4b07b]/20 text-white font-bold'
                    : 'border-white/10 text-[#71717a] hover:text-white'
                }`}
              >
                #{subCat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 記事一覧グリッド表示 */}
      {filteredArticles.length === 0 ? (
        <div className="py-20 text-center space-y-4 border border-white/5 bg-[#060609]">
          <p className="font-serif text-lg text-[#71717a]">
            {searchQuery ? `「${searchQuery}」に一致する記事が見つかりませんでした。` : '該当するカテゴリーの記事が見つかりませんでした。'}
          </p>
          <p className="font-mono text-xs text-[#52525b]">NO ARTICLES FOUND IN THIS CATEGORY.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {paginatedArticles.map(article => {
              const articleDate = formatDate(article?.publishedAt || article?.createdAt || article?.updatedAt);
              const categoryName = getCategoryName(article?.category);
              const subCategories = getSubCategories(article);
              const eyecatchUrl = article?.eyecatch?.url;
              const authorName = getAuthorName(article?.author);

              const displaySubCategories = activeSubTab === 'all'
                ? []
                : subCategories.filter(s => typeof s === 'string' && s.trim().toLowerCase() === activeSubTab.trim().toLowerCase());

              return (
                <article 
                  key={article.id} 
                  onClick={() => handleArticleClick(article.id)} 
                  className="bg-[#060609] border border-[#white/10] overflow-hidden flex flex-col justify-between hover:border-[#8f121d]/70 transition-all cursor-pointer group shadow-lg"
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

                  <div className="p-8 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-4">
                      {/* メイン ＆ 選択時のみのサブカテゴリーバッジ表示 */}
                      <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[10px]">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-[#8f121d] font-bold break-all">{categoryName}</span>
                          {displaySubCategories.map((subName, sIdx) => (
                            <span key={sIdx} className="text-[#d4b07b] border border-[#d4b07b]/30 px-1.5 py-0.5 bg-[#d4b07b]/5 break-all">
                              #{subName}
                            </span>
                          ))}
                        </div>
                        <span className="text-[#71717a]">{articleDate}</span>
                      </div>

                      <h3 className="font-serif text-xl text-white group-hover:text-[#d4b07b] transition-colors line-clamp-2 break-all">
                        {article.title || 'Untitled'}
                      </h3>
                      <p className="text-xs text-[#a1a1aa] line-clamp-3 font-light leading-relaxed break-all">
                        {article.lead || ''}
                      </p>
                    </div>
                    
                    <div className="pt-6 mt-6 border-t border-white/5 flex justify-between font-mono text-[10px] text-[#71717a]">
                      <span>BY {authorName}</span>
                      <span className="text-white flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        READ <ArrowRight className="w-3.5 h-3.5 text-[#8f121d]"/>
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="pt-16 border-t border-white/10 flex justify-center items-center gap-3 font-mono text-xs">
              <button 
                onClick={() => handlePageChange(page - 1)} 
                disabled={page === 1}
                className="p-3 border border-white/10 text-white disabled:opacity-30 hover:border-[#8f121d] transition-all disabled:hover:border-white/10 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(pNum => (
                <button
                  key={pNum}
                  onClick={() => handlePageChange(pNum)}
                  className={`w-10 h-10 border transition-all cursor-pointer ${
                    page === pNum 
                      ? 'border-[#8f121d] bg-[#8f121d] text-white font-bold shadow-[0_0_15px_rgba(143,18,29,0.5)]' 
                      : 'border-white/10 text-[#a1a1aa] hover:border-white/30 hover:text-white'
                  }`}
                >
                  {pNum}
                </button>
              ))}

              <button 
                onClick={() => handlePageChange(page + 1)} 
                disabled={page === totalPages}
                className="p-3 border border-white/10 text-white disabled:opacity-30 hover:border-[#8f121d] transition-all disabled:hover:border-white/10 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
