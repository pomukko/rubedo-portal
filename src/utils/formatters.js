// 🌟 安全な日付フォーマット変換用ヘルパー関数
export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  try {
    return String(dateStr).split('T')[0];
  } catch (e) {
    return String(dateStr);
  }
};

// 🌟 安全なカテゴリ名取得用ヘルパー関数（配列・オブジェクト・文字列すべてに対応）
export const getCategoryName = (category) => {
  if (!category) return 'JOURNAL';
  if (Array.isArray(category)) {
    if (category.length === 0) return 'JOURNAL';
    return getCategoryName(category[0]);
  }
  if (typeof category === 'string') return category;
  if (typeof category === 'object') {
    return category.name || category.title || category.label || category.id || category.value || 'JOURNAL';
  }
  return String(category);
};
