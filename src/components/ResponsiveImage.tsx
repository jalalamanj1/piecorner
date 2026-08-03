import React, { memo, useState } from 'react';
import { assetUrl } from '../lib/assetUrl';

interface ResponsiveImageProps {
  src?: string;
  srcSet?: string;
  sizes?: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  onError?: () => void;
}

/**
 * Image with responsive srcset, async decoding, and lazy loading.
 * `priority` marks the first-visible hero image (eager + high fetch priority).
 * Width/height are set from the intrinsic size to prevent layout shift (CLS).
 */
export const ResponsiveImage = memo(function ResponsiveImage({
  src,
  srcSet,
  sizes,
  alt,
  className,
  width,
  height,
  priority = false,
  onError,
}: ResponsiveImageProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) return null;

  const resolved = assetUrl(src);
  const resolvedSet = srcSet
    ? srcSet
        .split(',')
        .map((part) => {
          const [url, desc] = part.trim().split(/\s+/);
          return `${assetUrl(url)} ${desc}`;
        })
        .join(', ')
    : undefined;

  return (
    <img
      src={resolved}
      srcSet={resolvedSet}
      sizes={sizes}
      alt={alt}
      className={className}
      width={width}
      height={height}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : 'auto'}
      onError={() => {
        setFailed(true);
        onError?.();
      }}
    />
  );
});
