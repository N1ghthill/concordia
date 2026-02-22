import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const BASE = '/home/irving/Downloads/Concordia/concordia-assets-organizados';
const ICON_COLOR = path.join(BASE, '03-icon', 'concordia-icon-color-1024.png');
const ICON_WHITE = path.join(BASE, '04-monocromatico', 'concordia-icon-white-1024.png');
const ICON_BLACK = path.join(BASE, '04-monocromatico', 'concordia-icon-black-1024.png');

const STORE_DIR = path.join(BASE, '09-store');
const IOS_DIR = path.join(STORE_DIR, 'ios');
const ANDROID_DIR = path.join(STORE_DIR, 'android');
const FAV_DIR = path.join(BASE, '10-favicon');

const BG_LIGHT = { r: 246, g: 247, b: 245, alpha: 1 };
const BG_DARK = { r: 29, g: 36, b: 48, alpha: 1 };

async function ensureDirs() {
  for (const d of [STORE_DIR, IOS_DIR, ANDROID_DIR, FAV_DIR]) {
    await fs.mkdir(d, { recursive: true });
  }
}

async function compositeCentered({ src, out, width, height, bg = null, scale = 0.74 }) {
  const maxW = Math.round(width * scale);
  const maxH = Math.round(height * scale);

  const resized = await sharp(src)
    .resize({ width: maxW, height: maxH, fit: 'inside', kernel: 'lanczos3' })
    .png()
    .toBuffer();

  const meta = await sharp(resized).metadata();
  const left = Math.round((width - meta.width) / 2);
  const top = Math.round((height - meta.height) / 2);

  if (bg) {
    await sharp({
      create: { width, height, channels: 4, background: bg },
    })
      .composite([{ input: resized, left, top }])
      .flatten({ background: bg })
      .png({ compressionLevel: 9 })
      .toFile(out);
    return;
  }

  await sharp({
    create: { width, height, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([{ input: resized, left, top }])
    .png({ compressionLevel: 9 })
    .toFile(out);
}

async function generateStore() {
  // iOS App Store: 1024x1024, sem alpha
  await compositeCentered({
    src: ICON_COLOR,
    out: path.join(IOS_DIR, 'concordia-ios-appstore-icon-light-1024.png'),
    width: 1024,
    height: 1024,
    bg: BG_LIGHT,
    scale: 0.78,
  });

  await compositeCentered({
    src: ICON_WHITE,
    out: path.join(IOS_DIR, 'concordia-ios-appstore-icon-dark-1024.png'),
    width: 1024,
    height: 1024,
    bg: BG_DARK,
    scale: 0.78,
  });

  // Google Play: 512x512
  await compositeCentered({
    src: ICON_COLOR,
    out: path.join(ANDROID_DIR, 'concordia-google-play-icon-light-512.png'),
    width: 512,
    height: 512,
    bg: BG_LIGHT,
    scale: 0.78,
  });

  await compositeCentered({
    src: ICON_WHITE,
    out: path.join(ANDROID_DIR, 'concordia-google-play-icon-dark-512.png'),
    width: 512,
    height: 512,
    bg: BG_DARK,
    scale: 0.78,
  });

  // Android adaptive icon (foreground transparente + fundos)
  await compositeCentered({
    src: ICON_COLOR,
    out: path.join(ANDROID_DIR, 'concordia-android-adaptive-foreground-432.png'),
    width: 432,
    height: 432,
    scale: 0.74,
  });

  await sharp({
    create: { width: 432, height: 432, channels: 4, background: BG_LIGHT },
  })
    .flatten({ background: BG_LIGHT })
    .png({ compressionLevel: 9 })
    .toFile(path.join(ANDROID_DIR, 'concordia-android-adaptive-background-light-432.png'));

  await sharp({
    create: { width: 432, height: 432, channels: 4, background: BG_DARK },
  })
    .flatten({ background: BG_DARK })
    .png({ compressionLevel: 9 })
    .toFile(path.join(ANDROID_DIR, 'concordia-android-adaptive-background-dark-432.png'));

  await compositeCentered({
    src: ICON_BLACK,
    out: path.join(ANDROID_DIR, 'concordia-android-adaptive-monochrome-432.png'),
    width: 432,
    height: 432,
    scale: 0.74,
  });
}

async function generateFavicon() {
  const sizes = [16, 32, 48];

  for (const size of sizes) {
    await compositeCentered({
      src: ICON_COLOR,
      out: path.join(FAV_DIR, `favicon-${size}.png`),
      width: size,
      height: size,
      scale: 0.82,
    });
  }

  // Opcional útil para web app
  for (const size of [192, 512]) {
    await compositeCentered({
      src: ICON_COLOR,
      out: path.join(FAV_DIR, `web-app-icon-${size}.png`),
      width: size,
      height: size,
      scale: 0.80,
      bg: BG_LIGHT,
    });
  }
}

async function updateReadme() {
  const readmePath = path.join(BASE, 'README.txt');
  let content = await fs.readFile(readmePath, 'utf8');

  if (!content.includes('09-store')) {
    content += '\n09-store         -> ícones para App Store/Google Play (inclui adaptive Android)';
  }
  if (!content.includes('10-favicon')) {
    content += '\n10-favicon       -> favicons e ícones web (16/32/48 + web app)';
  }

  await fs.writeFile(readmePath, content);
}

async function main() {
  await ensureDirs();
  await generateStore();
  await generateFavicon();
  await updateReadme();
  console.log('Assets de store e favicon gerados com sucesso.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
