import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const BASE = '/home/irving/Downloads/Concordia/concordia-assets-organizados';
const DIR = {
  wordmark: path.join(BASE, '02-wordmark'),
  icon: path.join(BASE, '03-icon'),
  mono: path.join(BASE, '04-monocromatico'),
  light: path.join(BASE, '05-fundo-claro'),
  dark: path.join(BASE, '06-fundo-escuro'),
  social: path.join(BASE, '07-social'),
};

const BG_LIGHT = { r: 246, g: 247, b: 245, alpha: 1 };
const BG_DARK = { r: 29, g: 36, b: 48, alpha: 1 };

async function ensureDirs() {
  for (const d of [DIR.light, DIR.dark, DIR.social]) {
    await fs.mkdir(d, { recursive: true });
  }
}

async function listFiles(dir, prefix) {
  const all = await fs.readdir(dir);
  return all.filter((f) => f.startsWith(prefix) && f.endsWith('.png')).sort();
}

async function flattenToBg(inputPath, outPath, bg) {
  await sharp(inputPath)
    .flatten({ background: bg })
    .png({ compressionLevel: 9 })
    .toFile(outPath);
}

async function createLightDarkFolders() {
  const wordmarkColor = await listFiles(DIR.wordmark, 'concordia-wordmark-color-');
  const iconColor = await listFiles(DIR.icon, 'concordia-icon-color-');

  const wordmarkWhite = await listFiles(DIR.mono, 'concordia-wordmark-white-');
  const iconWhite = await listFiles(DIR.mono, 'concordia-icon-white-');

  for (const file of wordmarkColor) {
    await flattenToBg(
      path.join(DIR.wordmark, file),
      path.join(DIR.light, file.replace('wordmark-color', 'wordmark-color-bg-light')),
      BG_LIGHT
    );
    await flattenToBg(
      path.join(DIR.wordmark, file),
      path.join(DIR.dark, file.replace('wordmark-color', 'wordmark-color-bg-dark')),
      BG_DARK
    );
  }

  for (const file of iconColor) {
    await flattenToBg(
      path.join(DIR.icon, file),
      path.join(DIR.light, file.replace('icon-color', 'icon-color-bg-light')),
      BG_LIGHT
    );
    await flattenToBg(
      path.join(DIR.icon, file),
      path.join(DIR.dark, file.replace('icon-color', 'icon-color-bg-dark')),
      BG_DARK
    );
  }

  // Variantes brancas para fundo escuro
  for (const file of wordmarkWhite) {
    await flattenToBg(
      path.join(DIR.mono, file),
      path.join(DIR.dark, file.replace('wordmark-white', 'wordmark-white-bg-dark')),
      BG_DARK
    );
  }

  for (const file of iconWhite) {
    await flattenToBg(
      path.join(DIR.mono, file),
      path.join(DIR.dark, file.replace('icon-white', 'icon-white-bg-dark')),
      BG_DARK
    );
  }
}

async function placeCentered(basePath, canvasW, canvasH, scaleRatio = 0.72) {
  const meta = await sharp(basePath).metadata();
  const maxW = Math.round(canvasW * scaleRatio);
  const maxH = Math.round(canvasH * scaleRatio);

  const resized = await sharp(basePath)
    .resize({ width: maxW, height: maxH, fit: 'inside', kernel: 'lanczos3' })
    .png()
    .toBuffer();

  const rMeta = await sharp(resized).metadata();
  const left = Math.round((canvasW - rMeta.width) / 2);
  const top = Math.round((canvasH - rMeta.height) / 2);

  return { input: resized, left, top };
}

async function createSocial() {
  const wmColor1024 = path.join(DIR.wordmark, 'concordia-wordmark-color-1024.png');
  const wmWhite1024 = path.join(DIR.mono, 'concordia-wordmark-white-1024.png');
  const iconColor1024 = path.join(DIR.icon, 'concordia-icon-color-1024.png');
  const iconWhite1024 = path.join(DIR.mono, 'concordia-icon-white-1024.png');

  // OG light 1200x630 (wordmark)
  {
    const layer = await placeCentered(wmColor1024, 1200, 630, 0.78);
    await sharp({
      create: { width: 1200, height: 630, channels: 4, background: BG_LIGHT },
    })
      .composite([layer])
      .png({ compressionLevel: 9 })
      .toFile(path.join(DIR.social, 'concordia-social-og-light-1200x630.png'));
  }

  // OG dark 1200x630 (wordmark branco)
  {
    const layer = await placeCentered(wmWhite1024, 1200, 630, 0.78);
    await sharp({
      create: { width: 1200, height: 630, channels: 4, background: BG_DARK },
    })
      .composite([layer])
      .png({ compressionLevel: 9 })
      .toFile(path.join(DIR.social, 'concordia-social-og-dark-1200x630.png'));
  }

  // Square light 1080x1080 (wordmark)
  {
    const layer = await placeCentered(wmColor1024, 1080, 1080, 0.82);
    await sharp({
      create: { width: 1080, height: 1080, channels: 4, background: BG_LIGHT },
    })
      .composite([layer])
      .png({ compressionLevel: 9 })
      .toFile(path.join(DIR.social, 'concordia-social-square-light-1080.png'));
  }

  // Square dark 1080x1080 (wordmark branco)
  {
    const layer = await placeCentered(wmWhite1024, 1080, 1080, 0.82);
    await sharp({
      create: { width: 1080, height: 1080, channels: 4, background: BG_DARK },
    })
      .composite([layer])
      .png({ compressionLevel: 9 })
      .toFile(path.join(DIR.social, 'concordia-social-square-dark-1080.png'));
  }

  // Avatar light 1024x1024 (icon)
  {
    const layer = await placeCentered(iconColor1024, 1024, 1024, 0.76);
    await sharp({
      create: { width: 1024, height: 1024, channels: 4, background: BG_LIGHT },
    })
      .composite([layer])
      .png({ compressionLevel: 9 })
      .toFile(path.join(DIR.social, 'concordia-social-avatar-light-1024.png'));
  }

  // Avatar dark 1024x1024 (icon branco)
  {
    const layer = await placeCentered(iconWhite1024, 1024, 1024, 0.76);
    await sharp({
      create: { width: 1024, height: 1024, channels: 4, background: BG_DARK },
    })
      .composite([layer])
      .png({ compressionLevel: 9 })
      .toFile(path.join(DIR.social, 'concordia-social-avatar-dark-1024.png'));
  }

  // Banner X/Twitter 1500x500
  {
    const layer = await placeCentered(wmColor1024, 1500, 500, 0.64);
    await sharp({
      create: { width: 1500, height: 500, channels: 4, background: BG_LIGHT },
    })
      .composite([layer])
      .png({ compressionLevel: 9 })
      .toFile(path.join(DIR.social, 'concordia-social-banner-light-1500x500.png'));
  }

  {
    const layer = await placeCentered(wmWhite1024, 1500, 500, 0.64);
    await sharp({
      create: { width: 1500, height: 500, channels: 4, background: BG_DARK },
    })
      .composite([layer])
      .png({ compressionLevel: 9 })
      .toFile(path.join(DIR.social, 'concordia-social-banner-dark-1500x500.png'));
  }
}

async function main() {
  await ensureDirs();
  await createLightDarkFolders();
  await createSocial();
  console.log('Derivados gerados com sucesso.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
