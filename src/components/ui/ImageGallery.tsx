import { useState } from 'react';
import { cn } from '@/lib/utils';
import { optimizeImage } from '@/lib/cloudinary';
import { Modal } from './Modal';

interface ImageGalleryProps {
  images: string[];
  alt: string;
}

const PLACEHOLDER =
  'https://placehold.co/1280x720/141414/888888?text=Sin+imagen';

export function ImageGallery({ images, alt }: ImageGalleryProps) {
  const safeImages = images.length > 0 ? images : [PLACEHOLDER];
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const current = safeImages[active];

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={() => setLightbox(true)}
        className="press group relative aspect-video max-h-150 overflow-hidden rounded-md border border-border bg-surface"
        aria-label="Ampliar imagen"
      >
        <img
          // key changes per selection → the crossfade keyframe replays.
          key={active}
          src={optimizeImage(current, { width: 1280 })}
          alt={alt}
          className="gallery-fade size-full object-cover transition-transform duration-300 ease-out-strong group-hover:scale-[1.02]"
        />
      </button>

      {safeImages.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {safeImages.map((img, i) => (
            <button
              key={img + i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Ver imagen ${i + 1}`}
              aria-current={i === active}
              className={cn(
                'press relative aspect-square overflow-hidden rounded-lg border-2 transition-colors duration-150',
                i === active
                  ? 'border-accent'
                  : 'border-border hover:border-muted',
              )}
            >
              <img
                src={optimizeImage(img, { width: 240, height: 240 })}
                alt={`${alt} miniatura ${i + 1}`}
                className="size-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      <Modal
        open={lightbox}
        onClose={() => setLightbox(false)}
        maxWidth="max-w-4xl"
        bare
      >
        <img
          src={optimizeImage(current, { width: 1600 })}
          alt={alt}
          className="max-h-[85vh] w-full rounded-xl object-contain"
        />
      </Modal>
    </div>
  );
}
