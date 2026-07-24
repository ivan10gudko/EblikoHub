import { DEFAULT_IMAGE_PATH } from "~/shared/constants";
import type { ImageOrientation } from "~/shared/types";
import { ImageUrlField } from "~/shared/ui/imageUrlField";

interface TitleImageEditorProps {
  imageUrl: string | null;
  onImageChange: (url: string | null) => void;
  defaultImage?: string;
  variant?: ImageOrientation;
}

export const ImageUrlEditor = ({
  imageUrl,
  onImageChange,
  defaultImage = DEFAULT_IMAGE_PATH,
  variant = "portrait",
}: TitleImageEditorProps) => {
  return (
    <ImageUrlField
      imageUrl={imageUrl}
      onImageChange={onImageChange}
      defaultImage={defaultImage}
      variant={variant}
    >
      <div className="flex flex-col items-center gap-6 w-full">
        <ImageUrlField.Preview />

        <div className="w-full">
          <ImageUrlField.Input />

          <ImageUrlField.Tip />
        </div>
      </div>
    </ImageUrlField>
  );
};
