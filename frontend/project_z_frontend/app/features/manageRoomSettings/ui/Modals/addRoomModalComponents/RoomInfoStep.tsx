import type { RoomCreateDto } from "~/entities/room";
import { ImageUrlEditor } from "~/shared/ui/ImageUrlEditor";
import { Input } from "~/shared/ui/Input";

interface RoomInfoStepProps {
    formData: RoomCreateDto;
    setFormData: React.Dispatch<React.SetStateAction<RoomCreateDto>>;
}

export const RoomInfoStep = ({ formData, setFormData }: RoomInfoStepProps) => (
    <div className="space-y-6">
        <ImageUrlEditor
            variant="landscape"
            imageUrl={formData.imageUrl}
            onImageChange={(url) => setFormData((prev: any) => ({ ...prev, imageUrl: url }))}
        />
        <Input
            value={formData.roomName}
            onChange={(val) => setFormData((prev: any) => ({ ...prev, roomName: val }))}
            placeholder="Enter room name..."
        />
    </div>
);