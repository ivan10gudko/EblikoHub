import { Select } from "~/shared/ui/Select";
import type { Option } from "~/shared/ui/Select/Select";
import { useTitleFilterStore, type TitleSortType } from "../store/titleFilter.store";
import { Button } from "~/shared/ui/Button";

  const sortOptions: Option[] = [
    { label: "Rating", value: "rating" },
    { label: "Title", value: "title" },
    { label: "Date Added", value: "createdAt" },
    { label: "Status", value: "status" },
    {label: "Custom Order", value: "customOrder"},
  ];

 const SortControl = () => {
  const { sortBy, setSort, order, toggleOrder } = useTitleFilterStore();
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-bold text-gray-500 uppercase px-1">Sort by</label>
      <div className="flex gap-2">
        <Select
          value={sortBy}
          options={sortOptions}
          onChange={(val) => setSort(val as TitleSortType)}
          className="flex-1"
        />
        <Button onClick={toggleOrder} className="px-4 bg-gray-100 hover:bg-gray-200 rounded-xl font-bold transition-colors">
          {order === "asc" ? "↑" : "↓"}
        </Button>
      </div>
    </div>
  );
};
export default SortControl;