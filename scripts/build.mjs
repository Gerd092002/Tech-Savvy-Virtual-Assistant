import { spawnSync } from "node:child_process";
import { mkdirSync, copyFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const output = resolve(root, "dist");
const stylesheet = resolve(root, "styles.css");
const cli = resolve(root, "node_modules", "@tailwindcss", "cli", "dist", "index.mjs");

mkdirSync(output, { recursive: true });
const build = spawnSync(process.execPath, [
  cli,
  "-i", resolve(root, "src", "styles.css"),
  "-o", stylesheet,
  "--minify"
], { cwd: root, stdio: "inherit" });

if (build.error) throw build.error;
if (build.status !== 0) process.exit(build.status ?? 1);

copyFileSync(resolve(root, "index.html"), resolve(output, "index.html"));
copyFileSync(stylesheet, resolve(output, "styles.css"));
