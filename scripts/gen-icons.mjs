import zlib from "node:zlib";
import { writeFileSync } from "node:fs";

const OUT = new URL("../public/", import.meta.url);

// --- tiny PNG encoder (RGBA, no deps) ---
const crcTable = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const tb = Buffer.from(type, "ascii");
  const body = Buffer.concat([tb, data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([len, body, crc]);
}
function encodePng(size, rgba) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  const stride = size * 4;
  const raw = Buffer.alloc((stride + 1) * size);
  for (let y = 0; y < size; y++) {
    raw[y * (stride + 1)] = 0; // filter none
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, y * stride + stride);
  }
  const idat = zlib.deflateSync(raw, { level: 9 });
  return Buffer.concat([
    sig,
    chunk("IHDR", ihdr),
    chunk("IDAT", idat),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

// --- draw the Batam Bites pin ---
const BRICK = [226, 85, 43];
const WHITE = [255, 255, 255];
const TEAL = [14, 124, 123];

function inTriangle(px, py, ax, ay, bx, by, cx, cy) {
  const d = (bx - ax) * (cy - ay) - (cx - ax) * (by - ay);
  const s = ((bx - ax) * (py - ay) - (px - ax) * (by - ay)) / d;
  const t = ((px - ax) * (cy - ay) - (cx - ax) * (py - ay)) / d;
  return s >= 0 && t >= 0 && s + t <= 1;
}

function makeIcon(size, { maskable }) {
  const buf = Buffer.alloc(size * size * 4);
  const S = size;
  const radius = maskable ? 0 : S * 0.22; // rounded corners unless maskable
  // pin layout fractions
  const L = maskable
    ? { hcy: 0.4, hr: 0.18, dr: 0.07, ay: 0.71, by: 0.45, hw: 0.13 }
    : { hcy: 0.42, hr: 0.225, dr: 0.088, ay: 0.8, by: 0.49, hw: 0.16 };
  const cx = 0.5 * S;
  const hcy = L.hcy * S,
    hr = L.hr * S,
    dr = L.dr * S;
  const ax = cx,
    ay = L.ay * S;
  const blx = cx - L.hw * S,
    brx = cx + L.hw * S,
    by = L.by * S;

  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      const i = (y * S + x) * 4;
      // rounded-corner clip
      let inside = true;
      if (radius > 0) {
        const rx = Math.min(x, S - 1 - x);
        const ry = Math.min(y, S - 1 - y);
        if (rx < radius && ry < radius) {
          const dx = radius - rx,
            dy = radius - ry;
          if (dx * dx + dy * dy > radius * radius) inside = false;
        }
      }
      if (!inside) {
        buf[i] = 0;
        buf[i + 1] = 0;
        buf[i + 2] = 0;
        buf[i + 3] = 0;
        continue;
      }
      let col = BRICK;
      const dxh = x + 0.5 - cx,
        dyh = y + 0.5 - hcy;
      const inHead = dxh * dxh + dyh * dyh <= hr * hr;
      const inTail = inTriangle(x + 0.5, y + 0.5, blx, by, brx, by, ax, ay);
      if (inHead || inTail) col = WHITE;
      if (dxh * dxh + dyh * dyh <= dr * dr) col = TEAL;
      buf[i] = col[0];
      buf[i + 1] = col[1];
      buf[i + 2] = col[2];
      buf[i + 3] = 255;
    }
  }
  return encodePng(S, buf);
}

writeFileSync(new URL("icon-192.png", OUT), makeIcon(192, { maskable: false }));
writeFileSync(new URL("icon-512.png", OUT), makeIcon(512, { maskable: false }));
writeFileSync(new URL("icon-512-maskable.png", OUT), makeIcon(512, { maskable: true }));
writeFileSync(new URL("apple-touch-icon.png", OUT), makeIcon(180, { maskable: true }));
console.log("icons generated: 192, 512, 512-maskable, apple-touch (180)");
