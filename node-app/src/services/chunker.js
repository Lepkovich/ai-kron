export function chunkText(text, size = 500, overlap = 100) {

  const chunks = [];
  let start = 0;

  while (start < text.length) {

    const chunk = text.slice(start, start + size);
    chunks.push(chunk);

    start += size - overlap;
  }

  return chunks;
}