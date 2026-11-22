import { useEffect, useState } from 'react';
import { Field } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { DrinkThumbnail } from '@/components/ui/DrinkThumbnail';

interface DrinkImagePickerProps {
  id: string;
  name: string;
  imageUrl?: string | null;
  file: File | null;
  onChange: (file: File | null) => void;
}

export function DrinkImagePicker({
  id,
  name,
  imageUrl,
  file,
  onChange,
}: DrinkImagePickerProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  return (
    <Field
      label="Drink image"
      htmlFor={id}
      hint="JPEG, PNG, WebP or GIF; up to 5 MB."
    >
      <div className="flex items-center gap-3">
        <DrinkThumbnail
          imageUrl={previewUrl ?? imageUrl}
          name={name}
          className="h-14 w-14 rounded-xl"
        />
        <Input
          id={id}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={(event) => onChange(event.target.files?.[0] ?? null)}
          className="h-auto min-w-0 flex-1 py-2 file:mr-2 file:rounded-lg file:border-0 file:bg-cream-100 file:px-2 file:py-1 file:text-xs file:font-semibold file:text-espresso-700"
        />
      </div>
    </Field>
  );
}
