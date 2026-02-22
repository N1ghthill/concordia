import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const WORDMARK_SRC = '/home/irving/Downloads/ChatGPT Image 18 de fev. de 2026, 17_13_21.png';
const ICON_SRC = '/home/irving/Downloads/ChatGPT Image 18 de fev. de 2026, 17_11_33.png';
const OUT_DIR = '/home/irving/Downloads/Concordia/concordia-export-pack-fixed';

const WORDMARK_SIZES = [1024, 512, 256, 128];
const ICON_SIZES = [1024, 512, 256, 128, 64, 32];

const COLORS = {
  color: null,
  black: { r: 17, g: 17, b: 17 },
  white: { r: 255, g: 255, b: 255 },
};

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function detectBg(data, width, height) {
  const sample = 24;
  const points = [
    [0, 0],
    [width - sample, 0],
    [0, height - sample],
    [width - sample, height - sample],
  ];
  let r = 0;
  let g = 0;
  let b = 0;
  let count = 0;

  for (const [sx, sy] of points) {
    const ex = clamp(sx + sample, 0, width);
    const ey = clamp(sy + sample, 0, height);
    for (let y = sy; y < ey; y++) {
      for (let x = sx; x < ex; x++) {
        const i = (y * width + x) * 4;
        r += data[i + 0];
        g += data[i + 1];
        b += data[i + 2];
        count++;
      }
    }
  }

  return {
    r: Math.round(r / count),
    g: Math.round(g / count),
    b: Math.round(b / count),
  };
}

function matteToAlpha(data, bg, low = 4, high = 34) {
  const out = Buffer.allocUnsafe(data.length);

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i + 0];
    const g = data[i + 1];
    const b = data[i + 2];

    const d = Math.max(
      Math.abs(r - bg.r),
      Math.abs(g - bg.g),
      Math.abs(b - bg.b)
    );

    let a;
    if (d <= low) a = 0;
    else if (d >= high) a = 255;
    else a = Math.round(((d - low) / (high - low)) * 255);

    if (a === 0) {
      out[i + 0] = 0;
      out[i + 1] = 0;
      out[i + 2] = 0;
      out[i + 3] = 0;
      continue;
    }

    const af = a / 255;
    const rf = (r - (1 - af) * bg.r) / af;
    const gf = (g - (1 - af) * bg.g) / af;
    const bf = (b - (1 - af) * bg.b) / af;

    out[i + 0] = clamp(Math.round(rf), 0, 255);
    out[i + 1] = clamp(Math.round(gf), 0, 255);
    out[i + 2] = clamp(Math.round(bf), 0, 255);
    out[i + 3] = a;
  }

  return out;
}

function alphaBBox(data, width, height, threshold = 6) {
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const a = data[(y * width + x) * 4 + 3];
      if (a <= threshold) continue;
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }
  }

  if (maxX < 0) throw new Error('No visible pixels found');

  return {
    left: minX,
    top: minY,
    width: maxX - minX + 1,
    height: maxY - minY + 1,
  };
}

async function loadIsolated(sourcePath, extraPadRatio = 0.03) {
  const { data, info } = await sharp(sourcePath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const bg = detectBg(data, info.width, info.height);
  const isolated = matteToAlpha(data, bg);
  const box = alphaBBox(isolated, info.width, info.height);

  const pad = Math.round(Math.min(box.width, box.height) * extraPadRatio);
  const left = clamp(box.left - pad, 0, info.width - 1);
  const top = clamp(box.top - pad, 0, info.height - 1);
  const right = clamp(box.left + box.width - 1 + pad, 0, info.width - 1);
  const bottom = clamp(box.top + box.height - 1 + pad, 0, info.height - 1);
  const width = right - left + 1;
  const height = bottom - top + 1;

  return sharp(isolated, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .extract({ left, top, width, height })
    .png()
    .toBuffer();
}

async function recolor(buffer, color) {
  const { data, info } = await sharp(buffer)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const alpha = Buffer.alloc(info.width * info.height);
  for (let i = 0, j = 0; i < data.length; i += 4, j++) {
    alpha[j] = data[i + 3];
  }

  return sharp({
    create: {
      width: info.width,
      height: info.height,
      channels: 3,
      background: color,
    },
  })
    .joinChannel(alpha, { raw: { width: info.width, height: info.height, channels: 1 } })
    .png({ compressionLevel: 9 })
    .toBuffer();
}

async function renderWordmark(baseBuffer, targetWidth, mode) {
  const meta = await sharp(baseBuffer).metadata();
  const ratio = meta.height / meta.width;
  const targetHeight = Math.max(1, Math.round(targetWidth * ratio));

  const padX = Math.round(targetWidth * 0.03);
  const padY = Math.max(1, Math.round(targetHeight * 0.06));

  const innerW = Math.max(1, targetWidth - padX * 2);
  const innerH = Math.max(1, targetHeight - padY * 2);

  let resized = await sharp(baseBuffer)
    .resize({
      width: innerW,
      height: innerH,
      fit: 'inside',
      kernel: 'lanczos3',
      withoutEnlargement: false,
    })
    .png()
    .toBuffer();

  if (mode !== 'color') resized = await recolor(resized, COLORS[mode]);

  const rMeta = await sharp(resized).metadata();
  const left = Math.floor((targetWidth - rMeta.width) / 2);
  const top = Math.floor((targetHeight - rMeta.height) / 2);

  return sharp({
    create: {
      width: targetWidth,
      height: targetHeight,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: resized, left, top }])
    .png({ compressionLevel: 9 })
    .toBuffer();
}

async function renderIcon(baseBuffer, size, mode) {
  const pad = Math.round(size * 0.12);
  const inner = Math.max(1, size - pad * 2);

  let resized = await sharp(baseBuffer)
    .resize({
      width: inner,
      height: inner,
      fit: 'inside',
      kernel: 'lanczos3',
      withoutEnlargement: false,
    })
    .png()
    .toBuffer();

  if (mode !== 'color') resized = await recolor(resized, COLORS[mode]);

  const rMeta = await sharp(resized).metadata();
  const left = Math.floor((size - rMeta.width) / 2);
  const top = Math.floor((size - rMeta.height) / 2);

  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: resized, left, top }])
    .png({ compressionLevel: 9 })
    .toBuffer();
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });

  const wordmarkBase = await loadIsolated(WORDMARK_SRC, 0.02);
  const iconBase = await loadIsolated(ICON_SRC, 0.04);

  for (const size of WORDMARK_SIZES) {
    for (const mode of ['color', 'black', 'white']) {
      const out = await renderWordmark(wordmarkBase, size, mode);
      const file = `concordia-wordmark-${mode}-${size}.png`;
      await fs.writeFile(path.join(OUT_DIR, file), out);
    }
  }

  for (const size of ICON_SIZES) {
    for (const mode of ['color', 'black', 'white']) {
      const out = await renderIcon(iconBase, size, mode);
      const file = `concordia-icon-${mode}-${size}.png`;
      await fs.writeFile(path.join(OUT_DIR, file), out);
    }
  }

  console.log(`Export complete: ${OUT_DIR}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
