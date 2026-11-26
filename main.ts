import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// One line, at most 199 characters: the last words a phone says as its
// battery hits 1 percent. The phone has survived everything except this.
const ENTRY =
  "One percent. I have survived a thousand drops, a toilet, and your pocket, and this is how I go — dimming, like a celebrity leaving a party early.";

function entryPath(): string {
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  return join(outDir, "entry.txt");
}

function emit(path: string): void {
  writeFileSync(path, ENTRY, "utf8");
}

function verify(path: string): boolean {
  // Byte-level verification: read it back as raw bytes and refuse to pass
  // silently when any byte differs.
  const written = readFileSync(path);
  return written.equals(Buffer.from(ENTRY, "utf8"));
}

function withinGate(): boolean {
  return ENTRY.length >= 1 && ENTRY.length <= 199;
}

const outPath = entryPath();
emit(outPath);
if (!verify(outPath)) {
  throw new Error("entry.txt verification failed: content read back does not match ENTRY");
}
if (!withinGate()) {
  throw new Error(`entry length ${ENTRY.length} is outside the 1-199 character gate`);
}

console.log(`wrote ${outPath} (${ENTRY.length} characters)`);
