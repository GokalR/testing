import React from 'react';

/**
 * Replacement for next/image — renders a plain <img> tag.
 */

interface ImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  sizes?: string;
  className?: string;
  style?: React.CSSProperties;
  priority?: boolean;
  [key: string]: unknown;
}

export default function Image({
  src,
  alt,
  width,
  height,
  fill,
  sizes,
  className,
  style,
  priority,
  ...rest
}: ImageProps) {
  const imgStyle: React.CSSProperties = { ...style };

  if (fill) {
    imgStyle.position = 'absolute';
    imgStyle.top = 0;
    imgStyle.left = 0;
    imgStyle.width = '100%';
    imgStyle.height = '100%';
    imgStyle.objectFit = imgStyle.objectFit || 'cover';
  }

  return (
    <img
      src={src}
      alt={alt}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      className={className}
      style={imgStyle}
      loading={priority ? 'eager' : 'lazy'}
      {...rest}
    />
  );
}
