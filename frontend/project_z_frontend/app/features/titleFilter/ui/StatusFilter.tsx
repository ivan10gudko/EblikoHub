import { Button } from "~/shared/ui/Button";
import { useTitleFilterStore } from "../store/titleFilter.store";
import { Status, statusOptionsFilters } from "~/shared/types/Status";
import { getBackendCount } from "~/shared/helpers";


interface StatusFilterProps {
  statusCount?: Record<string, number>;
}




const StatusFilter = ({ statusCount }: StatusFilterProps) => {
  const { status, setStatus } = useTitleFilterStore();

  
  const totalTitles = statusCount
    ? Object.values(statusCount).reduce((sum, count) => sum + count, 0)
    : 0;

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-bold text-foreground uppercase px-1">
        Status
      </label>
      <div className="flex flex-wrap gap-2">
        {statusOptionsFilters.map((opt) => {
          const isActive =
            status === opt.value ||
            (opt.value === undefined && status === undefined);

          let textColor = "text-foreground";
          if (opt.value === Status.INPROGRESS) textColor = "text-amber-500";
          if (opt.value === Status.PLANNED) textColor = "text-blue-500";
          if (opt.value === Status.WATCHED) textColor = "text-green-500";
          if (opt.value === Status.DROPPED) textColor = "text-red-500";

          let activeBgAndShadow = "";
          if (isActive) {
            switch (opt.value) {
              case Status.INPROGRESS:
                activeBgAndShadow = "bg-amber-500/10 shadow-xs shadow-amber-500/30";
                break;
              case Status.PLANNED:
                activeBgAndShadow = "bg-blue-500/10 shadow-xs shadow-blue-500/30";
                break;
              case Status.WATCHED:
                activeBgAndShadow = "bg-green-500/10 shadow-xs shadow-green-500/30";
                break;
              case Status.DROPPED:
                activeBgAndShadow = "bg-red-500/10 shadow-xs shadow-red-500/30";
                break;
              default:
                activeBgAndShadow = "bg-primary !text-background shadow-xs shadow-yellow-100";
                break;
            }
          }

          
          const count = opt.value === undefined ? totalTitles : getBackendCount(statusCount, opt.value);

          return (
            <Button
              variant="outline"
              key={opt.label}
              onClick={() => setStatus(opt.value)}
              className={`border-none px-4 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-1.5 ${textColor} ${
                isActive
                  ? activeBgAndShadow
                  : "bg-background-muted hover:bg-background-muted-hover"
              }`}
            >
              <span>{opt.label}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded-md font-normal transition-colors ${
                isActive && opt.value === undefined
                  ? "bg-background/20 text-background" 
                  : "bg-background/20 text-foreground/80"
              }`}>
                {count}
              </span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default StatusFilter;