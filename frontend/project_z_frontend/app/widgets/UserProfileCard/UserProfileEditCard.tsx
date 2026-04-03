import { useRef, useState } from "react";
import { Button } from "~/shared/ui/Button";
import { UserAvatar, type UserProfile } from "~/entities/user"; 
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
interface UserProfileEditProps {
    user: UserProfile;
    onSave: (data: { name: string; description: string }, file: File | null) => void;
    onCancel: () => void;
    isPending: boolean;
}

export const UserProfileEdit = ({ user, onSave, onCancel, isPending }: UserProfileEditProps) => {
    const [formData, setFormData] = useState({
        name: user.name,
        description: user.description || ""
    });

    const [previewImg, setPreviewImg] = useState(user.img);
    const [selectedFile, setSelectedFile] = useState<File | null>(null); 
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file); 
            const objectUrl = URL.createObjectURL(file);
            setPreviewImg(objectUrl); 
        }
    }; 
    return (
        
        <div className="flex flex-col gap-6 w-full animate-in fade-in duration-300">
            <div className="flex flex-col items-center gap-2">
                <div 
                    className="relative cursor-pointer group" 
                    onClick={() => fileInputRef.current?.click()}
                >
                    <UserAvatar src={previewImg} name={formData.name} size="lg" />
                    <div className="absolute inset-0 bg-black/20 rounded-full flex items-center justify-center">
                        <PhotoCameraIcon className="text-white opacity-80" />
                    </div>
                </div>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
            </div>
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-bold text-gray-500 ml-1">Username</label>
                    <input 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="text-xl font-semibold p-3 rounded-xl border-2 border-gray-100 outline-none focus:border-yellow-400 focus:bg-yellow-50/30 transition-all"
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-bold text-gray-500 ml-1">About Me</label>
                    <textarea 
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        className="min-h-[120px] p-3 rounded-xl border-2 border-gray-100 outline-none focus:border-yellow-400 focus:bg-yellow-50/30 transition-all resize-none"
                        placeholder="Tell us about yourself..."
                    />
                </div>
            </div>

            <div className="flex gap-3 mt-2">
                <Button 
                    onClick={() => onSave(formData, selectedFile)} 
                    disabled={isPending}
                    className="
                        flex-1 
                        bg-yellow-400 cursor-pointer
                        text-white font-bold border-none
                        py-3.5 rounded-2xl 
                        transition-all duration-200
                        disabled:opacity-60 disabled:cursor-not-allowed
                    "
                >
                    {isPending ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                    variant="outline"
                    onClick={onCancel} 
                    className="px-6 py-3 rounded-xl text-red-500 border-red-500 font-bold bg-white "
                >
                    Cancel
                </Button>
            </div>
        </div>
    );
};