import React, { useState, useMemo, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Search, List, Image as ImageIcon, Link as LinkIcon, Tag, User, Layers, Clock, Copy, Check, Share2, X, RefreshCw } from 'lucide-react';
import { formatDate, getCategoryName, getSubCategories, getAuthorName, optimizeImage, getSingleImageUrl, getMultipleImageUrls } from '../utils/formatters';

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

// 画面中央固定 ＆ スクロール非連動ライトボックス
function ImageLightboxModal({ src, onClose }) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  useEffect(() => {
    if (typeof document === 'undefined') return;
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

    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      document.body.style.overflow = originalStyle;
      container.removeEventListener('wheel', handleWheel);
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
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

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center overflow-hidden select-none"
      style={{ top: 0, left: 0, width: '100vw', height: '100vh' }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
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

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[10000] bg-black/80 border border-white/20 px-5 py-2 text-[11px] font-mono text-[#d1d1d6] pointer-events-none rounded-full shadow-xl">
        ホイールで拡大縮小 / ドラッグで移動 / 背景クリックで閉じる
      </div>

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
      const catName = getCategoryName(a);
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
