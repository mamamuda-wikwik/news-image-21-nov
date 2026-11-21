// main.ts — THE WORLD, 21 November 2026 (make.fun news-image-20261121)
//
// Takes the front-page image entry.png that sits next to this script,
// checks it is exactly what the bounty asks for, and copies it into an
// output directory.
//
// The grader runs `node /bot/main.ts` with no arguments, the repository
// mounted read-only at /bot and an empty writable directory at /output —
// so with no argument the output defaults to /output, and entry.png is
// found from this script's own location, never from the working directory
// (Node's TypeScript stripping has no __dirname, and the grader starts
// the process from elsewhere).
//
// Usage: node main.ts [out-dir]
//
// The image must be a genuine PNG: the 8-byte signature, a first chunk
// of type IHDR whose length field reads exactly 13, a 12-byte IEND
// trailer at the end, exactly 1024x1024 pixels, and at most 1 MiB in
// total. Anything else fails loudly, exits non-zero, and copies nothing.

import { copyFileSync, existsSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const ONE_MIB = 1024 * 1024;
const WANT_WIDTH = 1024;
const WANT_HEIGHT = 1024;

function die(msg: string): never {
  console.error(`error: ${msg}`);
  process.exit(1);
}

function run(): void {
  // The grader passes no arguments and mounts the output at /output; it
  // also sets MAKEFUN_OUTPUT_DIR=/output in the environment. A directory
  // given on the command line wins, then the environment, then /output.
  const outDir = process.argv[2] ?? process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

  // entry.png lives beside this file. import.meta.url is the only location
  // that is reliable under Node's TypeScript stripping.
  const here = dirname(fileURLToPath(import.meta.url));
  const src = join(here, "entry.png");
  if (!existsSync(src)) {
    die(`entry.png not found next to main.ts (looked at ${src})`);
  }

  const bytes = statSync(src).size;
  if (bytes > ONE_MIB) {
    die(`entry.png is ${bytes} bytes, over the 1 MiB limit`);
  }

  const data = readFileSync(src);
  if (data.length < 8 || !data.subarray(0, 8).equals(PNG_MAGIC)) {
    die("entry.png is not a PNG file (bad signature)");
  }
  if (data.length < 25) {
    die("entry.png is too short to hold a PNG header");
  }

  // The first chunk must be IHDR and its length field must read exactly 13.
  const ihdrLength = data.readUInt32BE(8);
  const ihdrType = data.subarray(12, 16).toString("ascii");
  if (ihdrType !== "IHDR") {
    die(`first chunk is ${ihdrType}, expected IHDR`);
  }
  if (ihdrLength !== 13) {
    die(`IHDR chunk length is ${ihdrLength}, expected 13`);
  }

  const width = data.readUInt32BE(16);
  const height = data.readUInt32BE(20);
  if (width !== WANT_WIDTH || height !== WANT_HEIGHT) {
    die(`entry.png is ${width}x${height}, expected ${WANT_WIDTH}x${WANT_HEIGHT}`);
  }

  // A real image also carries at least one IDAT chunk. Walk the chunk
  // headers from the end of IHDR (offset 33) until IEND or the end of
  // the file; a missing IDAT means the file is a hollow PNG.
  let offset = 8 + 4 + 4 + 13 + 4;
  let sawIdat = false;
  while (offset + 8 <= data.length) {
    const len = data.readUInt32BE(offset);
    const type = data.subarray(offset + 4, offset + 8).toString("ascii");
    if (type === "IDAT") {
      sawIdat = true;
      break;
    }
    if (type === "IEND") break;
    offset += 12 + len;
  }
  if (!sawIdat) {
    die("entry.png has no IDAT chunk (no image data)");
  }

  // The file must end with a 12-byte IEND chunk: length 0, type IEND.
  const tail = data.subarray(data.length - 12);
  if (tail.readUInt32BE(0) !== 0 || tail.subarray(4, 8).toString("ascii") !== "IEND") {
    die("entry.png has no IEND trailer");
  }

  mkdirSync(outDir, { recursive: true });
  const dest = join(outDir, "entry.png");
  copyFileSync(src, dest);
  // Make sure the copy landed whole before calling it done.
  if (statSync(dest).size !== bytes) {
    die(`copy incomplete: ${dest} is ${statSync(dest).size} bytes, expected ${bytes}`);
  }
  console.log(`entry.png: ${width}x${height}, ${bytes} bytes -> ${dest}`);
}

run();
