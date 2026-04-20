import { Select } from "~/shared/ui/Select";
import type { Option } from "~/shared/ui/Select/Select";
import { useTitleFilterStore, type TitleSortType } from "../store/titleFilter.store";
import { Button } from "~/shared/ui/Button";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

  const sortOptions: Option[] = [
    { label: "Rating", value: "rating" },
    { label: "Title", value: "titleName" },
    { label: "Date Added", value: "createdAt" },
    { label: "Status", value: "status" },
    {label: "Custom Order", value: "customOrder"},
  ];

 const SortControl = () => {
  const { sortBy, setSort, order, toggleOrder } = useTitleFilterStore();
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-bold text-foreground-muted uppercase px-1">Sort by</label>
      <div className="flex gap-2">
        <Select
          value={sortBy}
          options={sortOptions}
          onChange={(val) => setSort(val as TitleSortType)}
          className="flex-1"
        />
        <Button 
          variant="outline" 
          onClick={toggleOrder} 
          className="px-4 bg-background hover:bg-background-muted-hover rounded-xl transition-colors"
        >
          {order === "asc" ? (
            <KeyboardArrowUpIcon sx={{ stroke: "#374151", strokeWidth: 2, fontSize: 24 }} />
          ) : (
            <KeyboardArrowDownIcon sx={{ stroke: "#374151", strokeWidth: 2, fontSize: 24 }} />
          )}
        </Button>
      </div>
    </div>
  );
};
export default SortControl;