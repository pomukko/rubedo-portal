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

// 🌟 カテゴリ名抽出（文字列・オブジェクト両対応）
export const getCategoryName = (category) => {
  if (!category) return 'GENERAL';
  if (typeof category === 'string') return category;
  if (typeof category === 'object') {
    return category.name || category.title || category.id || 'GENERAL';
  }
  return 'GENERAL';
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
