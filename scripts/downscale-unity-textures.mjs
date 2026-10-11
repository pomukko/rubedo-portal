import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// 🌟 Unityプロジェクト内のテクスチャフォルダへの絶対パス（適宜修正してください）
const UNITY_TEXTURE_DIR = path.resolve('E:/unity/project/hoshinoGO/Assets/Vermilia_0.0.4/Texture');
const TARGET_SIZE = 512;

async function processDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      await processDirectory(fullPath);
    } else if (entry.isFile() && /\.(png|jpg|jpeg)$/i.test(entry.name)) {
      try {
        const metadata = await sharp(fullPath).metadata();
        if (metadata.width > TARGET_SIZE || metadata.height > TARGET_SIZE) {
          const buffer = await sharp(fullPath)
            .resize({
              width: TARGET_SIZE,
              height: TARGET_SIZE,
              fit: 'inside',
              withoutEnlargement: true
            })
            .png({ quality: 90 })
            .toBuffer();

          fs.writeFileSync(fullPath, buffer);
          console.log(`✂️ 縮小完了: ${entry.name} (${metadata.width}x${metadata.height} → 512px)`);
        }
      } catch (err) {
        console.warn(`⚠️ スキップ: ${entry.name} - ${err.message}`);
      }
    }
  }
}

async function main() {
  if (!fs.existsSync(UNITY_TEXTURE_DIR)) {
    console.error(`❌ フォルダが見つかりません: ${UNITY_TEXTURE_DIR}`);
    console.log('スクリプト先頭の UNITY_TEXTURE_DIR を正しいUnityパスに書き換えてください。');
    return;
  }

  console.log(`🚀 Unityテクスチャの物理リサイズを開始します...`);
  await processDirectory(UNITY_TEXTURE_DIR);
  console.log(`✨ すべてのテクスチャの縮小が完了しました！`);
}

main();