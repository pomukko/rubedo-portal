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
        const catName = getCategoryName(a?.category);
        return catName.toLowerCase() === activeTab.toLowerCase();
      });

  // 安全な画面遷移ハンドラー
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

  // 🌟 記事詳細表示時（Webtoonマンガ完全最適化ビューアー！）
  if (selectedArticle) {
    const articleDate = formatDate(selectedArticle.publishedAt || selectedArticle.createdAt || selectedArticle.updatedAt);
    const categoryName = getCategoryName(selectedArticle.category);

    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-8 pt-36 sm:pt-44 pb-32 space-y-10 animate-fadeIn w-full overflow-hidden">
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
            {selectedArticle.author && <span className="text-[#d4b07b] border-l border-white/10 pl-4">BY {selectedArticle.author}</span>}
          </div>

          {/* 記事タイトル */}
          <h1 className="font-serif text-3xl sm:text-5xl text-white font-normal leading-[1.3] tracking-wide break-all [overflow-wrap:anywhere]">
            {selectedArticle.title || 'Untitled'}
          </h1>

          {/* リード文 */}
          {selectedArticle.lead && (
            <p className="text-lg sm:text-xl text-[#d4b07b]/90 border-l-2 border-[#8f121d] pl-5 py-1.5 font-light leading-relaxed italic bg-[#8f121d]/[0.03] break-all [overflow-wrap:anywhere]">
              {selectedArticle.lead}
            </p>
          )}
        </div>

        {/* アイキャッチ画像 */}
        {selectedArticle.eyecatch?.url && (
          <div className="aspect-video w-full overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
            <img src={selectedArticle.eyecatch.url} alt={selectedArticle.title || ''} className="w-full h-full object-cover" />
          </div>
        )}

        {/* 🌟 microCMSのリッチテキスト本文（Webtoonマンガビューアー表示！） */}
        <div 
          className="article-body prose prose-invert max-w-none space-y-8 text-base sm:text-lg leading-[2.1] font-light text-[#e2e2e8] w-full overflow-hidden break-all [overflow-wrap:anywhere]
            /* 本文段落 */
            [&_p]:mb-6 [&_p]:tracking-wide [&_p]:text-[#e2e2e8] [&_p]:break-all [&_p]:[overflow-wrap:anywhere]
            /* 見出し2（H2） */
            [&_h2]:font-serif [&_h2]:text-xl [&_h2]:sm:text-2xl [&_h2]:text-white [&_h2]:mt-14 [&_h2]:mb-6 [&_h2]:pt-3 [&_h2]:pb-2 [&_h2]:border-l-4 [&_h2]:border-[#8f121d] [&_h2]:pl-4 [&_h2]:bg-gradient-to-r [&_h2]:from-[#8f121d]/15 [&_h2]:to-transparent [&_h2]:break-all
            /* 見出し3（H3） */
            [&_h3]:font-serif [&_h3]:text-lg [&_h3]:sm:text-xl [&_h3]:text-[#d4b07b] [&_h3]:mt-10 [&_h3]:mb-4 [&_h3]:border-b [&_h3]:border-white/10 [&_h3]:pb-2 [&_h3]:break-all
            /* リンク */
            [&_a]:text-[#d4b07b] [&_a]:underline [&_a]:underline-offset-4 [&_a]:decoration-[#d4b07b]/40 [&_a]:break-all [&_a]:[overflow-wrap:anywhere] hover:[&_a]:text-white hover:[&_a]:decoration-white transition-colors
            
            /* 🌟🌟🌟 Webtoon（超縦長マンガ画像）完全最適化設定！ 🌟🌟🌟 */
            [&_img]:w-full [&_img]:max-w-md [&_img]:sm:max-w-lg [&_img]:mx-auto [&_img]:h-auto [&_img]:object-contain [&_img]:my-2 [&_img]:block [&_img]:shadow-[0_0_20px_rgba(0,0,0,0.8)]
            
            /* 箇条書きリスト (ul/ol) */
            [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-3 [&_ul]:my-6 [&_ul_li]:text-[#e2e2e8] [&_ul_li]:break-all
            [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-3 [&_ol]:my-6 [&_ol_li]:text-[#e2e2e8] [&_ol_li]:break-all
            /* 引用 (blockquote) */
            [&_blockquote]:border-l-4 [&_blockquote]:border-[#d4b07b] [&_blockquote]:bg-[#060609] [&_blockquote]:p-6 [&_blockquote]:my-8 [&_blockquote]:italic [&_blockquote]:text-[#a1a1aa] [&_blockquote]:break-all
            /* コードブロック (pre / code) */
            [&_pre]:bg-[#030305] [&_pre]:border [&_pre]:border-white/10 [&_pre]:p-6 [&_pre]:rounded-none [&_pre]:overflow-x-auto [&_pre]:my-8 [&_pre]:font-mono [&_pre]:text-xs [&_pre]:sm:text-sm [&_pre]:text-[#d4b07b]
            [&_code]:font-mono [&_code]:text-xs [&_code]:bg-white/10 [&_code]:px-2 [&_code]:py-1 [&_code]:text-[#d4b07b] [&_code]:break-all
            /* 水平線 */
            [&_hr]:border-white/10 [&_hr]:my-12"
          dangerouslySetInnerHTML={{ __html: selectedArticle.body || '<p class="text-[#71717a]">本文がありません。</p>' }}
        />

        {/* 記事下部フッターナビゲーション */}
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
    <div className="pt-36 pb-32 max-w-7xl mx-auto px-8 sm:px-12 space-y-16 animate-fadeIn">
      <div className="space-y-4 border-b border-white/10 pb-8">
        <h1 className="font-serif text-5xl sm:text-7xl text-white">JOURNAL & HOW-TO</h1>
      </div>
      
      {/* カテゴリフィルター */}
      <div className="flex flex-wrap gap-3 border-b border-white/10 pb-4 text-xs font-mono">
        {categories.map(cat => (
          <button 
            key={cat} 
            onClick={() => setActiveTab(cat)} 
            className={`px-4 py-2 border uppercase transition-all ${
              activeTab.toLowerCase() === cat.toLowerCase() 
                ? 'border-[#8f121d] bg-[#8f121d]/20 text-[#e2e2e8] font-bold' 
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
            const articleDate = formatDate(article?.publishedAt || article?.createdAt || article?.updatedAt);
            const categoryName = getCategoryName(article?.category);

            return (
              <article 
                key={article.id} 
                onClick={() => handleArticleClick(article.id)} 
                className="bg-[#060609] border border-white/10 p-8 flex flex-col justify-between hover:border-[#8f121d]/70 transition-all cursor-pointer group"
              >
                <div className="space-y-4">
                  <div className="flex justify-between font-mono text-[10px] text-[#71717a]">
                    <span className="text-[#8f121d] font-bold break-all">{categoryName}</span>
                    <span>{articleDate}</span>
                  </div>
                  <h3 className="font-serif text-xl text-white group-hover:text-[#d4b07b] transition-colors line-clamp-2 break-all">{article.title || 'Untitled'}</h3>
                  <p className="text-xs text-[#a1a1aa] line-clamp-3 font-light leading-relaxed break-all">{article.lead || ''}</p>
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
