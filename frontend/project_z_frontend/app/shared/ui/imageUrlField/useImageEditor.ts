import { useState, useEffect } from "react";

interface UseImageEditorProps {
  value: string | null;
  onChange: (url: string | null) => void;
}

export const useImageEditor = ({ value, onChange }: UseImageEditorProps) => {
  const [tempUrl, setTempUrl] = useState(value || "");
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setTempUrl(value || "");
    setImageError(false);
  }, [value]);

  const handleUrlChange = (newValue: string) => {
    setTempUrl(newValue);
    setImageError(false);

    if (!newValue.trim()) {
      onChange(null);
    } else if (newValue.match(/^https?:\/\/.+/)) {
      onChange(newValue);
    }
  };

  const handleClearImage = () => {
    setTempUrl("");
    onChange(null);
    setImageError(false);
  };

  const handleImageError = () => setImageError(true);

  return {
    tempUrl,
    imageError,
    handleUrlChange,
    handleClearImage,
    handleImageError,
    hasValidImage: !!value && !imageError,
  };
};