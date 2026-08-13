import React, { useState, useMemo } from 'react';
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Search, List, Image as ImageIcon, Link as LinkIcon, Tag, User } from 'lucide-react';
import { formatDate, getCategoryName, getAuthorName, optimizeImage } from '../utils/formatters';

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
  // 🌟 確定した3大メインカテゴリー
  const categories = ['all', 'CREATIVE / 3DCG', 'NEWS / RELEASE', 'LAB / RESEARCH'];
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  const handleTabChange = (cat) => {
    setActiveTab(cat);
    setPage(1);
  };

  // 最新順ソート
  const sortedArticles = useMemo(() => {
    return [...journalArticles].sort((a, b) => {
      const dateA = new Date(a?.publishedAt || a?.createdAt || a?.updatedAt || 0);
      const dateB = new Date(b?.publishedAt || b?.createdAt || b?.updatedAt || 0);
      return dateB - dateA;
    });
  }, [journalArticles]);

  // カテゴリフィルター
  const filteredArticles = useMemo(() => {
    if (activeTab === 'all') return sortedArticles;
    return sortedArticles.filter(a => {
      const catName = getCategoryName(a?.category);
      return catName.trim().toLowerCase() === activeTab.trim().toLowerCase();
    });
  }, [sortedArticles, activeTab]);

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

  // 自動目次抽出
  const tocList = useMemo(() => {
    if (!selectedArticle?.body) return [];
    const html = selectedArticle.body;
    const regex = /<h([23])\b[^>]*>(.*?)<\/h[23]>/gi;
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

  const scrollToHeading = (text) => {
    const headings = document.querySelectorAll('.article-body h2, .article-body h3');
    for (let h of headings) {
      if (h.textContent.trim() === text) {
        h.scrollIntoView({ behavior: 'smooth', block: 'start' });
        break;
      }
    }
  };

  // 記事詳細表示時
  if (selectedArticle) {
    const articleDate = formatDate(selectedArticle.publishedAt || selectedArticle.createdAt || selectedArticle.updatedAt);
    const categoryName = getCategoryName(selectedArticle.category);
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
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#a1a1aa]">
            <span className="bg-[#8f121d] text-white px-3 py-1 font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(143,18,29,0.5)] break-all">
              {categoryName}
            </span>
            {articleDate && <span className="tracking-widest">{articleDate}</span>}
            
            {/* 著者表示 */}
            <div className="flex items-center gap-2 border-l border-white/10 pl-4 text-[#d4b07b]">
              <User className="w-3.5 h-3.5 text-[#8f121d]" />
              <span>BY {authorName}</span>
            </div>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl text-white font-normal leading-[1.3] tracking-wide break-all [overflow-wrap:anywhere]">
            {selectedArticle.title || 'Untitled'}
          </h1>

          {/* タグ一覧 */}
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

          {/* リード文 */}
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
              className="webtoon-image border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)]" 
            />
          </div>
        )}

        {/* 自動生成目次 */}
        {tocList.length > 0 && (
          <div className="bg-[#060609] border border-[#8f121d]/40 p-6 sm:p-8 space-y-4 my-8 relative overflow-hidden shadow-[0_0_30px_rgba(143,18,29,0.1)]">
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
                    item.level === 3 ? 'pl-4 text-[11px] text-[#71717a]' : 'font-medium text-[#e2e2e8]'
                  }`}
                >
                  <span className="text-[#8f121d] text-[9px]">►</span>
                  <span className="hover:underline underline-offset-4 decoration-[#8f121d]">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* リッチテキスト本文 */}
        <div 
          className="article-body prose prose-invert max-w-none space-y-8 text-base sm:text-lg leading-[2.1] font-light text-[#e2e2e8] w-full overflow-hidden break-all [overflow-wrap:anywhere]
            [&_p]:mb-6 [&_p]:tracking-wide [&_p]:text-[#e2e2e8]
            [&_h1]:font-serif [&_h1]:text-2xl [&_h1]:sm:text-3xl [&_h1]:text-white [&_h1]:mt-14 [&_h1]:mb-6 [&_h1]:border-b [&_h1]:border-[#8f121d] [&_h1]:pb-2
            [&_h2]:font-serif [&_h2]:text-xl [&_h2]:sm:text-2xl [&_h2]:text-white [&_h2]:mt-14 [&_h2]:mb-6 [&_h2]:pt-3 [&_h2]:pb-2 [&_h2]:border-l-4 [&_h2]:border-[#8f121d] [&_h2]:pl-4 [&_h2]:bg-gradient-to-r [&_h2]:from-[#8f121d]/15 [&_h2]:to-transparent
            [&_h3]:font-serif [&_h3]:text-lg [&_h3]:sm:text-xl [&_h3]:text-[#d4b07b] [&_h3]:mt-10 [&_h3]:mb-4 [&_h3]:border-b [&_h3]:border-white/10 [&_h3]:pb-2
            [&_h4]:font-sans [&_h4]:text-base [&_h4]:font-bold [&_h4]:text-white [&_h4]:mt-8 [&_h4]:mb-3
            [&_a]:text-[#d4b07b] [&_a]:underline [&_a]:underline-offset-4 [&_a]:decoration-[#d4b07b]/40 hover:[&_a]:text-white transition-colors
            [&_table]:w-full [&_table]:my-8 [&_table]:border-collapse [&_table]:border [&_table]:border-white/10 [&_table]:font-sans [&_table]:text-sm
            [&_th]:bg-[#8f121d]/20 [&_th]:text-[#d4b07b] [&_th]:font-mono [&_th]:p-3.5 [&_th]:border [&_th]:border-white/10 [&_th]:text-left
            [&_td]:p-3.5 [&_td]:border [&_td]:border-white/10 [&_td]:bg-[#060609] [&_td]:text-[#e2e2e8]
            [&_iframe]:w-full [&_iframe]:aspect-video [&_iframe]:my-8 [&_iframe]:border [&_iframe]:border-white/10 [&_iframe]:bg-black
            [&_figcaption]:text-center [&_figcaption]:text-xs [&_figcaption]:font-mono [&_figcaption]:text-[#a1a1aa] [&_figcaption]:mt-2
            [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-3 [&_ul]:my-6
            [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-3 [&_ol]:my-6
            [&_blockquote]:border-l-4 [&_blockquote]:border-[#d4b07b] [&_blockquote]:bg-[#060609] [&_blockquote]:p-6 [&_blockquote]:my-8 [&_blockquote]:italic [&_blockquote]:text-[#a1a1aa]
            [&_pre]:bg-[#030305] [&_pre]:border [&_pre]:border-white/10 [&_pre]:p-6 [&_pre]:font-mono [&_pre]:text-xs [&_pre]:sm:text-sm [&_pre]:text-[#d4b07b]
            [&_code]:font-mono [&_code]:text-xs [&_code]:bg-white/10 [&_code]:px-2 [&_code]:py-1 [&_code]:text-[#d4b07b]
            [&_del]:text-[#71717a] [&_del]:line-through
            [&_mark]:bg-[#8f121d]/40 [&_mark]:text-white [&_mark]:px-1.5 [&_mark]:py-0.5
            [&_hr]:border-white/10 [&_hr]:my-12"
          dangerouslySetInnerHTML={{ __html: selectedArticle.body || '<p class="text-[#71717a]">本文がありません。</p>' }}
        />

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
                  <div key={idx} className="aspect-square bg-[#060609] border border-white/10 overflow-hidden group relative">
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
      </div>
    );
  }

  // 記事一覧表示時
  return (
    <div className="pt-36 pb-32 max-w-7xl mx-auto px-8 sm:px-12 space-y-12 animate-fadeIn">
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
      
      {/* 🌟 確定した3大カテゴリーのタブ切り替えバー */}
      <div className="flex flex-wrap gap-3 border-b border-white/10 pb-4 text-xs font-mono">
        {categories.map(cat => (
          <button 
            key={cat} 
            onClick={() => handleTabChange(cat)} 
            className={`px-4 py-2 border uppercase transition-all cursor-pointer ${
              activeTab.toLowerCase() === cat.toLowerCase() 
                ? 'border-[#8f121d] bg-[#8f121d]/20 text-white font-bold' 
                : 'border-white/10 text-[#71717a] hover:text-white'
            }`}
          >
            {cat === 'all' ? 'ALL' : cat}
          </button>
        ))}
      </div>

      {filteredArticles.length === 0 ? (
        <div className="py-20 text-center space-y-4 border border-white/5 bg-[#060609]">
          <p className="font-serif text-lg text-[#71717a]">
            {searchQuery ? `「${searchQuery}」に一致する記事が見つかりませんでした。` : '該当する記事が見つかりませんでした。'}
          </p>
          <p className="font-mono text-xs text-[#52525b]">NO ARTICLES FOUND.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {paginatedArticles.map(article => {
              const articleDate = formatDate(article?.publishedAt || article?.createdAt || article?.updatedAt);
              const categoryName = getCategoryName(article?.category);
              const eyecatchUrl = article?.eyecatch?.url;
              const authorName = getAuthorName(article?.author);

              return (
                <article 
                  key={article.id} 
                  onClick={() => handleArticleClick(article.id)} 
                  className="bg-[#060609] border border-white/10 overflow-hidden flex flex-col justify-between hover:border-[#8f121d]/70 transition-all cursor-pointer group"
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
                      <div className="flex justify-between font-mono text-[10px] text-[#71717a]">
                        <span className="text-[#8f121d] font-bold break-all">{categoryName}</span>
                        <span>{articleDate}</span>
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
