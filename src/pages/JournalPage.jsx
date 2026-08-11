import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { formatDate, getCategoryName } from '../utils/formatters';

export default function JournalPage({ 
  journalArticles = [], 
  activeTab, 
  setActiveTab, 
  selectedArticle, 
  setSelectedArticleId, 
  navigateTo 
}) {
  const categories = ['all', 'Modeling', 'VRChat', 'Shader', 'Dialogue'];
  
  // 安全なカテゴリ抽出とフィルター
  const filteredArticles = activeTab === 'all' 
    ? journalArticles 
    : journalArticles.filter(a => {
        const catName = getCategoryName(a.category);
        return catName.toLowerCase() === activeTab.toLowerCase();
      });

  // 記事詳細表示時
  if (selectedArticle) {
    const articleDate = formatDate(selectedArticle.publishedAt || selectedArticle.createdAt || selectedArticle.updatedAt);
    const categoryName = getCategoryName(selectedArticle.category);

    return (
      <div className="max-w-4xl mx-auto px-8 pt-40 pb-32 space-y-10 animate-fadeIn">
        <button 
          onClick={() => navigateTo('journal')} 
          className="flex items-center gap-2 font-mono text-[10px] text-[#71717a] hover:text-white transition-colors tracking-widest cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#8f121d]" /> BACK TO LIST
        </button>
        <div className="space-y-6">
          <div className="flex items-center gap-4 text-[10px] font-mono text-[#71717a]">
            <span className="bg-[#8f121d] text-white px-2 py-0.5 font-bold">{categoryName}</span>
            {articleDate && <span>{articleDate}</span>}
            {selectedArticle.author && <span>BY {selectedArticle.author}</span>}
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl text-white leading-tight">{selectedArticle.title || 'Untitled'}</h1>
          {selectedArticle.lead && (
            <p className="text-sm text-[#a1a1aa] border-l border-[#8f121d] pl-4 italic leading-relaxed">{selectedArticle.lead}</p>
          )}
        </div>

        {selectedArticle.eyecatch?.url && (
          <div className="aspect-video w-full overflow-hidden border border-white/10">
            <img src={selectedArticle.eyecatch.url} alt={selectedArticle.title || ''} className="w-full h-full object-cover" />
          </div>
        )}

        {/* microCMSのリッチテキストHTMLを出力 */}
        <div 
          className="prose prose-invert prose-red max-w-none pt-8 border-t border-white/5 space-y-6 text-sm leading-[2.1] font-light text-[#e2e2e8]
            prose-headings:font-serif prose-headings:text-white prose-h2:text-xl prose-h2:border-l-4 prose-h2:border-[#8f121d] prose-h2:pl-4 prose-h2:pt-4
            prose-h3:text-lg prose-h3:text-[#d4b07b] prose-pre:bg-[#030305] prose-pre:p-5 prose-pre:font-mono prose-pre:text-[#d4b07b]"
          dangerouslySetInnerHTML={{ __html: selectedArticle.body || '<p class="text-[#71717a]">本文がありません。</p>' }}
        />
      </div>
    );
  }

  // 記事一覧表示時
  return (
    <div className="pt-36 pb-32 max-w-7xl mx-auto px-8 sm:px-12 space-y-16 animate-fadeIn">
      <div className="space-y-4 border-b border-white/10 pb-8">
        <h1 className="font-serif text-5xl sm:text-7xl text-white">JOURNAL & HOW-TO</h1>
      </div>
      <div className="flex flex-wrap gap-3 border-b border-white/10 pb-4 text-xs font-mono">
        {categories.map(cat => (
          <button 
            key={cat} 
            onClick={() => setActiveTab(cat)} 
            className={`px-4 py-2 border uppercase transition-all ${
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
          <p className="font-serif text-lg text-[#71717a]">該当する記事が見つかりませんでした。</p>
          <p className="font-mono text-xs text-[#52525b]">NO ARTICLES FOUND IN THIS CATEGORY.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {filteredArticles.map(article => {
            const articleDate = formatDate(article.publishedAt || article.createdAt || article.updatedAt);
            const categoryName = getCategoryName(article.category);

            return (
              <article 
                key={article.id} 
                onClick={() => navigateTo('journal', null, article.id)} 
                className="bg-[#060609] border border-white/10 p-8 flex flex-col justify-between hover:border-[#8f121d]/70 transition-all cursor-pointer group"
              >
                <div className="space-y-4">
                  <div className="flex justify-between font-mono text-[10px] text-[#71717a]">
                    <span className="text-[#8f121d] font-bold">{categoryName}</span>
                    <span>{articleDate}</span>
                  </div>
                  <h3 className="font-serif text-xl text-white group-hover:text-[#d4b07b] transition-colors line-clamp-2">{article.title || 'Untitled'}</h3>
                  <p className="text-xs text-[#a1a1aa] line-clamp-3 font-light leading-relaxed">{article.lead || ''}</p>
                </div>
                <div className="pt-6 mt-6 border-t border-white/5 flex justify-between font-mono text-[10px] text-[#71717a]">
                  <span>BY {article.author || 'RUBEDO'}</span>
                  <span className="text-white flex items-center gap-1">READ <ArrowRight className="w-3.5 h-3.5 text-[#8f121d]"/></span>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
