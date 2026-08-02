// Resolves an image path/URL for display.
// - Absolute URLs (http/https/data) pass through unchanged.
// - Relative paths like "images/p1.jpg" are resolved against the
//   Vite base URL so they work in dev ("/") and on GitHub Pages ("/piecorner/").
export function resolveImageUrl(src?: string): string | undefined {
  if (!src) return undefined;
  if (/^(https?:|data:)/i.test(src)) return src;
  const cleaned = src.replace(/^\/+/, '');
  const base = import.meta.env.BASE_URL || '/';
  return base + cleaned;
}
