// Reads an image File, downscales it on a canvas (max ~900px, JPEG 0.82)
// and returns a base64 data payload the publish server can save to the repo.
export interface UploadedImage {
  path: string;   // e.g. "images/pizza1.jpg"
  base64: string; // raw base64 WITHOUT the "data:..." prefix
  mime: string;   // e.g. "image/jpeg"
}

function getExt(mime: string): string {
  if (mime === 'image/png') return 'png';
  if (mime === 'image/webp') return 'webp';
  if (mime === 'image/gif') return 'gif';
  return 'jpeg';
}

export function fileToImageData(
  file: File,
  itemId: string
): Promise<UploadedImage> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('تعذر قراءة الملف'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('الملف ليس صورة صالحة'));
      img.onload = () => {
        const maxDim = 900;
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          const ratio = Math.min(maxDim / width, maxDim / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('تعذر معالجة الصورة'));
        ctx.drawImage(img, 0, 0, width, height);
        const outMime = 'image/jpeg';
        const dataUrl = canvas.toDataURL(outMime, 0.82);
        const base64 = dataUrl.split(',')[1];
        const ext = getExt(outMime);
        resolve({
          path: `images/${itemId}.${ext}`,
          base64,
          mime: outMime,
        });
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export function dataUrlToImageData(dataUrl: string, itemId: string): UploadedImage {
  const [head, base64] = dataUrl.split(',');
  const mime = (head.match(/data:([^;]+)/) || [])[1] || 'image/jpeg';
  const ext = getExt(mime);
  return { path: `images/${itemId}.${ext}`, base64, mime };
}
