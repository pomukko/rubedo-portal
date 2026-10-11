import fs from 'fs';
import path from 'path';
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import sharp from 'sharp';

// ==========================================
// 設定
// ==========================================
const INPUT_PATH = path.resolve('public/models/vermilia.vrm');
const OUTPUT_PATH = path.resolve('public/models/vermilia.vrm');
const BACKUP_PATH = path.resolve('public/models/vermilia_raw_backup.vrm');

const DEFAULT_MAX_SIZE = 512; // 🌟 一律512px
const KEEP_FACE_1024 = true;  // 顔・瞳は1024pxで美しさを維持

async function main() {
  if (!fs.existsSync(BACKUP_PATH)) {
    if (fs.existsSync(INPUT_PATH)) {
      console.log(`📦 元モデルのバックアップを作成中: ${BACKUP_PATH}`);
      fs.copyFileSync(INPUT_PATH, BACKUP_PATH);
    } else {
      console.error(`❌ バックアップ元が見つかりません`);
      return;
    }
  }

  console.log(`🚀 VRMバイナリ最適化パイプライン起動...`);
  const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);

  // 🌟 拡張子に関わらず、直接バイナリバッファとして100%安全に読み込む
  const rawGlbBuffer = fs.readFileSync(BACKUP_PATH);
  const document = await io.readBinary(rawGlbBuffer);

  const textures = document.getRoot().listTextures();
  console.log(`🔍 検出されたテクスチャ総数: ${textures.length} 枚`);

  let resizedCount = 0;

  for (let i = 0; i < textures.length; i++) {
    const texture = textures[i];
    const imageBuffer = texture.getImage();
    if (!imageBuffer) continue;

    const textureName = (texture.getName() || `tex_${i}`).toLowerCase();
    const isFace = textureName.includes('face') || textureName.includes('eye') || textureName.includes('kao');
    const targetSize = (isFace && KEEP_FACE_1024) ? 1024 : DEFAULT_MAX_SIZE;

    try {
      const metadata = await sharp(imageBuffer).metadata();
      const { width, height } = metadata;

      if (width > targetSize || height > targetSize) {
        const resizedBuffer = await sharp(imageBuffer)
          .resize({
            width: targetSize,
            height: targetSize,
            fit: 'inside',
            withoutEnlargement: true,
          })
          .png({ quality: 85, compressionLevel: 8 })
          .toBuffer();

        texture.setImage(resizedBuffer);
        texture.setMimeType('image/png');
        resizedCount++;
        console.log(`  ✂️ [${i + 1}/${textures.length}] ${textureName}: ${width}x${height} → 最大${targetSize}px に圧縮`);
      }
    } catch (err) {
      console.warn(`  ⚠️ テクスチャ [${textureName}] のスキップ: ${err.message}`);
    }
  }

  console.log(`✨ 合計 ${resizedCount} 枚のテクスチャを最適化しました。`);
  console.log(`💾 完全な単一VRMバイナリとしてパック中...`);

  // 🌟 拡張子に惑わされず、1つの完全なGLB/VRMバイナリとして強制書き出し
  const packedBuffer = await io.writeBinary(document);
  fs.writeFileSync(OUTPUT_PATH, Buffer.from(packedBuffer));

  const origSizeMB = (fs.statSync(BACKUP_PATH).size / (1024 * 1024)).toFixed(2);
  const newSizeMB = (fs.statSync(OUTPUT_PATH).size / (1024 * 1024)).toFixed(2);

  console.log(`\n🎉 【本物の最適化完了】`);
  console.log(`  元サイズ: ${origSizeMB} MB`);
  console.log(`  圧縮後  : ${newSizeMB} MB (${Math.round((1 - newSizeMB / origSizeMB) * 100)}% 削減)`);
  console.log(`  出力先  : ${OUTPUT_PATH}\n`);
}

main().catch((err) => {
  console.error('❌ 最適化エラー:', err);
});