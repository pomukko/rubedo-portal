// 🌟 日付フォーマット
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}.${mm}.${dd}`;
};

// 🌟 カテゴリ名抽出（セレクトフィールド・オブジェクト・文字列完全対応）
export const getCategoryName = (category) => {
  if (!category) return 'CREATIVE / 3DCG';
  if (Array.isArray(category)) {
    const firstCat = category[0];
    if (typeof firstCat === 'object') return firstCat.name || firstCat.title || firstCat.value || firstCat.id || 'CREATIVE / 3DCG';
    return String(firstCat);
  }
  if (typeof category === 'object') {
    return category.name || category.title || category.value || category.id || 'CREATIVE / 3DCG';
  }
  return String(category);
};

// 🌟 著者名抽出 (Numen / MUMEN / RUBEDO)
export const getAuthorName = (author) => {
  if (!author) return 'RUBEDO';
  if (Array.isArray(author)) {
    return author[0] || 'RUBEDO';
  }
  if (typeof author === 'object') {
    return author.name || author.title || author.value || 'RUBEDO';
  }
  return String(author);
};

// 🌟 Imgix 画像自動軽量化（WebP自動変換 ＆ 圧縮）
export const optimizeImage = (url) => {
  if (!url || typeof url !== 'string') return '';
  if (url.includes('images.microcms-assets.io')) {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}auto=format,compress`;
  }
  return url;
};
