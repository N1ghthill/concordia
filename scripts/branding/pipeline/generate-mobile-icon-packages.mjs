import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const BASE = '/home/irving/Downloads/Concordia/concordia-assets-organizados';
const SRC_COLOR = path.join(BASE, '03-icon', 'concordia-icon-color-1024.png');
const SRC_BLACK = path.join(BASE, '04-monocromatico', 'concordia-icon-black-1024.png');

const IOS_ROOT = path.join(BASE, '11-ios-xcode');
const IOS_APPICONSET = path.join(IOS_ROOT, 'Assets.xcassets', 'AppIcon.appiconset');

const ANDROID_ROOT = path.join(BASE, '12-android-res');

const BG_LIGHT = { r: 246, g: 247, b: 245, alpha: 1 };
const COLOR_HEX_LIGHT = '#F6F7F5';

const IOS_ICONS = [
  { idiom: 'iphone', size: '20x20', scale: '2x', px: 40, filename: 'Icon-App-20x20@2x.png' },
  { idiom: 'iphone', size: '20x20', scale: '3x', px: 60, filename: 'Icon-App-20x20@3x.png' },
  { idiom: 'iphone', size: '29x29', scale: '2x', px: 58, filename: 'Icon-App-29x29@2x.png' },
  { idiom: 'iphone', size: '29x29', scale: '3x', px: 87, filename: 'Icon-App-29x29@3x.png' },
  { idiom: 'iphone', size: '40x40', scale: '2x', px: 80, filename: 'Icon-App-40x40@2x.png' },
  { idiom: 'iphone', size: '40x40', scale: '3x', px: 120, filename: 'Icon-App-40x40@3x.png' },
  { idiom: 'iphone', size: '60x60', scale: '2x', px: 120, filename: 'Icon-App-60x60@2x.png' },
  { idiom: 'iphone', size: '60x60', scale: '3x', px: 180, filename: 'Icon-App-60x60@3x.png' },

  { idiom: 'ipad', size: '20x20', scale: '1x', px: 20, filename: 'Icon-App-20x20@1x.png' },
  { idiom: 'ipad', size: '20x20', scale: '2x', px: 40, filename: 'Icon-App-20x20@2x-1.png' },
  { idiom: 'ipad', size: '29x29', scale: '1x', px: 29, filename: 'Icon-App-29x29@1x.png' },
  { idiom: 'ipad', size: '29x29', scale: '2x', px: 58, filename: 'Icon-App-29x29@2x-1.png' },
  { idiom: 'ipad', size: '40x40', scale: '1x', px: 40, filename: 'Icon-App-40x40@1x.png' },
  { idiom: 'ipad', size: '40x40', scale: '2x', px: 80, filename: 'Icon-App-40x40@2x-1.png' },
  { idiom: 'ipad', size: '76x76', scale: '1x', px: 76, filename: 'Icon-App-76x76@1x.png' },
  { idiom: 'ipad', size: '76x76', scale: '2x', px: 152, filename: 'Icon-App-76x76@2x.png' },
  { idiom: 'ipad', size: '83.5x83.5', scale: '2x', px: 167, filename: 'Icon-App-83.5x83.5@2x.png' },

  { idiom: 'ios-marketing', size: '1024x1024', scale: '1x', px: 1024, filename: 'Icon-App-1024x1024@1x.png' },
];

const ANDROID_DENSITIES = [
  { folder: 'mipmap-mdpi', px: 48 },
  { folder: 'mipmap-hdpi', px: 72 },
  { folder: 'mipmap-xhdpi', px: 96 },
  { folder: 'mipmap-xxhdpi', px: 144 },
  { folder: 'mipmap-xxxhdpi', px: 192 },
];

async function ensureCleanDir(dir) {
  await fs.rm(dir, { recursive: true, force: true });
  await fs.mkdir(dir, { recursive: true });
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function renderSymbolSquare({ src, out, size, bg, scale }) {
  const maxSize = Math.max(1, Math.round(size * scale));
  const icon = await sharp(src)
    .resize({ width: maxSize, height: maxSize, fit: 'inside', kernel: 'lanczos3' })
    .png()
    .toBuffer();

  const meta = await sharp(icon).metadata();
  const left = Math.round((size - meta.width) / 2);
  const top = Math.round((size - meta.height) / 2);

  await sharp({
    create: { width: size, height: size, channels: 4, background: bg ? bg : { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([{ input: icon, left, top }])
    .flatten({ background: bg || { r: 0, g: 0, b: 0, alpha: 0 } })
    .removeAlpha()
    .png({ compressionLevel: 9 })
    .toFile(out);
}

async function renderTransparentSymbol({ src, out, size, scale }) {
  const maxSize = Math.max(1, Math.round(size * scale));
  const icon = await sharp(src)
    .resize({ width: maxSize, height: maxSize, fit: 'inside', kernel: 'lanczos3' })
    .png()
    .toBuffer();

  const meta = await sharp(icon).metadata();
  const left = Math.round((size - meta.width) / 2);
  const top = Math.round((size - meta.height) / 2);

  await sharp({
    create: { width: size, height: size, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([{ input: icon, left, top }])
    .png({ compressionLevel: 9 })
    .toFile(out);
}

async function generateIOSAppIconSet() {
  await ensureCleanDir(IOS_APPICONSET);

  for (const icon of IOS_ICONS) {
    await renderSymbolSquare({
      src: SRC_COLOR,
      out: path.join(IOS_APPICONSET, icon.filename),
      size: icon.px,
      bg: BG_LIGHT,
      scale: 0.78,
    });
  }

  const contents = {
    images: IOS_ICONS.map((i) => ({
      size: i.size,
      idiom: i.idiom,
      filename: i.filename,
      scale: i.scale,
    })),
    info: {
      version: 1,
      author: 'xcode',
    },
  };

  await fs.writeFile(path.join(IOS_APPICONSET, 'Contents.json'), JSON.stringify(contents, null, 2));
}

async function writeText(filePath, content) {
  await ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, content, 'utf8');
}

async function generateAndroidRes() {
  await ensureCleanDir(ANDROID_ROOT);

  // Legacy launcher icons (ic_launcher + ic_launcher_round)
  for (const d of ANDROID_DENSITIES) {
    const folder = path.join(ANDROID_ROOT, d.folder);
    await ensureDir(folder);

    await renderSymbolSquare({
      src: SRC_COLOR,
      out: path.join(folder, 'ic_launcher.png'),
      size: d.px,
      bg: BG_LIGHT,
      scale: 0.78,
    });

    await renderSymbolSquare({
      src: SRC_COLOR,
      out: path.join(folder, 'ic_launcher_round.png'),
      size: d.px,
      bg: BG_LIGHT,
      scale: 0.78,
    });
  }

  // Adaptive icon assets
  const drawableDir = path.join(ANDROID_ROOT, 'drawable');
  await ensureDir(drawableDir);

  await renderTransparentSymbol({
    src: SRC_COLOR,
    out: path.join(drawableDir, 'ic_launcher_foreground.png'),
    size: 432,
    scale: 0.62,
  });

  await renderTransparentSymbol({
    src: SRC_BLACK,
    out: path.join(drawableDir, 'ic_launcher_monochrome.png'),
    size: 432,
    scale: 0.62,
  });

  const anydpi = path.join(ANDROID_ROOT, 'mipmap-anydpi-v26');
  await ensureDir(anydpi);

  const adaptiveXml = `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background" />
    <foreground android:drawable="@drawable/ic_launcher_foreground" />
</adaptive-icon>
`;

  await writeText(path.join(anydpi, 'ic_launcher.xml'), adaptiveXml);
  await writeText(path.join(anydpi, 'ic_launcher_round.xml'), adaptiveXml);

  const colorsXml = `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">${COLOR_HEX_LIGHT}</color>
</resources>
`;
  await writeText(path.join(ANDROID_ROOT, 'values', 'colors.xml'), colorsXml);

  const readmeAndroid = `Android launcher resources for Concordia

Copy folders into your Android app module resources:
app/src/main/res/

Included:
- mipmap-mdpi, mipmap-hdpi, mipmap-xhdpi, mipmap-xxhdpi, mipmap-xxxhdpi
- mipmap-anydpi-v26 (adaptive icon xml)
- drawable/ic_launcher_foreground.png
- drawable/ic_launcher_monochrome.png
- values/colors.xml

Notes:
- ic_launcher_round uses same artwork as ic_launcher.
- Adaptive icon references @color/ic_launcher_background and @drawable/ic_launcher_foreground.
- If your project already has colors.xml entries, merge only the ic_launcher_background color.
`;
  await writeText(path.join(ANDROID_ROOT, 'README-android.txt'), readmeAndroid);
}

async function generateIntegrationNotes() {
  const notes = `Concordia mobile icon packs

iOS (Xcode):
1. Open ios project in Xcode.
2. Replace Assets.xcassets/AppIcon.appiconset with folder from:
   11-ios-xcode/Assets.xcassets/AppIcon.appiconset
3. Build once and verify in simulator/device.

Android:
1. Copy all folders from 12-android-res into:
   app/src/main/res/
2. If prompted, merge values/colors.xml and keep ic_launcher_background.
3. Clean/rebuild project.
`;
  await fs.writeFile(path.join(BASE, '11-ios-xcode', 'README-ios.txt'), notes, 'utf8');
}

async function main() {
  await generateIOSAppIconSet();
  await generateAndroidRes();
  await generateIntegrationNotes();
  console.log('Pacotes mobile (iOS/Android) gerados com sucesso.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
