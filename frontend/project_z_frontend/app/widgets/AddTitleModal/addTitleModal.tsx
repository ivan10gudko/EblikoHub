import Modal from '~/shared/ui/Modal/Modal';
import { Button } from '~/shared/ui/Button';
import { Select } from '~/shared/ui/Select';
import { Input } from '~/shared/ui/Input';
import type { Anime, AnimeCardType } from '~/entities/title';
import {
    Status,
    statusOptions,
    useCreateTitleRecord,
    type CreateTitleRecord,
    type TitleRating
} from '~/entities/titleRecord';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { TitleSearch } from '../TitleSearch/titleSearch';

interface AddTitleModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const INITIAL_FORM_DATA: CreateTitleRecord = {
    titleName: '',
    apiTitleId: undefined,
    status: Status.INPROGRESS,
    imageUrl: null,
    rating: undefined
};

const AddTitleModal = ({ isOpen, onClose }: AddTitleModalProps) => {
    const [formData, setFormData] = useState<CreateTitleRecord>(INITIAL_FORM_DATA);
    const { createNewTitleRecord, isCreating } = useCreateTitleRecord();

    const handleImport = (anime: AnimeCardType) => {
        setFormData({
            ...formData,
            titleName: anime.title,
            apiTitleId: anime.id,
            imageUrl: anime.img,
        });
    };
    const handleSave = () => {
        if (!formData.titleName.trim()) {
            toast.error("Enter name!");
            return;
        }

        createNewTitleRecord(formData, {
            onSuccess: () => {
                toast.success("Added!");
                setFormData(INITIAL_FORM_DATA);
                onClose();
            }
        });
    };
    const handleRatingChange = (val: string) => {
        if (val === '' || /^[0-9]*\.?[0-9]*$/.test(val)) {
            const num = parseFloat(val);

            if (val === '' || (!isNaN(num) && num <= 10)) {
                setFormData(prev => ({
                    ...prev,
                    rating: val === ''
                        ? {}
                        : {
                            ...prev.rating,
                            overall: num
                        } as TitleRating
                }));
            }
        }
    };
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Add New Title"
            maxWidth="max-w-3xl"
        >
            <div className="space-y-6 p-2">
                <div className="space-y-2">
                    <label className="text-xs font-bold tracking-widest text-gray-900 ml-1 leading-tight uppercase">
                        Quick Import via MAL
                    </label>
                    <TitleSearch onSelect={handleImport} />
                </div>
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="w-full md:w-auto flex justify-center">
                        <div className="h-[260px] w-[180px] bg-white rounded-2xl border-2 border-slate-200 flex items-center justify-center overflow-hidden shadow-md transition-transform hover:scale-[1.02]">
                            <img
                                src={formData.imageUrl || "/defautlTitleRecordImage.jpg"}
                                className={`h-full w-full object-cover ${!formData.imageUrl && 'opacity-30'}`}
                                alt="Preview"
                            />
                        </div>
                    </div>
                    <div className="flex-grow space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold tracking-widest text-gray-900 ml-1 leading-tight">
                                Title Name
                            </label>
                            <Input
                                placeholder="Enter name..."
                                value={formData.titleName}
                                onChange={(val) => setFormData({ ...formData, titleName: val })}
                                className="h-12 border-2 w-full border-slate-200 rounded-xl font-bold text-gray-900 text-sm focus:border-amber-400 transition-all shadow-sm"
                            />
                        </div>
                        <div className="w-full">
                            <div className="flex gap-4 mb-1">
                                <div className="flex-1">
                                    <label className="text-xs font-bold tracking-widest text-gray-900 ml-1 uppercase">
                                        Status
                                    </label>
                                </div>
                                <div className="w-[112px] flex-shrink-0">
                                    <label className="text-xs font-bold tracking-widest text-gray-900 uppercase text-center block">
                                        Rating
                                    </label>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-1 min-w-0">
                                    <Select
                                        value={formData.status}
                                        onChange={(val) => setFormData({ ...formData, status: val as Status })}
                                        options={[...statusOptions]}
                                        className="h-12 border-2 border-slate-200 rounded-xl font-bold text-gray-900 text-sm shadow-sm"
                                    />
                                </div>
                                <div className="w-[112px] flex-shrink-0">
                                    <Input
                                        placeholder="0.0"
                                        value={formData.rating?.overall?.toString() || ''}
                                        onChange={handleRatingChange}
                                        className="h-12 w-full border-2 border-slate-200 rounded-xl font-bold text-gray-900 text-center focus:border-amber-400 transition-all shadow-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex gap-4 pt-6 border-t border-slate-100">
                    <Button
                        onClick={onClose}
                        className="flex-1 h-14 rounded-xl bg-slate-200 text-gray-900 font-bold text-xs tracking-wider hover:bg-slate-300 transition-all active:scale-95 shadow-sm"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={isCreating}
                        className="flex-[2] h-14 rounded-xl bg-amber-400 text-gray-900 font-bold text-xs tracking-wider shadow-[0_4px_0_0_#d97706] hover:bg-amber-500 active:translate-y-[2px] active:shadow-none transition-all disabled:opacity-50"
                    >
                        {isCreating ? "Saving..." : "Save Title"}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default AddTitleModal;