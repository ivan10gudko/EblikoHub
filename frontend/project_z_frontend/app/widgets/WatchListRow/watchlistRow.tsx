import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useState } from "react";
import { useNavigate } from "react-router";
import { CompactRate, type Status, type TitleRecord } from "~/entities/titleRecord";
import { useUpdateTitleRecord } from "~/entities/titleRecord/hooks/useTitleRecordUpdateMutation";
import { StatusSelect } from "~/features/manageTitle";
import { Button } from "~/shared/ui/Button";
import { Input } from "~/shared/ui/Input";


interface WatchlistRowProps {
  title: TitleRecord;
}
export const WatchlistRow = ({ title  }: WatchlistRowProps) => {
  const [tempTitleName, setTempTitleName] = useState(title.titleName);
  const DEFAULT_IMAGE = "https://t4.ftcdn.net/jpg/05/97/47/95/360_F_597479556_7bbQ7t4Z8k3xbAloHFHVdZIizWK1PdOo.jpg";
  const navigate = useNavigate()
  const {updateTitle, deleteTitle } = useUpdateTitleRecord(title.titleId);
  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    if (title.apiTitleId) {
      navigate(`/anime/${title.apiTitleId}`)
    }
  };
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
      deleteTitle();
  };

 return (
    <div className="group flex items-center gap-4 bg-white p-2 rounded-xl border border-gray-300 hover:border-amber-300 hover:shadow-sm transition-all cursor-grab active:cursor-grabbing w-full">
      <div onPointerDown={(e) => e.stopPropagation()}>
        <Button
          onClick={handleDelete}
          className="p-2 bg-red-500 text-white hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          title="Delete"
        >
          <DeleteOutlineIcon sx={{ fontSize: 20 }} />
        </Button>
      </div>
      <div 
        className="relative h-12 w-16 flex-shrink-0"
        onPointerDown={(e) => e.stopPropagation()}
      >
        <img 
          src={title.imageUrl || DEFAULT_IMAGE} 
          onClick={handleImageClick}
          className={`absolute inset-0 h-full w-full object-cover rounded-lg transition-all duration-300 ease-in-out origin-center ${
            title.apiTitleId 
              ? "cursor-pointer hover:scale-[2.5] hover:z-50 hover:shadow-2xl hover:border-2 hover:border-white" 
              : "cursor-default"
          }`} 
          alt={title.titleName}
        />
      </div>

      <div className="flex-1 min-w-0" onPointerDown={(e) => e.stopPropagation()}>
        <Input 
          type="text"
          value={tempTitleName}
          onChange={(val) => setTempTitleName(val)}
          onBlur={() => {
            if (tempTitleName !== title.titleName) {
              updateTitle({ titleName: tempTitleName });
            }
          }}
          className=" w-full font-bold text-gray-900 uppercase text-sm select-text bg-transparent border-none outline-none focus:ring-1 focus:ring-amber-200 rounded px-1 transition-colors"
        />
      </div>

      <div onPointerDown={(e) => e.stopPropagation()} className="w-40"> 
        <StatusSelect 
          variant="page" 
          initialData={title}
          titleRecord={title}
          className="my-0 py-1 text-xs font-semibold" 
        />
      </div>
      <div onPointerDown={(e) => e.stopPropagation()} className="flex items-center gap-2">
        <CompactRate 
          currentRating={title.rating?.overall}
          onRate={(val) => updateTitle({ rating: { overall: val } })}
          onClear={() => updateTitle({ rating: undefined })}
        />
      </div>
    </div>
  );
};