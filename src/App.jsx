import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import VermiliaPage from './pages/VermiliaPage';
import JournalPage from './pages/JournalPage';
import FoundersPage from './pages/FoundersPage';
import ArchivesPage from './pages/ArchivesPage';
import { CONFIG } from './config/siteConfig';

export default function App() {
  // ルーティング・画面状態
  const [currentPage, setCurrentPage] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  // ヴェルミリア ビューポート状態
  const [selectedAngle, setSelectedAngle] = useState('FRONT_01');
  
  // microCMSデータ管理用の状態
  const [journalArticles, setJournalArticles] = useState([]);
  const [loading, setLoading] = useState(true); // 初期ロード用
  const [pageTransitioning, setPageTransitioning] = useState(false); // 画面遷移用ローディング
  const [activeTab, setActiveTab] = useState('all');
  const [selectedArticleId, setSelectedArticleId] = useState(null);

  // 🌟 URLのパス（/entry/xxx など）を解析して状態を同期する関数
  const parseLocation = (articlesList = journalArticles) => {
    const path = window.location.pathname;
    const params = new URLSearchParams(window.location.search);

    // /entry/記事ID の形式
    if (path.startsWith('/entry/')) {
      const articleId = path.replace('/entry/', '');
      setCurrentPage('journal');
      setSelectedArticleId(articleId);
      return;
    }

    // 従来型の ?article=記事ID のフォールバック対応
    const articleParam = params.get('article');
    if (articleParam) {
      setCurrentPage('journal');
      setSelectedArticleId(articleParam);
      return;
    }

    // その他のページパス対応
    if (path === '/vermilia') {
      setCurrentPage('vermilia');
    } else if (path === '/journal') {
      setCurrentPage('journal');
      setSelectedArticleId(null);
    } else if (path === '/founders') {
      setCurrentPage('founders');
    } else if (path === '/archives') {
      setCurrentPage('archives');
    } else {
      setCurrentPage('home');
      setSelectedArticleId(null);
    }
  };

  // 🌟 microCMSデータ取得＆初回URL解析
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(`https://${CONFIG.SERVICE_DOMAIN}.microcms.io/api/v1/articles`, {
          headers: { 'X-MICROCMS-API-KEY': CONFIG.API_KEY }
        });
        const data = await response.json();
        const fetchedContents = Array.isArray(data.contents) ? data.contents : [];
        
        setJournalArticles(fetchedContents);
        parseLocation(fetchedContents);

        setTimeout(() => setLoading(false), 1000); // シネマティック初期ロード
      } catch (error) {
        console.error('記事データの取得に失敗しました:', error);
        setJournalArticles([]);
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // 🌟 ブラウザの「戻る・進む」ボタンが押された時の処理
  useEffect(() => {
    const handlePopState = () => {
      parseLocation();
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [journalArticles]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
  }, [isMenuOpen]);

  // 🌟 シネマティックローディングを挟むシームレス遷移関数！
  const navigateTo = (page, category = null, articleId = null) => {
    setIsMenuOpen(false);
    
    // 遷移ローディングアニメーション開始！
    setPageTransitioning(true);

    setTimeout(() => {
      setCurrentPage(page);
      if (category) setActiveTab(category);
      
      let targetPath = '/';

      if (page === 'journal' && articleId) {
        setSelectedArticleId(articleId);
        targetPath = `/entry/${articleId}`;
      } else if (page === 'journal') {
        setSelectedArticleId(null);
        targetPath = '/journal';
      } else if (page === 'vermilia') {
        targetPath = '/vermilia';
      } else if (page === 'founders') {
        targetPath = '/founders';
      } else if (page === 'archives') {
        targetPath = '/archives';
      } else {
        setSelectedArticleId(null);
        targetPath = '/';
      }

      // ブラウザのURL欄をきれいに更新！
      window.history.pushState({}, '', targetPath);
      window.scrollTo({ top: 0, behavior: 'instant' });

      // ローディング終了！
      setTimeout(() => {
        setPageTransitioning(false);
      }, 300);
    }, 600); // 0.6秒間シネマティックローディングを見せる
  };

  // 🌟 シネマティック・ローディング（初期ロード＆画面遷移）
  if (loading || pageTransitioning) {
    return (
      <div className="min-h-screen bg-[#040406] flex flex-col items-center justify-center space-y-8 animate-fadeIn fixed inset-0 z-50">
        <div className="relative">
          <div className="w-12 h-12 bg-[#8f121d] animate-pulse shadow-[0_0_40px_rgba(143,18,29,0.8)]"></div>
          <div className="absolute inset-0 border border-white/10 scale-150 rotate-45"></div>
        </div>
        <div className="text-center space-y-2">
          <div className="font-serif tracking-[0.6em] text-white text-xl">RUBEDO</div>
          <div className="font-mono text-[9px] text-[#52525b] tracking-[0.3em] uppercase">Connecting to Creative Archive...</div>
        </div>
      </div>
    );
  }

  const selectedArticle = journalArticles.find(a => a.id === selectedArticleId);

  return (
    <div className="min-h-screen bg-[#040406] text-[#e2e2e8] font-sans selection:bg-[#8f121d] selection:text-white relative overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-30 shadow-[inset_0_0_160px_rgba(0,0,0,0.9)]"></div>

      {/* HEADER */}
      <Header 
        currentPage={currentPage}
        navigateTo={navigateTo}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        scrolled={scrolled}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        CONFIG={CONFIG}
      />

      {/* PAGE ROUTING */}
      <main>
        {currentPage === 'home' && (
          <HomePage 
            navigateTo={navigateTo} 
            articles={journalArticles} 
            setSelectedArticleId={setSelectedArticleId}
            selectedAngle={selectedAngle}
            setSelectedAngle={setSelectedAngle}
            CONFIG={CONFIG}
          />
        )}
        {currentPage === 'vermilia' && (
          <VermiliaPage 
            navigateTo={navigateTo} 
            selectedAngle={selectedAngle} 
            setSelectedAngle={setSelectedAngle} 
            LINKS={CONFIG.LINKS}
          />
        )}
        {currentPage === 'journal' && (
          <JournalPage 
            journalArticles={journalArticles} 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            selectedArticle={selectedArticle} 
            setSelectedArticleId={setSelectedArticleId} 
            navigateTo={navigateTo}
          />
        )}
        {currentPage === 'founders' && <FoundersPage navigateTo={navigateTo} LINKS={CONFIG.LINKS} />}
        {currentPage === 'archives' && <ArchivesPage navigateTo={navigateTo} LINKS={CONFIG.LINKS} />}
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
