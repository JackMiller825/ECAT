import { asset } from "@/lib/config";

type ArtProps = {
  file: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  pictureClassName?: string;
  priority?: boolean;
};

export default function Art({
  file,
  alt,
  width,
  height,
  className,
  pictureClassName,
  priority = false,
}: ArtProps) {
  return (
    <picture className={pictureClassName}>
      <source srcSet={asset(`${file}.avif`)} type="image/avif" />
      <source srcSet={asset(`${file}.webp`)} type="image/webp" />
      <img
        className={className}
        src={asset(`${file}.png`)}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
      />
    </picture>
  );
}
