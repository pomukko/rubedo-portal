import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import VermiliaPage from './pages/VermiliaPage';
import JournalPage from './pages/JournalPage';
import FoundersPage from './pages/FoundersPage';
import ArchivesPage from './pages/ArchivesPage';
import VoothPage from './pages/VoothPage';
import { CONFIG } from './config/siteConfig';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const [selectedAngle, setSelectedAngle] = useState('FRONT_01');
  const [journalArticles, setJournalArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageTransitioning, setPageTransitioning] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedArticleId, setSelectedArticleId] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); // 全文検索キーワード
  const [isDraftPreview, setIsDraftPreview] = useState(false); // 下書きプレビューフラグ

  const parseLocation = (articlesList = journalArticles) => {
    const path = window.location.pathname;
    const params = new URLSearchParams(window.location.search);

    if (path.startsWith('/journal/') && path.length > 9) {
      const articleId = path.replace('/journal/', '');
      setCurrentPage('journal');
      setSelectedArticleId(articleId);
      return;
    }

    if (path === '/vermilia') {
      setCurrentPage('vermilia');
      setSelectedArticleId(null);
    } else if (path === '/journal') {
      setCurrentPage('journal');
      setSelectedArticleId(null);
    } else if (path === '/vooth') {
      setCurrentPage('vooth');
      setSelectedArticleId(null);
    } else if (path === '/founders') {
      setCurrentPage('founders');
      setSelectedArticleId(null);
    } else if (path === '/archives') {
      setCurrentPage('archives');
      setSelectedArticleId(null);
    } else {
      setCurrentPage('home');
      setSelectedArticleId(null);
    }
  };

  // 🌟 microCMSデータ取得（下書きプレビュー draftKey ＆ 全文検索 q 対応！）
  const fetchArticles = async (query = '') => {
    try {
      const params = new URLSearchParams(window.location.search);
      const draftKey = params.get('draftKey');

      let apiUrl = `https://${CONFIG.SERVICE_DOMAIN}.microcms.io/api/v1/articles?limit=100`;
      
      // 検索キーワードがあればAPIのqパラメータを付与
      if (query) {
        apiUrl += `&q=${encodeURIComponent(query)}`;
      }

      // 下書きプレビューの場合はdraftKeyを付与
      if (draftKey) {
        apiUrl += `&draftKey=${draftKey}`;
        setIsDraftPreview(true);
      }

      const response = await fetch(apiUrl, {
        headers: { 'X-MICROCMS-API-KEY': CONFIG.API_KEY }
      });

      const data = await response.json();

      // 個別プレビューのレスポンス（単体オブジェクト）の場合とリストの場合の両対応
      if (data && !Array.isArray(data) && data.id) {
        setJournalArticles([data]);
        setSelectedArticleId(data.id);
        setCurrentPage('journal');
      } else {
        const fetchedContents = Array.isArray(data.contents) ? data.contents : [];
        setJournalArticles(fetchedContents);
        parseLocation(fetchedContents);
      }

      setTimeout(() => setLoading(false), 800);
    } catch (error) {
      console.error('記事データの取得に失敗しました:', error);
      setJournalArticles([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const handlePopState = () => {
      parseLocation();
      window.scrollTo({ top: 0, behavior: 'instant' });
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

  const navigateTo = (page, category = null, articleId = null) => {
    setIsMenuOpen(false);
    setPageTransitioning(true);

    setTimeout(() => {
      setCurrentPage(page);
      if (category) setActiveTab(category);
      
      let targetPath = '/';

      if (page === 'journal' && articleId) {
        setSelectedArticleId(articleId);
        targetPath = `/journal/${articleId}`;
      } else if (page === 'journal') {
        setSelectedArticleId(null);
        targetPath = '/journal';
      } else if (page === 'vermilia') {
        targetPath = '/vermilia';
      } else if (page === 'vooth') {
        targetPath = '/vooth';
      } else if (page === 'founders') {
        targetPath = '/founders';
      } else if (page === 'archives') {
        targetPath = '/archives';
      } else {
        setSelectedArticleId(null);
        targetPath = '/';
      }

      window.history.pushState({}, '', targetPath);
      window.scrollTo({ top: 0, behavior: 'instant' });

      setTimeout(() => {
        setPageTransitioning(false);
      }, 100);
    }, 500);
  };

  const showLoading = loading || pageTransitioning;
  const selectedArticle = journalArticles.find(a => a.id === selectedArticleId);

  return (
    <div className="min-h-screen bg-[#040406] text-[#e2e2e8] font-sans selection:bg-[#8f121d] selection:text-white relative overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-30 shadow-[inset_0_0_160px_rgba(0,0,0,0.9)]"></div>

      {/* 🌟 下書きプレビューインジケーター（draftKeyで開いている時だけ最上部に点灯！） */}
      {isDraftPreview && (
        <div className="bg-[#8f121d] text-white text-[10px] font-mono tracking-[0.3em] py-1.5 text-center fixed top-0 left-0 right-0 z-[110] flex items-center justify-center gap-2 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
          <span>MICROCMS DRAFT PREVIEW MODE</span>
        </div>
      )}

      {showLoading && (
        <div className="fixed inset-0 bg-[#040406] z-[100] flex flex-col items-center justify-center space-y-8 opacity-100">
          <div className="relative">
            <div className="w-12 h-12 bg-[#8f121d] animate-pulse shadow-[0_0_40px_rgba(143,18,29,0.8)]"></div>
            <div className="absolute inset-0 border border-white/10 scale-150 rotate-45"></div>
          </div>
          <div className="text-center space-y-2">
            <div className="font-serif tracking-[0.6em] text-white text-xl">RUBEDO</div>
            <div className="font-mono text-[9px] text-[#52525b] tracking-[0.3em] uppercase">Connecting to Creative Archive...</div>
          </div>
        </div>
      )}

      {currentPage !== 'vooth' && (
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
      )}

      <main className={isDraftPreview ? 'pt-6' : ''}>
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
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        )}
        {currentPage === 'vooth' && <VoothPage navigateTo={navigateTo} CONFIG={CONFIG} />}
        {currentPage === 'founders' && <FoundersPage navigateTo={navigateTo} LINKS={CONFIG.LINKS} />}
        {currentPage === 'archives' && <ArchivesPage navigateTo={navigateTo} LINKS={CONFIG.LINKS} />}
      </main>

      {currentPage !== 'vooth' && <Footer />}
    </div>
  );
}
