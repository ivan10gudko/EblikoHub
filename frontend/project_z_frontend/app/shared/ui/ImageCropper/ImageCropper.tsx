import { useState, useCallback } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { Button } from "~/shared/ui/Button";

interface ImageCropperProps {
    imageSrc: string;
    onCancel: () => void;
    onConfirm: (croppedAreaPixels: Area) => void;
}

export const ImageCropper = ({ imageSrc, onCancel, onConfirm }: ImageCropperProps) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

    const onCropComplete = useCallback((_: Area, areaPixels: Area) => {
        setCroppedAreaPixels(areaPixels);
    }, []);

    return (
        <div className="flex flex-col gap-4">
            <div className="relative w-full h-64 bg-black rounded-2xl overflow-hidden">
                <Cropper
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    cropShape="round"
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                />
            </div>
            <div className="flex gap-2">
                <Button className="flex-1" onClick={() => croppedAreaPixels && onConfirm(croppedAreaPixels)}>
                    Confirm Crop
                </Button>
                <Button variant="outline" className="flex-1 text-danger border-danger" onClick={onCancel}>
                    Cancel
                </Button>
            </div>
        </div>
    );
};