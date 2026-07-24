import { ImageEditorProvider } from "./ImageEditorProvider";
import { ImagePreview } from "./ImagePreview";
import { ImageUrlInput } from "./ImageInput";
import { ImageTip } from "./ImageTip";

export const ImageUrlField = Object.assign(ImageEditorProvider, {
    Preview: ImagePreview,
    Input: ImageUrlInput,
    Tip: ImageTip,
});