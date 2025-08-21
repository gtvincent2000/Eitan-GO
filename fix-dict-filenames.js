// fix-dict-filenames.js
const fs = require("fs");
const path = require("path");

const dictPath = path.join(__dirname, "lib", "kuromoji_dict");

fs.readdirSync(dictPath).forEach((file) => {
  if (file.endsWith(".gz.txt")) {
    const originalName = file.replace(/\.txt$/, "");
    const oldPath = path.join(dictPath, file);
    const newPath = path.join(dictPath, originalName);
    fs.renameSync(oldPath, newPath);
    console.log(`Renamed ${file} → ${originalName}`);
  }
});
