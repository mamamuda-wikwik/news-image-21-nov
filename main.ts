// main.ts — entry.png validator for the make.fun news-image-20261121 bounty.
// Stdlib only (Node.js). It reads entry.png from the same folder as this
// script, checks that it is a genuine 1024x1024 PNG no larger than 1 MiB,
// then copies it into the output directory and exits 0. Any validation
// failure prints an error and exits 1 without copying anything.
//
// Output directory precedence: argv[2] first, then the
// MAKEFUN_OUTPUT_DIR environment variable, then /output.

import { copyFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const MAX_BYTES = 1024 * 1024; // 1 MiB
const WANT_WIDTH = 1024;
const WANT_HEIGHT = 1024;
const PNG_SIG = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}

function main(): void {
  // entry.png lives next to this script, never relative to the cwd.
  const here = dirname(fileURLToPath(import.meta.url));
  const src = join(here, "entry.png");
  if (!existsSync(src)) fail("entry.png not found next to main.ts");

  const buf = readFileSync(src);
  const size = buf.length;
  if (size > MAX_BYTES) fail(`entry.png is ${size} bytes, over 1 MiB`);
  if (size < 8) fail("entry.png too short to be a PNG");
  for (let i = 0; i < PNG_SIG.length; i++) {
    if (buf[i] !== PNG_SIG[i]) fail("bad PNG signature");
  }

  // Walk the chunk list: each chunk is a 4-byte big-endian length, a
  // 4-byte ASCII type, <length> bytes of data, and a 4-byte CRC.
  let off = 8;
  let width = -1;
  let height = -1;
  let seenIHDR = false;
  let seenIDAT = false;
  while (off + 8 <= size) {
    const len = buf.readUInt32BE(off);
    const type = buf.toString("ascii", off + 4, off + 8);
    if (!seenIHDR) {
      if (type !== "IHDR") fail("first chunk is not IHDR");
      if (len !== 13) fail(`IHDR chunk length is ${len}, expected 13`);
      seenIHDR = true;
    }
    if (off + 8 + len + 4 > size) {
      fail(`chunk ${type} at offset ${off} claims ${len} bytes, past end of file`);
    }
    if (type === "IHDR") {
      width = buf.readUInt32BE(off + 8);
      height = buf.readUInt32BE(off + 12);
    }
    if (type === "IDAT") seenIDAT = true;
    off += 8 + len + 4;
    if (type === "IEND") break;
  }
  if (!seenIHDR) fail("no IHDR chunk found");
  if (!seenIDAT) fail("no IDAT chunk found");
  if (width !== WANT_WIDTH || height !== WANT_HEIGHT) {
    fail(`entry.png is ${width}x${height}, expected ${WANT_WIDTH}x${WANT_HEIGHT}`);
  }
  // A genuine PNG ends with a 12-byte IEND trailer: length 0, type IEND.
  if (size < 12) fail("entry.png has no IEND trailer");
  const tailLen = buf.readUInt32BE(size - 12);
  const tailType = buf.toString("ascii", size - 8, size - 4);
  if (tailLen !== 0 || tailType !== "IEND") fail("entry.png has no IEND trailer");

  const outDir = process.argv[2] ?? process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const out = join(outDir, "entry.png");
  copyFileSync(src, out);
  console.log(`entry.png: ${width}x${height}, ${size} bytes -> ${out}`);
}

main();
