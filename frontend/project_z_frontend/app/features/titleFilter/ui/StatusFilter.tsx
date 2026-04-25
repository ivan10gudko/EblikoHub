import { Status } from "~/entities/titleRecord";
import { Button } from "~/shared/ui/Button";
import { useTitleFilterStore } from "../store/titleFilter.store";

const statusOptions = [
  { label: "All", value: undefined },
  { label: "In Progress", value: Status.INPROGRESS },
  { label: "Planned", value: Status.PLANNED },
  { label: "Watched", value: Status.WATCHED },
  { label: "Dropped", value: Status.DROPPED },
];

const StatusFilter = () => {
  const { status, setStatus } = useTitleFilterStore();
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-bold text-foreground-muted uppercase px-1">
        Status
      </label>
      <div className="flex flex-wrap gap-2">
        {statusOptions.map((opt) => (
          <Button
            variant="outline"
            key={opt.label}
            onClick={() => setStatus(opt.value)}
            className={`border-none px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              (status === opt.value || (opt.value === undefined && status === undefined))
                ? 'bg-primary text-foreground shadow-xs shadow-yellow-100'
                : 'bg-background-muted text-foreground hover:bg-background-muted-hover hover:text-foreground-muted '
            }`}
          >
            {opt.label}
          </Button>
        ))}
      </div>
    </div>
  );
};
export default StatusFilter;
