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
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedArticleId, setSelectedArticleId] = useState(null);

  // microCMSデータ取得
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(`https://${CONFIG.SERVICE_DOMAIN}.microcms.io/api/v1/articles`, {
          headers: { 'X-MICROCMS-API-KEY': CONFIG.API_KEY }
        });
        const data = await response.json();
        
        setJournalArticles(Array.isArray(data.contents) ? data.contents : []);
        
        const params = new URLSearchParams(window.location.search);
        const articleParam = params.get('article');
        if (articleParam) {
          setCurrentPage('journal');
          setSelectedArticleId(articleParam);
        }

        setTimeout(() => setLoading(false), 1000);
      } catch (error) {
        console.error('記事データの取得に失敗しました:', error);
        setJournalArticles([]);
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
  }, [isMenuOpen]);

  const navigateTo = (page, category = null, articleId = null) => {
    setCurrentPage(page);
    if (category) setActiveTab(category);
    if (articleId !== undefined) setSelectedArticleId(articleId);
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // シネマティック・ローディング表示
  if (loading) {
    return (
      <div className="min-h-screen bg-[#040406] flex flex-col items-center justify-center space-y-8 animate-fadeIn">
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
