import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function createPNG(width, height, drawFn) {
  // RGBA buffer: (width * 4 + 1) * height
  const rowSize = width * 4 + 1;
  const rawData = Buffer.alloc(rowSize * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter type: None

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      const [r, g, b, a] = drawFn(x, y, width, height);
      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  const compressed = zlib.deflateSync(rawData);

  // PNG Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // Bit depth: 8
  ihdrData[9] = 6; // Color type: RGBA (6)
  ihdrData[10] = 0; // Compression: Deflate
  ihdrData[11] = 0; // Filter
  ihdrData[12] = 0; // Interlace: None
  const ihdr = makeChunk('IHDR', ihdrData);

  // IDAT chunk
  const idat = makeChunk('IDAT', compressed);

  // IEND chunk
  const iend = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdr, idat, iend]);
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcData = Buffer.concat([typeBuf, data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(crcData), 0);
  return Buffer.concat([len, typeBuf, data, crc]);
}

// CRC32 implementation
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

// Drawing function for ExpenseWise App Icon
function drawAppIcon(x, y, w, h, isMaskable = false) {
  const cx = w / 2;
  const cy = h / 2;
  const radius = isMaskable ? w * 0.48 : w * 0.42;

  const dx = x - cx;
  const dy = y - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);

  // Background: Clay #EAE6DF
  const bgR = 0xea, bgG = 0xe6, bgB = 0xdf;

  if (isMaskable) {
    // Fill full background with clay
    // Draw centered circle with blue brand mark
    if (dist <= radius) {
      // Circle gradient: Electric blue (#0047FF to #0038D1)
      const grad = (y / h);
      const r = Math.floor(0x00 * (1 - grad) + 0x00 * grad);
      const g = Math.floor(0x47 * (1 - grad) + 0x30 * grad);
      const b = Math.floor(0xff * (1 - grad) + 0xd0 * grad);

      // Inner icon shape: Currency / Ledger mark (white)
      // Horizontal bar and diagonal arrows
      const nx = (x - cx) / radius;
      const ny = (y - cy) / radius;

      // Draw stylized 'E' / 'W' symbol in center
      if (Math.abs(nx) < 0.45 && Math.abs(ny) < 0.45) {
        // Vertical left spine
        if (nx > -0.35 && nx < -0.18 && ny > -0.32 && ny < 0.32) {
          return [255, 255, 255, 255];
        }
        // Top bar
        if (nx >= -0.18 && nx < 0.32 && ny > -0.32 && ny < -0.18) {
          return [255, 255, 255, 255];
        }
        // Middle bar
        if (nx >= -0.18 && nx < 0.20 && ny > -0.07 && ny < 0.07) {
          return [255, 255, 255, 255];
        }
        // Bottom bar
        if (nx >= -0.18 && nx < 0.32 && ny > 0.18 && ny < 0.32) {
          return [255, 255, 255, 255];
        }
      }

      return [r, g, b, 255];
    }
    return [bgR, bgG, bgB, 255];
  }

  // Non-maskable with soft rounded Neumorphic clay badge
  const cornerRadius = w * 0.22;
  // Rounded square SDF
  const qx = Math.abs(x - cx) - (w / 2 - cornerRadius - 4);
  const qy = Math.abs(y - cy) - (h / 2 - cornerRadius - 4);
  const dOuter = Math.min(Math.max(qx, qy), 0.0) + Math.hypot(Math.max(qx, 0.0), Math.max(qy, 0.0)) - cornerRadius;

  if (dOuter <= 0) {
    // Inside badge:
    // Inner circle
    const innerRad = w * 0.32;
    if (dist <= innerRad) {
      const grad = y / h;
      const r = Math.floor(0x00 * (1 - grad) + 0x00 * grad);
      const g = Math.floor(0x47 * (1 - grad) + 0x30 * grad);
      const b = Math.floor(0xff * (1 - grad) + 0xd0 * grad);

      const nx = (x - cx) / innerRad;
      const ny = (y - cy) / innerRad;

      // Stylized 'E' mark
      if (nx > -0.35 && nx < -0.18 && ny > -0.32 && ny < 0.32) {
        return [255, 255, 255, 255];
      }
      if (nx >= -0.18 && nx < 0.32 && ny > -0.32 && ny < -0.18) {
        return [255, 255, 255, 255];
      }
      if (nx >= -0.18 && nx < 0.20 && ny > -0.07 && ny < 0.07) {
        return [255, 255, 255, 255];
      }
      if (nx >= -0.18 && nx < 0.32 && ny > 0.18 && ny < 0.32) {
        return [255, 255, 255, 255];
      }

      return [r, g, b, 255];
    }

    // Badge body with subtle Neumorphic gradient
    const light = (dx + dy) / (w + h);
    const cr = Math.min(255, Math.max(0, Math.floor(bgR + light * 15)));
    const cg = Math.min(255, Math.max(0, Math.floor(bgG + light * 15)));
    const cb = Math.min(255, Math.max(0, Math.floor(bgB + light * 15)));
    return [cr, cg, cb, 255];
  }

  // Transparent outside
  return [0, 0, 0, 0];
}

const iconsDir = path.join(process.cwd(), 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

console.log('Generating PWA icons...');

fs.writeFileSync(
  path.join(iconsDir, 'icon-192x192.png'),
  createPNG(192, 192, (x, y, w, h) => drawAppIcon(x, y, w, h, false))
);
console.log('✓ Created icon-192x192.png');

fs.writeFileSync(
  path.join(iconsDir, 'icon-512x512.png'),
  createPNG(512, 512, (x, y, w, h) => drawAppIcon(x, y, w, h, false))
);
console.log('✓ Created icon-512x512.png');

fs.writeFileSync(
  path.join(iconsDir, 'icon-maskable-512x512.png'),
  createPNG(512, 512, (x, y, w, h) => drawAppIcon(x, y, w, h, true))
);
console.log('✓ Created icon-maskable-512x512.png');

fs.writeFileSync(
  path.join(iconsDir, 'apple-touch-icon.png'),
  createPNG(180, 180, (x, y, w, h) => drawAppIcon(x, y, w, h, true))
);
console.log('✓ Created apple-touch-icon.png');

console.log('All PWA icons generated successfully.');
