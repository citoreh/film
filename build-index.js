#!/usr/bin/env node
// Scans ./data (recursively) for *.csv and writes ./index.json for the static page.
// Runs automatically in GitHub Actions on every push; you can also run it locally.
const fs = require("fs");
const path = require("path");

const DATA = path.join(__dirname, "data");
const OUT = path.join(__dirname, "index.json");

function findCsv(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) findCsv(p, out);
    else if (/\.csv$/i.test(e.name)) out.push(p);
  }
  return out;
}

const files = findCsv(DATA).sort().map((file) => {
  const lines = fs
    .readFileSync(file, "utf8")
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .filter((l) => l.length);
  return {
    file: path.relative(DATA, file),
    header: lines[0] || "",
    rows: lines.slice(1),
  };
});

fs.writeFileSync(OUT, JSON.stringify({ built: new Date().toISOString(), files }));
console.log(`Indexed ${files.length} file(s), ${files.reduce((a, f) => a + f.rows.length, 0)} rows -> index.json`);
