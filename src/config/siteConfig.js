// 🔗 公式URL・API接続情報
export const CONFIG = {
  SERVICE_DOMAIN: import.meta.env.VITE_MICROCMS_SERVICE_DOMAIN || 'rubedo',
  API_KEY: import.meta.env.VITE_MICROCMS_API_KEY || '',
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

// 🌟 ヴェルミリアの視点切替データ
export const vermiliaAngles = [
  { id: 'FRONT_01', title: 'I. THE SILHOUETTE', subtitle: '空間に刻まれる緊張感', desc: '過度な装飾を排し、立ち姿そのものが持つ美しい重心バランス。光を吸い込む深い陰影のライン。' },
  { id: 'DETAIL_MAT', title: 'II. LUSTER & SHADOW', subtitle: '深紅と黒が魅せる質感', desc: '微細な光の乱反射。現実の金属や布地が抱く「冷たさ」と「重み」をデジタル空間へ昇華。' },
  { id: 'GIMMICK_ACC', title: 'III. GEOMETRY ART', subtitle: '細部に宿る幾何学', desc: '主張しすぎず、しかし暗がりの中でも確かに自立した存在感を放つ繊細なアクセサリ造形。' },
  { id: 'TOPOLOGY_MESH', title: 'IV. HARMONY OF FORM', subtitle: '流動する破綻なき構造', desc: '動的な美しいラインを損なわないよう、ミリ単位で吟味されたポリゴン流動とフォルムの美。' }
];

// 🌟 ドロワーメニュー項目
export const menuNavItems = [
  { id: 'home', num: '01', title: 'PORTAL HOME', subtitle: 'ポータル総合トップ' },
  { id: 'vermilia', num: '02', title: 'VERMILIA SPECIAL', subtitle: 'フラッグシップ解説' },
  { id: 'journal', num: '03', title: 'JOURNAL & HOW-TO', subtitle: '技術ノウハウ・ブログ' },
  { id: 'founders', num: '04', title: 'FOUNDERS PHILOSOPHY', subtitle: '創作者プロフィール' },
  { id: 'archives', num: '05', title: 'THE ARCHIVES', subtitle: '公式ルール・ガイドライン集' }
];
