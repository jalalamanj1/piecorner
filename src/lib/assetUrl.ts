// Resolves an asset reference (relative path like "images/slide-1.webp") to a
// URL that works under the app's base path (e.g. /piecorner/ on GitHub Pages).
// Absolute URLs and data: URIs are returned unchanged.
export function assetUrl(src?: string): string {
  if (!src) return '';
  if (src.startsWith('data:') || src.startsWith('http://') || src.startsWith('https://') || src.startsWith('blob:') || src.startsWith('/')) {
    return src;
  }
  return import.meta.env.BASE_URL + src;
}
