import React, { useState } from 'react';
import { Search, Bell, Heart, ShoppingCart, Globe, SlidersHorizontal, ArrowUpRight, Share2, Twitter, Mail, Check } from 'lucide-react';

export default function VoothPage({ navigateTo, CONFIG }) {
  const [isFollowed, setIsFollowed] = useState(false);
  const [likedItems, setLikedItems] = useState({});

  // 🌟 展覧会（非売品・未公開3Dデータ）の展示用アイテムデータ
  const exhibitionItems = [
    {
      id: 'ex-vermilia',
      category: '3Dキャラクター',
      badges: ['VRChat', 'Vket 2026 Summer'],
      title: 'オリジナル3Dモデル『ヴェルミリア -Vermilia-』',
      price: '¥ 12,000',
      likes: 389,
      isFlagship: true,
      imageUrl: 'https://images.microcms-assets.io/assets/rubedo/example/vermilia_thumb.jpg', // アイキャッチ画像
      tag: 'FLAGSHIP MODEL'
    },
    {
      id: 'ex-proto-01',
      category: '3Dアセット / プロトタイプ',
      badges: ['非売品', 'EXHIBITION ONLY'],
      title: '【展示データ】ヴェルミリア 初期コンセプト・アーマー枠解体モデル',
      price: 'NON-COMMERCIAL',
      likes: 512,
      isFlagship: false,
      tag: 'CONCEPT ARCHIVE'
    },
    {
      id: 'ex-shader-lab',
      category: 'Shader / エフェクト',
      badges: ['VRChat', '実験室'],
      title: '【未公開】深紅の煉獄シェーダー & パルスノイズマテリアル Lab Edition',
      price: 'FREE DISPLAY',
      likes: 245,
      isFlagship: false,
      tag: 'SHADER LAB'
    },
    {
      id: 'ex-gimmick-box',
      category: '3Dギミック / Unity',
      badges: ['Udon', 'VRChat'],
      title: '【コンセプト】シネマティック視界ジャック & 空間転換ギミックシステム',
      price: 'EXHIBITION ONLY',
      likes: 418,
      isFlagship: false,
      tag: 'GIMMICK'
    }
  ];

  const toggleLike = (id, e) => {
    e.stopPropagation();
    setLikedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="min-h-screen bg-[#1f1f22] text-[#e2e2e8] font-sans animate-fadeIn">
      {/* 🌟 1. VOOTH 赤色トップヘッダー (BOOTH完全パロディ) */}
      <header className="bg-[#28282c] border-b border-black/40 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          
          {/* VOOTH ロゴ & 検索バー */}
          <div className="flex items-center gap-4 flex-1">
            {/* VOOTH ロゴ */}
            <div 
              onClick={() => navigateTo('home')} 
              className="bg-[#fc4d51] text-white font-black text-xl px-3 py-1 tracking-tighter cursor-pointer hover:opacity-90 transition-opacity flex items-center gap-1 shadow-md"
            >
              <span>VOOTH</span>
              <span className="text-[9px] bg-black/30 px-1 py-0.2 rounded font-mono font-normal">PARODY</span>
            </div>

            {/* 検索入力欄 */}
            <div className="relative flex-1 max-w-xl hidden sm:block">
              <input 
                type="text" 
                placeholder="展示アセットやキーワードを入力..." 
                className="w-full bg-[#18181a] border border-white/10 rounded px-4 py-1.5 text-xs text-white focus:outline-none focus:border-[#fc4d51] transition-colors pl-3 pr-10"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[#a1a1aa]">
                <Search className="w-3.5 h-3.5 cursor-pointer hover:text-white" />
                <SlidersHorizontal className="w-3.5 h-3.5 cursor-pointer hover:text-white ml-1 border-l border-white/10 pl-1" />
              </div>
            </div>
          </div>

          {/* 右側 ユーザーアイコン領域 */}
          <div className="flex items-center gap-4 text-xs text-[#a1a1aa] font-mono">
            <div className="flex items-center gap-1 bg-[#18181a] px-2.5 py-1 rounded border border-white/5 cursor-pointer hover:text-white">
              <span className="w-2 h-2 rounded-full bg-[#fc4d51]"></span>
              <span className="text-white font-bold">DIOIMIA</span>
            </div>
            <Bell className="w-4 h-4 cursor-pointer hover:text-white hidden sm:block" />
            <Heart className="w-4 h-4 cursor-pointer hover:text-white hidden sm:block" />
            <ShoppingCart className="w-4 h-4 cursor-pointer hover:text-white hidden sm:block" />
            <div className="flex items-center gap-1 cursor-pointer hover:text-white border-l border-white/10 pl-3">
              <Globe className="w-3.5 h-3.5" />
              <span>日本語</span>
            </div>
          </div>
        </div>
      </header>

      {/* 🌟 2. ショップヘッダーエリア (BOOTHのRUBEDOショップ画面再現) */}
      <div className="bg-[#18181b] border-b border-white/10">
        <div className="max-w-5xl mx-auto px-6 py-10 space-y-6">
          
          {/* ショップメインカード */}
          <div className="bg-[#28282c] border border-white/10 p-6 sm:p-8 rounded-lg shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              {/* RUBEDO アイコン */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-black border border-white/20 rounded-lg flex items-center justify-center p-2 shadow-inner flex-shrink-0">
                <div className="border border-[#8f121d] w-full h-full bg-[#8f121d]/20 flex items-center justify-center">
                  <span className="font-serif text-white font-bold text-xs tracking-widest">RUBEDO</span>
                </div>
              </div>

              {/* ショップ名 ＆ ID */}
              <div className="space-y-2">
                <h1 className="font-serif text-2xl sm:text-3xl text-white font-normal tracking-wide">RUBEDO</h1>
                <p className="text-xs font-mono text-[#a1a1aa]">RUBEDO EXHIBITION HALL</p>
                
                {/* フォローボタン */}
                <button 
                  onClick={() => setIsFollowed(!isFollowed)}
                  className={`px-5 py-1.5 rounded text-xs font-mono font-bold transition-all flex items-center gap-1.5 shadow-md ${
                    isFollowed 
                      ? 'bg-white/10 text-white border border-white/20' 
                      : 'bg-[#fc4d51] text-white hover:bg-[#e03e42]'
                  }`}
                >
                  {isFollowed ? <Check className="w-3.5 h-3.5 text-green-400" /> : <span>＋</span>}
                  <span>{isFollowed ? 'フォロー中' : 'フォロー'}</span>
                </button>
              </div>
            </div>

            {/* SNS ＆ シェアアイコン群 */}
            <div className="flex items-center gap-3 text-[#a1a1aa]">
              <a href={CONFIG.LINKS.discordServer} target="_blank" rel="noreferrer" className="w-9 h-9 bg-[#18181a] border border-white/10 rounded-full flex items-center justify-center hover:text-white hover:border-[#fc4d51] transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href={CONFIG.LINKS.discordServer} target="_blank" rel="noreferrer" className="w-9 h-9 bg-[#18181a] border border-white/10 rounded-full flex items-center justify-center hover:text-white hover:border-[#fc4d51] transition-colors">
                <Mail className="w-4 h-4" />
              </a>
              <div className="w-9 h-9 bg-[#18181a] border border-white/10 rounded-full flex items-center justify-center hover:text-white cursor-pointer">
                <Share2 className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* 展覧会コンセプト案内ノティス */}
          <div className="bg-[#8f121d]/10 border border-[#8f121d]/40 p-4 rounded text-xs text-[#d4b07b] flex items-center justify-between gap-4 font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#8f121d] animate-pulse"></span>
              <span>【RUBEDO 3D EXHIBITION】ここはBOOTH未公開のコンセプト3Dモデル・展覧会ページです。</span>
            </div>
            <button onClick={() => navigateTo('home')} className="text-white underline hover:text-[#d4b07b] flex items-center gap-1">
              PORTAL TOP <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

        </div>
      </div>

      {/* 🌟 3. 展覧会アイテム一覧 (BOOTH商品カードデザイン再現) */}
      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="space-y-6 mb-8 flex justify-between items-center border-b border-white/10 pb-4">
          <h2 className="font-serif text-xl text-white flex items-center gap-2">
            <span>EXHIBITION ITEMS</span>
            <span className="text-xs font-mono text-[#a1a1aa]">({exhibitionItems.length})</span>
          </h2>
          <span className="text-xs font-mono text-[#a1a1aa]">SORT BY: NEWEST</span>
        </div>

        {/* グリッドカード配置 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {exhibitionItems.map((item) => {
            const isLiked = likedItems[item.id];
            const currentLikes = isLiked ? item.likes + 1 : item.likes;

            return (
              <div 
                key={item.id}
                className="bg-[#28282c] border border-white/10 rounded-lg overflow-hidden flex flex-col justify-between hover:border-[#fc4d51]/70 transition-all cursor-pointer group shadow-lg"
              >
                {/* 🌟 サムネイル画像部 (1:1 正方形 BOOTH仕様) */}
                <div className="aspect-square bg-black relative overflow-hidden flex items-center justify-center">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full bg-[#121214] p-6 flex flex-col items-center justify-center text-center space-y-3">
                      <div className="w-12 h-12 border border-[#8f121d] bg-[#8f121d]/20 flex items-center justify-center font-serif text-xs text-white">
                        RUBEDO
                      </div>
                      <span className="text-[10px] font-mono text-[#d4b07b] tracking-widest">{item.tag}</span>
                    </div>
                  )}

                  {/* BOOTH風バッジ */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {item.badges.map((badge, bIdx) => (
                      <span key={bIdx} className="bg-black/80 text-white text-[9px] font-mono px-2 py-0.5 rounded border border-white/10">
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>

                {/* カード情報テキスト部 */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    {/* カテゴリー */}
                    <span className="text-[10px] font-mono text-[#a1a1aa] block">{item.category}</span>
                    
                    {/* 商品名 */}
                    <h3 className="text-xs text-white font-medium line-clamp-2 leading-relaxed group-hover:text-[#fc4d51] transition-colors">
                      {item.title}
                    </h3>
                  </div>

                  {/* 価格 ＆ いいねボタン (BOOTH忠実再現) */}
                  <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                    <span className={`font-mono text-sm font-bold ${item.price.includes('NON') ? 'text-[#a1a1aa]' : 'text-white'}`}>
                      {item.price}
                    </span>

                    {/* いいね（ハート）ボタン */}
                    <button 
                      onClick={(e) => toggleLike(item.id, e)}
                      className={`flex items-center gap-1 text-[11px] font-mono px-2 py-1 rounded transition-colors ${
                        isLiked ? 'bg-[#fc4d51]/20 text-[#fc4d51]' : 'text-[#a1a1aa] hover:text-white'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-[#fc4d51] text-[#fc4d51]' : ''}`} />
                      <span>{currentLikes}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* フッター */}
      <footer className="bg-[#18181b] border-t border-white/10 py-8 text-center text-xs font-mono text-[#a1a1aa] space-y-2">
        <p>© 2026 RUBEDO - VOOTH PARODY EXHIBITION HALL</p>
        <p className="text-[10px] text-[#52525b]">This page is an unofficial creative exhibition inspired by BOOTH UI.</p>
      </footer>
    </div>
  );
}
