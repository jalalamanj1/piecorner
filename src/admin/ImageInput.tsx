import React, { useRef } from 'react';
import { ImagePlus, Upload, X } from 'lucide-react';

interface ImageInputProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
}

// Optimization limits: anything above these gets downscaled/re-encoded so the
// saved data stays small (well under the localStorage quota).
const MAX_DIM = 1400;
const QUALITY = 0.82;
const KEEP_BELOW_BYTES = 350 * 1024;

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ''));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function loadImage(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('image decode failed'));
    img.src = dataUrl;
  });
}

async function optimizeImage(dataUrl: string, originalSize: number): Promise<string> {
  const img = await loadImage(dataUrl);
  const scale = Math.min(1, MAX_DIM / Math.max(img.naturalWidth, img.naturalHeight));
  // Keep the original untouched when it is already small and fits the canvas.
  if (scale >= 1 && originalSize <= KEEP_BELOW_BYTES) return dataUrl;

  const w = Math.max(1, Math.round(img.naturalWidth * scale));
  const h = Math.max(1, Math.round(img.naturalHeight * scale));
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return dataUrl;

  ctx.drawImage(img, 0, 0, w, h);

  const isPng = dataUrl.startsWith('data:image/png');
  const supportsWebp = canvas.toDataURL('image/webp').startsWith('data:image/webp');
  if (isPng && supportsWebp) return canvas.toDataURL('image/webp', QUALITY);
  if (isPng) return canvas.toDataURL('image/png');
  return canvas.toDataURL('image/jpeg', QUALITY);
}

export const ImageInput: React.FC<ImageInputProps> = ({ label, value, onChange }) => {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('يرجى اختيار ملف صورة صحيح');
      return;
    }
    try {
      const dataUrl = await fileToDataUrl(file);
      const optimized = await optimizeImage(dataUrl, file.size);
      onChange(optimized);
    } catch {
      alert('تعذر معالجة الصورة، يرجى المحاولة مرة أخرى');
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        e.preventDefault();
        const file = item.getAsFile();
        if (file) handleFile(file);
        return;
      }
    }
  };

  return (
    <div onPaste={handlePaste}>
      <label className="text-[11px] font-bold text-[#222222] block mb-1">{label}</label>
      {value ? (
        <div className="relative w-28 h-28 rounded-2xl overflow-hidden border border-[#ECECEC] bg-[#FAFAF8]">
          <img src={value} alt="معاينة الصورة" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/50 text-white flex items-center justify-center cursor-pointer hover:bg-black/70"
            aria-label="إزالة الصورة"
            title="إزالة الصورة"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="w-full flex flex-col items-center justify-center gap-1.5 py-5 rounded-2xl border-2 border-dashed border-[#E0E0DA] bg-[#FAFAF8] text-[#777777] hover:border-[#4CAF50] hover:text-[#4CAF50] transition-all cursor-pointer"
        >
          <ImagePlus className="w-6 h-6" />
          <span className="text-xs font-semibold">اضغط للرفع</span>
          <span className="text-[10px]">أو الصق صورة من الحافظة (Ctrl+V)</span>
        </button>
      )}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = '';
        }}
      />
      {value && (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="mt-2 w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#4CAF50]/10 border border-[#4CAF50]/20 text-[#4CAF50] text-xs font-semibold cursor-pointer hover:bg-[#4CAF50]/20 transition-all"
        >
          <Upload className="w-3.5 h-3.5" />
          تغيير الصورة أو لصقها من الحافظة (Ctrl+V)
        </button>
      )}
    </div>
  );
};
