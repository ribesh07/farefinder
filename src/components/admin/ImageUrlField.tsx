"use client";

import { useState } from "react";
import { UseFormRegister, FieldValues, Path } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ImageIcon } from "lucide-react";

type ImageUrlFieldProps<T extends FieldValues> = {
  label: string;
  name: Path<T>;
  register: UseFormRegister<T>;
  value?: string;
  required?: boolean;
  placeholder?: string;
};

export function ImageUrlField<T extends FieldValues>({
  label,
  name,
  register,
  value = "",
  required = true,
  placeholder = "https://example.com/image.jpg",
}: ImageUrlFieldProps<T>) {
  const [imageError, setImageError] = useState(false);
  const trimmedValue = value ? value.trim() : "";

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input
        {...register(name, { required })}
        type="url"
        placeholder={placeholder}
        onChange={(event) => {
          setImageError(false);
          register(name).onChange(event);
        }}
      />
      <p className="text-xs text-gray-500">
        Paste a direct image URL. No file upload needed.
      </p>
      {trimmedValue && (
        <div className="overflow-hidden rounded-lg border bg-gray-50 dark:bg-gray-900">
          {!imageError ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={trimmedValue}
              alt="Preview"
              className="h-40 w-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex h-40 flex-col items-center justify-center gap-2 text-sm text-gray-500">
              <ImageIcon className="h-8 w-8" />
              <span>Could not load image preview</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
