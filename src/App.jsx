import React, { useState, useEffect } from 'react';
import { 
  ArrowUpRight, ChevronRight, Menu, X, ExternalLink, Aperture,
  Compass, Box, Volume2, VolumeX, ArrowRight, ArrowLeft,
  BookOpen, Filter, ShieldCheck, Heart, Sparkles, FileText,
  Clock, User, List, MessageSquare
} from 'lucide-react';

export default function App() {
  // ルーティング・画面状態
  const [currentPage, setCurrentPage] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  // ヴェルミリア ビューポート状態
  const [selectedAngle, setSelectedAngle] = useState('FRONT_01');
  
  // 🌟 microCMSデータ管理用の状態
  const [journalArticles, setJournalArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedArticleId, setSelectedArticleId] = useState(null);

  // 🔗 決定した公式URL・API接続情報
  const CONFIG = {
    SERVICE_DOMAIN: 'rubedo',
    API_KEY: 'k9QtCRl15P3IEH9GOSfrQ2ULEspVtCnwv3Bi',
    LINKS: {
      numenX: 'https://x.com/Numen_rubedovrc',
      mumenX: 'https://x.com/__MUMEN',
      boothStore: 'https://rubedo0.booth.pm/',
      vermiliaItem: 'https://rubedo0.booth.pm/items/8165350',
      discordServer: 'https://discord.com/invite/tNS6Whqf5P',
      ethicalRulebook: 'https://verguide.pages.dev/Joint_Ethical_Rulebook',
      loveAlpaca: 'https://verguide.pages.dev/lovealpaca',
      vermiliaGuideline: 'https://verguide.pages.dev/vermilia_guideline',
      braveryAlpaca: 'https://verguide.pages.dev/braveryalpaca',
      vermiliaExhibition: 'https://verguide.pages.dev/vermilia_exhibition'
    }
  };

  // 🌟 ページが開かれた瞬間にmicroCMSからデータを取ってくる処理（フェーズ3）
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(`https://${CONFIG.SERVICE_DOMAIN}.microcms.io/api/v1/articles`, {
          headers: { 'X-MICROCMS-API-KEY': CONFIG.API_KEY }
        });
        const data = await response.json();
        
        // 取ってきた本物の記事データを状態にセット
        setJournalArticles(data.contents);
        
        // 外部アプリ（スキルツリーTodo）からのURLパラメータ「?article=記事ID」の解析
        const params = new URLSearchParams(window.location.search);
        const articleParam = params.get('article');
        if (articleParam) {
          setCurrentPage('journal');
          setSelectedArticleId(articleParam);
        }

        setTimeout(() => setLoading(false), 1000); // 演出のため1秒ロード
      } catch (error) {
        console.error('記事データの取得に失敗しました:', error);
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

  // 🌟 シネマティック・ローディング表示
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
      <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ${
        scrolled ? 'bg-[#040406]/90 backdrop-blur-2xl border-b border-white/10 py-5' : 'py-10'
      }`}>
        <div className="max-w-7xl mx-auto px-8 sm:px-12 flex justify-between items-center relative z-50">
          <button onClick={() => navigateTo('home')} className="flex items-center gap-4 group text-left">
            <div className="w-2.5 h-2.5 bg-[#8f121d] transition-transform duration-500 group-hover:scale-125 group-hover:bg-[#a81625] shadow-[0_0_14px_rgba(143,18,29,0.9)]"></div>
            <span className="font-serif tracking-[0.4em] text-xl font-medium text-white group-hover:text-[#d4b07b] transition-colors">RUBEDO</span>
          </button>

          <div className="flex items-center gap-6">
            <button onClick={() => setIsMuted(!isMuted)} className="p-2 text-[#71717a] hover:text-white transition-colors hidden sm:flex items-center gap-2 text-[10px] font-mono tracking-widest">
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-[#8f121d]" />}
              <span className="uppercase">{isMuted ? 'SOUND OFF' : 'SOUND ON'}</span>
            </button>
            <a href={CONFIG.LINKS.boothStore} target="_blank" rel="noreferrer" className="text-[10px] tracking-[0.3em] font-mono text-[#d4b07b] border border-[#d4b07b]/30 bg-[#d4b07b]/[0.02] px-5 py-2.5 hover:bg-[#d4b07b]/15 transition-all flex items-center gap-2">
              BOOTH <ArrowUpRight className="w-3 h-3" />
            </a>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={`p-2.5 border transition-all flex items-center gap-2 font-mono text-xs ${isMenuOpen ? 'border-[#8f121d] text-white bg-[#8f121d]/20' : 'border-white/10 hover:border-white/30 text-white'}`}>
              {isMenuOpen ? <X className="w-5 h-5 text-[#8f121d]" /> : <Menu className="w-5 h-5" />}
              <span className="hidden sm:inline text-[10px] tracking-widest text-[#a1a1aa]">{isMenuOpen ? 'CLOSE' : 'MENU'}</span>
            </button>
          </div>
        </div>

        {/* OVERLAY MENU DRAWER (背景完全不透明・背面スクロールロック) */}
        {isMenuOpen && (
          <div className="fixed inset-0 bg-[#040406] z-40 p-6 sm:p-12 lg:p-16 pt-28 sm:pt-36 flex flex-col justify-between overflow-y-auto min-h-screen">
            <div className="max-w-4xl mx-auto w-full space-y-8 my-auto py-6">
              <div className="flex justify-between items-center text-[10px] font-mono text-[#71717a] tracking-[0.3em] border-b border-white/10 pb-4">
                <span>SELECT NAVIGATION ARCHIVE</span>
                <span className="text-[#8f121d]">5 DESTINATIONS</span>
              </div>
              <nav className="grid grid-cols-1 gap-4">
                {menuNavItems.map((item) => (
                  <button key={item.id} onClick={() => navigateTo(item.id)} className={`w-full text-left p-6 sm:p-8 border transition-all duration-300 flex items-center justify-between group relative overflow-hidden ${currentPage === item.id ? 'border-[#8f121d] bg-[#8f121d]/[0.12] text-white shadow-[inset_4px_0_0_#8f121d]' : 'border-white/10 bg-[#07070a] hover:border-white/30 hover:bg-white/[0.04] text-[#a1a1aa]'}`}>
                    <div className="flex items-start sm:items-center gap-6 z-10">
                      <span className={`font-mono text-xs sm:text-sm font-semibold tracking-widest ${currentPage === item.id ? 'text-[#8f121d]' : 'text-[#71717a] group-hover:text-white'}`}>{item.num}</span>
                      <div>
                        <div className="flex items-center gap-3">
                          <h2 className="font-serif text-lg sm:text-2xl font-medium tracking-[0.2em] text-[#e2e2e8] group-hover:text-white">{item.title}</h2>
                          {currentPage === item.id && <span className="inline-flex items-center gap-1 text-[9px] font-mono tracking-widest text-[#d4b07b] bg-[#d4b07b]/10 border border-[#d4b07b]/30 px-2 py-0.5">CURRENT</span>}
                        </div>
                        <p className="text-xs font-sans text-[#71717a] group-hover:text-[#a1a1aa] font-light leading-relaxed">{item.subtitle}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-[#52525b] group-hover:text-white group-hover:translate-x-2 transition-all" />
                  </button>
                ))}
              </nav>
            </div>
            <div className="max-w-4xl mx-auto w-full pt-8 border-t border-white/10 font-mono text-[10px] text-[#52525b] tracking-widest flex justify-between items-center">
              <span>RUBEDO CREATIVE ARCHIVE &copy; 2026</span>
              <span className="text-[#8f121d]">FOUNDED BY NUMEN & MUMEN</span>
            </div>
          </div>
        )}
      </header>

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
      <footer className="border-t border-white/10 py-20 bg-[#030305] relative z-10 text-xs font-mono text-[#52525b]">
        <div className="max-w-7xl mx-auto px-8 sm:px-12 flex flex-col sm:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-4">
            <div className="w-2.5 h-2.5 bg-[#8f121d]"></div>
            <span className="font-serif text-lg text-white tracking-[0.2em]">RUBEDO</span>
            <span className="text-[10px] tracking-widest border-l border-white/10 pl-4">OFFICIAL CREATIVE ARCHIVE</span>
          </div>
          <div className="tracking-widest text-[10px]">&copy; 2026 RUBEDO BY NUMEN & MUMEN. ALL RIGHTS RESERVED.</div>
        </div>
      </footer>
    </div>
  );
}

// ==========================================
// 1. PAGE: PORTAL HOME (文章を完全保持)
// ==========================================
function HomePage({ navigateTo, articles, setSelectedArticleId, selectedAngle, setSelectedAngle, CONFIG }) {
  const currentAngleObj = vermiliaAngles.find(a => a.id === selectedAngle);

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

      {/* SECTION 02: JOURNAL (microCMSから最新3件を表示) */}
      <section className="py-36 border-t border-white/10 relative z-10">
        <div className="max-w-7xl mx-auto px-8 sm:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <div className="space-y-3">
              <span className="text-[10px] tracking-[0.4em] text-[#8f121d] uppercase font-mono block font-semibold">02 / INSIDE RUBEDO</span>
              <h2 className="font-serif text-4xl sm:text-6xl text-white tracking-wide">JOURNAL & HOW-TO</h2>
            </div>
            <button onClick={() => navigateTo('journal')} className="text-xs font-mono text-[#d4b07b] tracking-[0.25em] flex items-center gap-2 hover:text-white transition-colors">
              FULL ARCHIVE <ArrowUpRight className="w-4 h-4 text-[#8f121d]" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {articles.slice(0, 3).map((article) => (
              <article key={article.id} onClick={() => { setSelectedArticleId(article.id); navigateTo('journal'); }} className="bg-[#060609] border border-white/10 p-10 flex flex-col justify-between hover:border-[#8f121d]/70 transition-all duration-500 cursor-pointer group">
                <div className="space-y-6">
                  <div className="flex justify-between items-center text-[10px] font-mono tracking-widest text-[#71717a]">
                    <span className="text-[#8f121d] font-bold">{article.category}</span>
                    <span>{article.createdAt.split('T')[0]}</span>
                  </div>
                  <h3 className="font-serif text-2xl text-white group-hover:text-[#d4b07b] transition-colors leading-[1.4] line-clamp-2">{article.title}</h3>
                  <p className="text-xs text-[#a1a1aa] font-light leading-[1.9] line-clamp-3">{article.lead}</p>
                </div>
                <div className="pt-8 mt-8 border-t border-white/5 flex justify-between items-center font-mono text-[10px] text-[#71717a]">
                  <span>BY {article.author}</span>
                  <span className="text-white group-hover:translate-x-2 transition-transform flex items-center gap-1.5">READ <ChevronRight className="w-3.5 h-3.5 text-[#8f121d]" /></span>
                </div>
              </article>
            ))}
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

// ==========================================
// 2. PAGE: VERMILIA SPECIAL PAGE (文章完全保持)
// ==========================================
function VermiliaPage({ navigateTo, selectedAngle, setSelectedAngle, LINKS }) {
  const currentAngleObj = vermiliaAngles.find(a => a.id === selectedAngle);
  return (
    <div className="pt-36 pb-32 max-w-7xl mx-auto px-8 sm:px-12 space-y-16 animate-fadeIn">
      <div className="flex justify-between items-center border-b border-white/10 pb-6">
        <button onClick={() => navigateTo('home')} className="text-xs font-mono text-[#a1a1aa] hover:text-white flex items-center gap-2 transition-colors tracking-widest">
          <ArrowLeft className="w-4 h-4 text-[#8f121d]" /> BACK TO PORTAL
        </button>
        <span className="text-[10px] font-mono text-[#d4b07b] tracking-[0.3em] uppercase">VERMILIA SPECIAL PAGE</span>
      </div>
      <h1 className="font-serif text-5xl sm:text-7xl text-white">VERMILIA</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
        <div className="lg:col-span-8 bg-[#030305] border border-white/10 p-8 sm:p-12 space-y-8">
          <div className="aspect-[16/10] bg-[#07070a] border border-white/5 relative overflow-hidden flex items-center justify-center p-12">
            <div className="text-center space-y-6 max-w-md mx-auto">
              <div className="w-32 h-32 mx-auto border border-[#8f121d]/40 bg-[#8f121d]/10 backdrop-blur-md flex items-center justify-center shadow-[0_0_70px_rgba(143,18,29,0.25)]">
                <Box className="w-16 h-16 text-[#d4b07b]" />
              </div>
              <div className="text-sm font-mono tracking-[0.35em] text-white uppercase">{currentAngleObj?.title}</div>
              <p className="text-xs text-[#a1a1aa] font-light leading-[1.9] pt-4 border-t border-white/10">{currentAngleObj?.desc}</p>
            </div>
          </div>
        </div>
        <div className="lg:col-span-4 bg-[#030305] border border-white/10 p-10 sm:p-12 flex flex-col justify-between space-y-10">
          <div className="space-y-6">
            <h3 className="font-serif text-2xl text-white border-b border-white/10 pb-6">光と深紅の交錯</h3>
            <p className="text-xs sm:text-sm text-[#a1a1aa] leading-[2.1] font-light">
              空間に置いたその瞬間、空気のトーンが変わるかのような、凛とした余韻と存在感。細部をミリ単位でチュニングした輪郭が、所有の充足感を深く満たします。
            </p>
          </div>
          <a href={LINKS.vermiliaItem} target="_blank" rel="noreferrer" className="w-full bg-[#8f121d] text-white text-xs font-mono tracking-[0.3em] py-5 text-center transition-all flex items-center justify-center gap-3 hover:bg-[#a31625]">
            ACQUIRE ON BOOTH <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 3. PAGE: JOURNAL ARCHIVE (microCMS同期 & リッチテキスト対応)
// ==========================================
function JournalPage({ journalArticles, activeTab, setActiveTab, selectedArticle, setSelectedArticleId }) {
  const categories = ['all', 'Modeling', 'VRChat', 'Shader', 'Dialogue'];
  const filteredArticles = activeTab === 'all' 
    ? journalArticles 
    : journalArticles.filter(a => a.category?.toLowerCase() === activeTab.toLowerCase());

  if (selectedArticle) {
    return (
      <div className="max-w-4xl mx-auto px-8 pt-40 pb-32 space-y-10 animate-fadeIn">
        <button onClick={() => setSelectedArticleId(null)} className="flex items-center gap-2 font-mono text-[10px] text-[#71717a] hover:text-white transition-colors tracking-widest">
          <ArrowLeft className="w-4 h-4 text-[#8f121d]" /> BACK TO LIST
        </button>
        <div className="space-y-6">
          <div className="flex items-center gap-4 text-[10px] font-mono text-[#71717a]">
            <span className="bg-[#8f121d] text-white px-2 py-0.5 font-bold">{selectedArticle.category}</span>
            <span>{selectedArticle.createdAt.split('T')[0]}</span>
            <span>BY {selectedArticle.author}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl text-white leading-tight">{selectedArticle.title}</h1>
          <p className="text-sm text-[#a1a1aa] border-l border-[#8f121d] pl-4 italic leading-relaxed">{selectedArticle.lead}</p>
        </div>

        {selectedArticle.eyecatch && (
          <div className="aspect-video w-full overflow-hidden border border-white/10">
            <img src={selectedArticle.eyecatch.url} alt="" className="w-full h-full object-cover" />
          </div>
        )}

        {/* microCMSのリッチテキストHTMLをRUBEDOのスタイルで出力 */}
        <div 
          className="prose prose-invert prose-red max-w-none pt-8 border-t border-white/5 space-y-6 text-sm leading-[2.1] font-light text-[#e2e2e8]
            prose-headings:font-serif prose-headings:text-white prose-h2:text-xl prose-h2:border-l-4 prose-h2:border-[#8f121d] prose-h2:pl-4 prose-h2:pt-4
            prose-h3:text-lg prose-h3:text-[#d4b07b] prose-pre:bg-[#030305] prose-pre:p-5 prose-pre:font-mono prose-pre:text-[#d4b07b]"
          dangerouslySetInnerHTML={{ __html: selectedArticle.body }}
        />
      </div>
    );
  }

  return (
    <div className="pt-36 pb-32 max-w-7xl mx-auto px-8 sm:px-12 space-y-16 animate-fadeIn">
      <div className="space-y-4 border-b border-white/10 pb-8">
        <h1 className="font-serif text-5xl sm:text-7xl text-white">JOURNAL & HOW-TO</h1>
      </div>
      <div className="flex flex-wrap gap-3 border-b border-white/10 pb-4 text-xs font-mono">
        {categories.map(cat => (
          <button key={cat} onClick={() => setActiveTab(cat)} className={`px-4 py-2 border uppercase transition-all ${activeTab.toLowerCase() === cat.toLowerCase() ? 'border-[#8f121d] bg-[#8f121d]/20 text-white font-bold' : 'border-white/10 text-[#71717a] hover:text-white'}`}>
            {cat === 'all' ? 'ALL' : cat}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {filteredArticles.map(article => (
          <article key={article.id} onClick={() => setSelectedArticleId(article.id)} className="bg-[#060609] border border-white/10 p-8 flex flex-col justify-between hover:border-[#8f121d]/70 transition-all cursor-pointer group">
            <div className="space-y-4">
              <div className="flex justify-between font-mono text-[10px] text-[#71717a]">
                <span className="text-[#8f121d] font-bold">{article.category}</span>
                <span>{article.createdAt.split('T')[0]}</span>
              </div>
              <h3 className="font-serif text-xl text-white group-hover:text-[#d4b07b] transition-colors line-clamp-2">{article.title}</h3>
              <p className="text-xs text-[#a1a1aa] line-clamp-3 font-light leading-relaxed">{article.lead}</p>
            </div>
            <div className="pt-6 mt-6 border-t border-white/5 flex justify-between font-mono text-[10px] text-[#71717a]">
              <span>BY {article.author}</span>
              <span className="text-white flex items-center gap-1">READ <ArrowRight className="w-3.5 h-3.5 text-[#8f121d]"/></span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 4. PAGE: FOUNDERS & PHILOSOPHY (文章完全保持)
// ==========================================
function FoundersPage({ navigateTo, LINKS }) {
  return (
    <div className="pt-36 pb-32 max-w-7xl mx-auto px-8 sm:px-12 space-y-20 animate-fadeIn">
      <div className="flex justify-between items-center border-b border-white/10 pb-6">
        <button onClick={() => navigateTo('home')} className="text-xs font-mono text-[#a1a1aa] hover:text-white flex items-center gap-2 transition-colors tracking-widest">
          <ArrowLeft className="w-4 h-4 text-[#8f121d]" /> BACK TO PORTAL
        </button>
        <span className="text-[10px] font-mono text-[#d4b07b] tracking-[0.3em] uppercase">FOUNDERS PROFILE</span>
      </div>
      <h1 className="font-serif text-5xl sm:text-7xl text-white">Numen & MUMEN</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="bg-[#030305] border border-white/10 p-12 space-y-6">
          <h2 className="font-serif text-4xl text-white">Numen</h2>
          <p className="text-xs sm:text-sm text-[#a1a1aa] leading-[2.1] font-light">3D造形およびシェーディング・アルゴリズムを担当。現実における物質の質感・光の減衰をデジタル空間で再現し、「触れそうな質感」の極限を追求する。</p>
          <a href={LINKS.numenX} target="_blank" rel="noreferrer" className="text-xs font-mono text-[#71717a] hover:text-white flex items-center gap-1.5">X (@Numen_rubedovrc) <ArrowUpRight className="w-3.5 h-3.5" /></a>
        </div>
        <div className="bg-[#030305] border border-white/10 p-12 space-y-6">
          <h2 className="font-serif text-4xl text-white">MUMEN</h2>
          <p className="text-xs sm:text-sm text-[#a1a1aa] leading-[2.1] font-light">アートディレクションおよびアクセサリ・ビジュアル設計を担当。古典建築やグラフィックの文脈をアセットに注ぎ込み、世界観に圧倒的な深みを与える。</p>
          <a href={LINKS.mumenX} target="_blank" rel="noreferrer" className="text-xs font-mono text-[#71717a] hover:text-white flex items-center gap-1.5">X (@__MUMEN) <ArrowUpRight className="w-3.5 h-3.5" /></a>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 5. PAGE: THE ARCHIVES & GUIDELINES (文章完全保持)
// ==========================================
function ArchivesPage({ navigateTo, LINKS }) {
  const documents = [
    { title: '共同倫理ルールブック', badge: '必読指針', icon: <ShieldCheck className="w-6 h-6 text-[#8f121d]" />, desc: '優しき人々が搾取されず、安心して息ができる空間を維持するための防衛指針。コミュニティの基礎となる重要ルールを書き記しています。', link: LINKS.ethicalRulebook },
    { title: 'プロ向け二次創作・協業ガイドライン', badge: 'クリエイター向け', icon: <BookOpen className="w-6 h-6 text-[#d4b07b]" />, desc: 'クリエイター向けの特殊な申請制コミュニティ『勇気あるアルパカ』参加のための前提ガイドライン。商業・二次創作・協業についてのルール。', link: LINKS.vermiliaGuideline },
    { title: '『勇気あるアルパカ』への入り方ガイド', badge: '参加ステップ', icon: <FileText className="w-6 h-6 text-[#d4b07b]" />, desc: '特殊な申請制コミュニティ『勇気あるアルパカ』への参加手順。二次創作ガイドラインをお読みいただいた後にご覧ください。', link: LINKS.braveryAlpaca },
    { title: '愛のあるアルパカ / 入室ガイド', badge: 'フォロワー限定', icon: <Heart className="w-6 h-6 text-[#8f121d]" />, desc: 'フォロワー向けの安全な限定コミュニティ。強制的な活動はなく、匿名のご意見箱を通じて穏やかに関われる任意の場所です。', link: LINKS.loveAlpaca },
    { title: '公式設定資料集 (WORLD EXHIBITION)', badge: '世界観資料', icon: <Sparkles className="w-6 h-6 text-[#d4b07b]" />, desc: '自由な発想で二次創作を楽しんでいただくための、世界観をさらりとまとめた資料集。創作者へのエールを込めて公開しています。', link: LINKS.vermiliaExhibition }
  ];
  return (
    <div className="pt-36 pb-32 max-w-7xl mx-auto px-8 sm:px-12 space-y-16 animate-fadeIn">
      <div className="flex justify-between items-center border-b border-white/10 pb-6">
        <button onClick={() => navigateTo('home')} className="text-xs font-mono text-[#a1a1aa] hover:text-white flex items-center gap-2 transition-colors tracking-widest">
          <ArrowLeft className="w-4 h-4 text-[#8f121d]" /> BACK TO PORTAL
        </button>
        <span className="text-[10px] font-mono text-[#d4b07b] tracking-[0.3em] uppercase">OFFICIAL DOCUMENTS</span>
      </div>
      <h1 className="font-serif text-5xl sm:text-7xl text-white">THE ARCHIVES</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {documents.map((doc, idx) => (
          <a key={idx} href={doc.link} target="_blank" rel="noreferrer" className="bg-[#060609] border border-white/10 p-8 flex flex-col justify-between hover:border-[#8f121d]/70 transition-all group">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="p-2 bg-[#030305] border border-white/10">{doc.icon}</div>
                <span className="text-[9px] font-mono tracking-widest text-[#d4b07b] border border-[#d4b07b]/30 px-2 py-0.5">{doc.badge}</span>
              </div>
              <h2 className="font-serif text-xl text-white group-hover:text-[#d4b07b] transition-colors">{doc.title}</h2>
              <p className="text-xs text-[#a1a1aa] leading-relaxed font-light">{doc.desc}</p>
            </div>
            <div className="pt-6 mt-6 border-t border-white/5 flex justify-between font-mono text-[9px] text-[#71717a]">
              <span>VERGUIDE DOCUMENT</span>
              <span className="text-white flex items-center gap-1">VIEW <ExternalLink className="w-3 h-3 text-[#d4b07b]"/></span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

// ダミーデータ定義（固定データ）
const vermiliaAngles = [
  { id: 'FRONT_01', title: 'I. THE SILHOUETTE', subtitle: '空間に刻まれる緊張感', desc: '過度な装飾を排し、立ち姿そのものが持つ美しい重心バランス。光を吸い込む深い陰影のライン。' },
  { id: 'DETAIL_MAT', title: 'II. LUSTER & SHADOW', subtitle: '深紅と黒が魅せる質感', desc: '微細な光の乱反射。現実の金属や布地が抱く「冷たさ」と「重み」をデジタル空間へ昇華。' },
  { id: 'GIMMICK_ACC', title: 'III. GEOMETRY ART', subtitle: '細部に宿る幾何学', desc: '主張しすぎず、しかし暗がりの中でも確かに自立した存在感を放つ繊細なアクセサリ造形。' },
  { id: 'TOPOLOGY_MESH', title: 'IV. HARMONY OF FORM', subtitle: '流動する破綻なき構造', desc: '動的な美しいラインを損なわないよう、ミリ単位で吟味されたポリゴン流動とフォルムの美。' }
];

const menuNavItems = [
  { id: 'home', num: '01', title: 'PORTAL HOME', subtitle: 'ポータル総合トップ' },
  { id: 'vermilia', num: '02', title: 'VERMILIA SPECIAL', subtitle: 'フラッグシップ解説' },
  { id: 'journal', num: '03', title: 'JOURNAL & HOW-TO', subtitle: '技術ノウハウ・ブログ' },
  { id: 'founders', num: '04', title: 'FOUNDERS PHILOSOPHY', subtitle: '創作者プロフィール' },
  { id: 'archives', num: '05', title: 'THE ARCHIVES', subtitle: '公式ルール・ガイドライン集' }
];
