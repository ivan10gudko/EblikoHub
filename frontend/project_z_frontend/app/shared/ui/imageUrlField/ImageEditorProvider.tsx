import { DEFAULT_IMAGE_PATH } from "~/shared/constants";
import { ImageEditorContext } from "./ImageEditorContext";
import { useImageEditor } from "./useImageEditor";
import type { ImageOrientation } from "~/shared/types";

interface ImageEditorProviderProps {
  children: React.ReactNode;
  imageUrl: string | null;
  onImageChange: (url: string | null) => void;
  defaultImage?: string;
  variant?: ImageOrientation;
}

export const ImageEditorProvider = ({
  children,
  imageUrl,
  onImageChange,
  defaultImage = DEFAULT_IMAGE_PATH,
  variant = "portrait",
}: ImageEditorProviderProps) => {
  const contextValues = useImageEditor({
    value: imageUrl,
    onChange: onImageChange,
  });

  return (
    <ImageEditorContext.Provider
      value={{ ...contextValues, imageUrl, variant, defaultImage }}
    >
      {children}
    </ImageEditorContext.Provider>
  );
};
