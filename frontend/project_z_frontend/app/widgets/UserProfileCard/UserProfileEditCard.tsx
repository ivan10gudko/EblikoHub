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
                    <div className="absolute inset-0 bg-card rounded-full flex items-center justify-center">
                        <PhotoCameraIcon className="text-background opacity-80" />
                    </div>
                </div>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
            </div>
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-bold text-foreground ml-1">Username</label>
                    <input 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="text-xl font-semibold p-3 rounded-xl border-2 border-border outline-none focus:border-primary focus:bg-background-muted transition-all"
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-bold text-foreground ml-1">About Me</label>
                    <textarea 
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        className="min-h-[120px] p-3 rounded-xl border-2 border-border outline-none focus:border-primary focus:bg-background-muted transition-all resize-none"
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
                        bg-primary cursor-pointer
                        text-background font-bold border-none
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
                    className="px-6 py-3 rounded-xl text-danger border-danger font-bold bg-background "
                >
                    Cancel
                </Button>
            </div>
        </div>
    );
};