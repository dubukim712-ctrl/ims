import { useState, type HTMLAttributes } from 'react';
import { CupSoda } from 'lucide-react';
import { cn } from '@/lib/cn';

interface DrinkThumbnailProps {
  imageUrl?: string | null;
  name: string;
  className?: HTMLAttributes<HTMLSpanElement>['className'];
}

export function DrinkThumbnail({ imageUrl, name, className }: DrinkThumbnailProps) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);

  return (
    <span
      className={cn(
        'flex shrink-0 items-center justify-center overflow-hidden bg-cream-100',
        className,
      )}
    >
      {imageUrl && failedUrl !== imageUrl ? (
        <img
          src={imageUrl}
          alt={name}
          loading="lazy"
          onError={() => setFailedUrl(imageUrl)}
          className="h-full w-full object-cover"
        />
      ) : (
        <CupSoda className="h-6 w-6 text-caramel-700" aria-hidden="true" />
      )}
    </span>
  );
}
