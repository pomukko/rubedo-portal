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

// 🌟 メインカテゴリ名抽出
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

// 🌟 サブカテゴリ（複数選択・Multi-select対応！）配列で返す
export const getSubCategories = (article) => {
  if (!article) return [];
  const sub = article?.subCategory || article?.sub_category || article?.subcategory || article?.subCategories;
  if (!sub) return [];

  // 配列で届いた場合
  if (Array.isArray(sub)) {
    return sub.map(item => {
      if (typeof item === 'object') {
        return item.name || item.title || item.value || item.id || '';
      }
      return String(item);
    }).filter(Boolean);
  }

  // 単一オブジェクトの場合
  if (typeof sub === 'object') {
    const name = sub.name || sub.title || sub.value || sub.id || '';
    return name ? [name] : [];
  }

  // 単一文字列の場合
  return [String(sub)];
};

// 単一文字列で取得したい時用（後方互換）
export const getSubCategoryName = (article) => {
  const list = getSubCategories(article);
  return list.length > 0 ? list[0] : '';
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
