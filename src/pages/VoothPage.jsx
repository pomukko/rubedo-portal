import React, { useState } from 'react';
import { Search, Bell, Heart, ShoppingCart, Globe, SlidersHorizontal, ArrowUpRight, Share2, Twitter, Mail, Check } from 'lucide-react';

export default function VoothPage({ navigateTo, CONFIG }) {
  const [isFollowed, setIsFollowed] = useState(false);
  const [likedItems, setLikedItems] = useState({});

  // 🌟 公式Twitter URL
  const twitterUrl = CONFIG?.LINKS?.twitter || 'https://x.com/RUBEDO_64';

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
    <div className="min-h-screen bg-[#040406] text-[#e2e2e8] font-sans animate-fadeIn">
      {/* 🌟 1. VOOTH トップヘッダー */}
      <header className="bg-[#07070a] border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
          
          {/* VOOTH ロゴ & 検索バー */}
          <div className="flex items-center gap-6 flex-1">
            <div 
              onClick={() => navigateTo('home')} 
              className="bg-[#8f121d] text-white font-black text-xl px-4 py-1 tracking-tighter cursor-pointer hover:bg-[#a31625] transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(143,18,29,0.5)]"
            >
              <span>VOOTH</span>
            </div>

            {/* 検索入力欄 */}
            <div className="relative flex-1 max-w-xl hidden sm:block">
              <input 
                type="text" 
                placeholder="展示アセットやキーワードを入力..." 
                className="w-full bg-[#030305] border border-white/10 rounded-none px-4 py-2 text-xs text-white focus:outline-none focus:border-[#8f121d] transition-colors pl-4 pr-10 font-mono"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 text-[#71717a]">
                <Search className="w-4 h-4 cursor-pointer hover:text-white transition-colors" />
                <SlidersHorizontal className="w-4 h-4 cursor-pointer hover:text-white transition-colors border-l border-white/10 pl-2" />
              </div>
            </div>
          </div>

          {/* 右側 ユーザーアイコン領域 */}
          <div className="flex items-center gap-5 text-xs text-[#a1a1aa] font-mono">
            <div className="flex items-center gap-2 bg-[#030305] px-3 py-1.5 border border-white/10 cursor-pointer hover:border-white/30 transition-all">
              <span className="w-2 h-2 rounded-full bg-[#8f121d] animate-pulse"></span>
              <span className="text-white font-bold tracking-widest">User</span>
            </div>
            <Bell className="w-4 h-4 cursor-pointer hover:text-white transition-colors hidden sm:block" />
            <Heart className="w-4 h-4 cursor-pointer hover:text-white transition-colors hidden sm:block" />
            <ShoppingCart className="w-4 h-4 cursor-pointer hover:text-white transition-colors hidden sm:block" />
            <div className="flex items-center gap-1.5 cursor-pointer hover:text-white border-l border-white/10 pl-4 transition-colors">
              <Globe className="w-3.5 h-3.5 text-[#d4b07b]" />
              <span>日本語</span>
            </div>
          </div>
        </div>
      </header>

      {/* 🌟 2. ショップヘッダーエリア */}
      <div className="bg-[#060609] border-b border-white/10 relative">
        <div className="max-w-5xl mx-auto px-6 py-12 space-y-8">
          
          {/* ショップメインカード */}
          <div className="bg-[#030305] border border-white/10 p-8 rounded-none shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#8f121d]/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex items-center gap-6 z-10">
              {/* RUBEDO アイコン */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#060609] border border-[#8f121d]/50 flex items-center justify-center p-2 shadow-[0_0_30px_rgba(143,18,29,0.3)] flex-shrink-0">
                <div className="border border-white/10 w-full h-full bg-[#8f121d]/20 flex items-center justify-center">
                  <span className="font-serif text-white font-bold text-xs tracking-widest">RUBEDO</span>
                </div>
              </div>

              {/* ショップ名 ＆ ID */}
              <div className="space-y-2">
                <h1 className="font-serif text-3xl sm:text-4xl text-white font-normal tracking-wide">RUBEDO</h1>
                <p className="text-xs font-mono text-[#d4b07b]">RUBEDO 3D EXHIBITION HALL</p>
                
                {/* フォローボタン */}
                <button 
                  onClick={() => setIsFollowed(!isFollowed)}
                  className={`px-6 py-2 text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer shadow-lg ${
                    isFollowed 
                      ? 'bg-white/10 text-white border border-white/20' 
                      : 'bg-[#8f121d] text-white hover:bg-[#a31625] shadow-[0_0_20px_rgba(143,18,29,0.4)]'
                  }`}
                >
                  {isFollowed ? <Check className="w-3.5 h-3.5 text-green-400" /> : <span>＋</span>}
                  <span>{isFollowed ? 'フォロー中' : 'フォロー'}</span>
                </button>
              </div>
            </div>

            {/* 🌟 SNS ＆ シェアアイコン群 (Twitterリンク先を公式アカウントに設定！) */}
            <div className="flex items-center gap-3 text-[#a1a1aa] z-10">
              <a 
                href={twitterUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="w-10 h-10 bg-[#060609] border border-white/10 flex items-center justify-center hover:text-white hover:border-[#8f121d] transition-all cursor-pointer"
                aria-label="Official Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a 
                href={CONFIG?.LINKS?.discordServer || '#'} 
                target="_blank" 
                rel="noreferrer" 
                className="w-10 h-10 bg-[#060609] border border-white/10 flex items-center justify-center hover:text-white hover:border-[#8f121d] transition-all cursor-pointer"
                aria-label="Discord Community"
              >
                <Mail className="w-4 h-4" />
              </a>
              <div className="w-10 h-10 bg-[#060609] border border-white/10 flex items-center justify-center hover:text-white hover:border-[#8f121d] transition-all cursor-pointer">
                <Share2 className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* 展覧会コンセプト案内ノティス */}
          <div className="bg-[#8f121d]/10 border border-[#8f121d]/40 p-4 text-xs text-[#d4b07b] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#8f121d] animate-pulse"></span>
              <span>【RUBEDO 3D EXHIBITION】ここはBOOTH未公開のコンセプト3Dモデル・展覧会ホールです。</span>
            </div>
            <button onClick={() => navigateTo('home')} className="text-white underline hover:text-[#d4b07b] flex items-center gap-1 cursor-pointer">
              PORTAL TOP <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

        </div>
      </div>

      {/* 🌟 3. 展覧会アイテム一覧 (最大3列並びに変更！) */}
      <main className="max-w-5xl mx-auto px-6 py-16">
        <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-10">
          <h2 className="font-serif text-2xl text-white flex items-center gap-3">
            <span>EXHIBITION ITEMS</span>
            <span className="text-xs font-mono text-[#8f121d]">({exhibitionItems.length})</span>
          </h2>
          <span className="text-xs font-mono text-[#a1a1aa]">SORT BY: NEWEST</span>
        </div>

        {/* 🌟 グリッドカード配置：横3列固定 (grid-cols-1 sm:grid-cols-2 lg:grid-cols-3) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {exhibitionItems.map((item) => {
            const isLiked = likedItems[item.id];
            const currentLikes = isLiked ? item.likes + 1 : item.likes;

            return (
              <div 
                key={item.id}
                className="bg-[#060609] border border-white/10 overflow-hidden flex flex-col justify-between hover:border-[#8f121d]/70 transition-all cursor-pointer group shadow-xl"
              >
                {/* サムネイル画像部 (1:1 正方形 BOOTH仕様) */}
                <div className="aspect-square bg-[#030305] relative overflow-hidden flex items-center justify-center border-b border-white/10">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full bg-[#030305] p-6 flex flex-col items-center justify-center text-center space-y-3">
                      <div className="w-12 h-12 border border-[#8f121d] bg-[#8f121d]/20 flex items-center justify-center font-serif text-xs text-white shadow-[0_0_15px_rgba(143,18,29,0.4)]">
                        RUBEDO
                      </div>
                      <span className="text-[10px] font-mono text-[#d4b07b] tracking-widest">{item.tag}</span>
                    </div>
                  )}

                  {/* BOOTH風バッジ */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1">
                    {item.badges.map((badge, bIdx) => (
                      <span key={bIdx} className="bg-[#040406]/90 text-white text-[9px] font-mono px-2 py-0.5 border border-white/10 backdrop-blur-md">
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>

                {/* カード情報テキスト部 */}
                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-[#8f121d] block font-bold">{item.category}</span>
                    <h3 className="text-xs text-white font-serif line-clamp-2 leading-relaxed group-hover:text-[#d4b07b] transition-colors">
                      {item.title}
                    </h3>
                  </div>

                  {/* 価格 ＆ いいねボタン (BOOTH忠実再現) */}
                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <span className={`font-mono text-xs font-bold ${item.price.includes('NON') ? 'text-[#71717a]' : 'text-[#d4b07b]'}`}>
                      {item.price}
                    </span>

                    {/* いいね（ハート）ボタン */}
                    <button 
                      onClick={(e) => toggleLike(item.id, e)}
                      className={`flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-1 transition-all cursor-pointer ${
                        isLiked ? 'bg-[#8f121d]/20 text-[#8f121d] border border-[#8f121d]/50' : 'text-[#a1a1aa] hover:text-white'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-[#8f121d] text-[#8f121d]' : ''}`} />
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
      <footer className="bg-[#030305] border-t border-white/10 py-10 text-center text-xs font-mono text-[#71717a] space-y-2">
        <p>© 2026 RUBEDO - VOOTH EXHIBITION HALL</p>
        <p className="text-[10px] text-[#52525b]">This page is an unofficial creative exhibition hall inspired by BOOTH UI.</p>
      </footer>
    </div>
  );
}
