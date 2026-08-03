import React, { useState } from 'react';
import { resolveImageUrl } from '../utils/image';

interface SmartImageProps {
  src?: string;
  alt: string;
  emoji: string;
  imgClassName?: string;
  wrapperClassName?: string;
  emojiClassName?: string;
}

// Renders an image with lazy loading + async decoding, and falls back to an
// emoji tile if the image is missing or fails to load (no broken-image icons).
export const SmartImage: React.FC<SmartImageProps> = ({
  src,
  alt,
  emoji,
  imgClassName,
  wrapperClassName,
  emojiClassName,
}) => {
  const [failed, setFailed] = useState(false);
  const resolved = resolveImageUrl(src);
  const showFallback = !resolved || failed;

  return (
    <div className={wrapperClassName}>
      {showFallback ? (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#E85D04]/25 to-[#FFBA08]/10">
          <span className={emojiClassName}>{emoji}</span>
        </div>
      ) : (
        <img
          src={resolved}
          alt={alt}
          className={imgClassName}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
};
