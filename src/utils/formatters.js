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

// 🌟 サブカテゴリーからメインカテゴリーへの逆引きマップ（救済用）
const SUB_TO_MAIN_MAP = {
  'vrchat': 'CREATIVE / 3DCG',
  'blender & 3d': 'CREATIVE / 3DCG',
  'blender': 'CREATIVE / 3DCG',
  'shader & material': 'CREATIVE / 3DCG',
  'gimmick & sdk': 'CREATIVE / 3DCG',
  'unity & ue5': 'CREATIVE / 3DCG',
  'unity': 'CREATIVE / 3DCG',

  'update': 'NEWS / RELEASE',
  'event & info': 'NEWS / RELEASE',
  'dialogue & note': 'NEWS / RELEASE',

  'mental & mind': 'LAB / RESEARCH',
  'nutrition & cooking': 'LAB / RESEARCH',
  'essay & philosophy': 'LAB / RESEARCH',
  'physical & tuning': 'LAB / RESEARCH',
  'self experiment': 'LAB / RESEARCH'
};

const VALID_MAIN_CATEGORIES = ['CREATIVE / 3DCG', 'NEWS / RELEASE', 'LAB / RESEARCH'];

// 🌟 サブカテゴリ（複数選択・Multi-select対応）配列で返す
export const getSubCategories = (article) => {
  if (!article) return [];
  const sub = article?.subCategory || article?.sub_category || article?.subcategory || article?.subCategories;
  if (!sub) return [];

  let list = [];
  if (Array.isArray(sub)) {
    list = sub.map(item => {
      if (typeof item === 'object' && item !== null) {
        return item.name || item.title || item.label || item.value || item.id || '';
      }
      return String(item);
    }).filter(Boolean);
  } else if (typeof sub === 'object' && sub !== null) {
    const name = sub.name || sub.title || sub.label || sub.value || sub.id || '';
    if (name) list = [name];
  } else if (sub) {
    list = [String(sub)];
  }

  return list;
};

export const getSubCategoryName = (article) => {
  const list = getSubCategories(article);
  return list.length > 0 ? list[0] : '';
};

// 🌟 メインカテゴリ名抽出（記事全体を渡して全自動探索 ＋ 逆引き救済付き！）
export const getCategoryName = (categoryOrArticle) => {
  if (!categoryOrArticle) return 'CREATIVE / 3DCG';

  let rawCat = categoryOrArticle;
  let articleObj = null;

  if (typeof categoryOrArticle === 'object' && categoryOrArticle !== null) {
    articleObj = categoryOrArticle;
    rawCat = categoryOrArticle.category || 
             categoryOrArticle.mainCategory || 
             categoryOrArticle.main_category || 
             categoryOrArticle.categories || 
             categoryOrArticle.category_name;
  }

  const extractString = (val) => {
    if (!val) return '';
    if (Array.isArray(val)) {
      if (val.length === 0) return '';
      const first = val[0];
      if (typeof first === 'object' && first !== null) {
        return first.name || first.title || first.label || first.value || first.id || '';
      }
      return String(first);
    }
    if (typeof val === 'object' && val !== null) {
      return val.name || val.title || val.label || val.value || val.id || '';
    }
    return String(val);
  };

  let catStr = extractString(rawCat).trim();

  // マッチング判定
  if (catStr) {
    const lower = catStr.toLowerCase();
    for (const validCat of VALID_MAIN_CATEGORIES) {
      if (validCat.toLowerCase() === lower || lower.includes(validCat.toLowerCase())) {
        return validCat;
      }
    }
    if (lower.includes('creative') || lower.includes('3dcg')) return 'CREATIVE / 3DCG';
    if (lower.includes('news') || lower.includes('release')) return 'NEWS / RELEASE';
    if (lower.includes('lab') || lower.includes('research')) return 'LAB / RESEARCH';
  }

  // 🌟【自動救済】サブカテゴリーのタグからメインカテゴリーを逆引き特定！
  if (articleObj) {
    const subList = getSubCategories(articleObj);
    for (const subName of subList) {
      const matchedMain = SUB_TO_MAIN_MAP[subName.toLowerCase().trim()];
      if (matchedMain) {
        return matchedMain;
      }
    }
  }

  return 'CREATIVE / 3DCG';
};

// 🌟 著者名抽出
export const getAuthorName = (author) => {
  if (!author) return 'RUBEDO';
  if (Array.isArray(author)) {
    const first = author[0];
    if (typeof first === 'object' && first !== null) {
      return first.name || first.title || first.value || 'RUBEDO';
    }
    return String(first) || 'RUBEDO';
  }
  if (typeof author === 'object' && author !== null) {
    return author.name || author.title || author.value || 'RUBEDO';
  }
  return String(author) || 'RUBEDO';
};

// 🌟 Imgix 画像自動軽量化
export const optimizeImage = (url) => {
  if (!url || typeof url !== 'string') return '';
  if (url.includes('images.microcms-assets.io')) {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}auto=format,compress`;
  }
  return url;
};
