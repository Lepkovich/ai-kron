import fs from "fs";
import path from "path";

const KNOWLEDGE_PATH = "./knowledge";

export function loadKnowledgeFiles() {
  const files = [];

  function readDir(dir) {
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        readDir(fullPath);
      } else {
        files.push(fullPath);
      }
    }
  }

  readDir(KNOWLEDGE_PATH);

  return files;
}