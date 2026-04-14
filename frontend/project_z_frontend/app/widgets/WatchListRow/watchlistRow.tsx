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
export const WatchlistRow = ({ title }: WatchlistRowProps) => {
  const [tempTitleName, setTempTitleName] = useState(title.titleName);
  const DEFAULT_IMAGE = "https://t4.ftcdn.net/jpg/05/97/47/95/360_F_597479556_7bbQ7t4Z8k3xbAloHFHVdZIizWK1PdOo.jpg";
  const navigate = useNavigate()
  const { updateTitle, deleteTitle } = useUpdateTitleRecord(title.titleId);
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
    <div className="group flex flex-col sm:flex-row items-stretch sm:items-center gap-1 sm:gap-4 bg-white p-1.5 sm:p-2 rounded-xl border border-gray-300 hover:border-amber-300 transition-all w-full">

      <div className="flex items-center flex-1 gap-2 min-w-0">
        <div onPointerDown={(e) => e.stopPropagation()}>
          <Button
            onClick={handleDelete}
            className="p-1 sm:p-1.5 bg-red-500 text-white rounded-lg"
          >
            <DeleteOutlineIcon sx={{ fontSize: 16 }} />
          </Button>
        </div>

        <div className="relative h-10 w-16 flex-shrink-0" onPointerDown={(e) => e.stopPropagation()}>
          <img
            src={title.imageUrl || DEFAULT_IMAGE}
            onClick={handleImageClick}
            className="absolute inset-0 h-full w-full object-cover rounded-md cursor-pointer"
            alt={title.titleName}
          />
        </div>

        <div className="flex-1 min-w-0" onPointerDown={(e) => e.stopPropagation()}>
          <Input
            type="text"
            value={tempTitleName}
            onChange={(val) => setTempTitleName(val)}
            onBlur={() => tempTitleName !== title.titleName && updateTitle({ titleName: tempTitleName })}
            className="w-full font-bold text-gray-900 uppercase text-[10px] sm:text-sm bg-transparent border-none p-0 h-auto leading-tight focus:ring-0"
          />
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-3 sm:w-auto mt-2 sm:mt-0">
        <div className="flex-1 sm:w-44" onPointerDown={(e) => e.stopPropagation()}>
          <StatusSelect
            variant="page"
            initialData={title}
            titleRecord={title}
            className="h-9 w-full text-xs font-bold bg-gray-100/50 hover:bg-gray-200/50 border-none transition-colors rounded-lg"
          />
        </div>

        <div onPointerDown={(e) => e.stopPropagation()} className="flex-shrink-0">
          <CompactRate
            currentRating={title.rating?.overall}
            onRate={(val) => updateTitle({ rating: { overall: val } })}
            onClear={() => updateTitle({ rating: undefined })}
          />
        </div>
      </div>
    </div>
  );
};