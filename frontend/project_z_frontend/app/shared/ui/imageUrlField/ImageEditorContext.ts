import { createContext, useContext } from "react";
import type { ImageOrientation } from "~/shared/types";


interface ImageEditorContextProps {
    tempUrl: string;
    imageError: boolean;
    imageUrl: string | null;
    variant: ImageOrientation;
    defaultImage: string;
    handleUrlChange: (newValue: string) => void;
    handleClearImage: () => void;
    handleImageError: () => void;
    hasValidImage: boolean;
}

export const ImageEditorContext = createContext<ImageEditorContextProps>(null!);

export const useImageEditorContext = () => {
    const context = useContext(ImageEditorContext);

    if (!context) {
        throw new Error("useImageEditorContext must be used within an ImageEditorProvider");

    }
    return context;
}
