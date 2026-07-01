import { useTitleFilterStore } from "../store/titleFilter.store";
import { statusFilterStyles, statusOptionsFilters } from "~/shared/types/Status";
import { getBackendCount } from "~/shared/helpers";
import { StatusButton } from "~/shared/ui/StatusButton";
import type { TitleStats } from "~/entities/titleRecord";

interface StatusFilterProps {
  statusCount?: Record<string, number>;
}


const StatusFilter = ({ statusCount }: StatusFilterProps) => {
  const { status, setStatus } = useTitleFilterStore();
  const counts = statusCount?.statusCount ?? {};
  const totalTitles = statusCount
    ? Object.values(statusCount).reduce((sum, count) => sum + count, 0)
    : 0;


  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-bold text-foreground uppercase px-1">Status</label>
      <div className="flex flex-wrap gap-2">
        {statusOptionsFilters.map(s => {
          const styleKey = s.value ?? 'ALL';
          const styles = statusFilterStyles[styleKey];
          const count = s.value === undefined ? totalTitles : getBackendCount(statusCount, s.value);
          const isActive = (status ?? undefined) === (s.value ?? undefined);

          return (
            <StatusButton
              key={styleKey}
              label={s.label}
              count={count}
              isActive={isActive}
              onClick={() => setStatus(s.value)}
              className={styles.text}
              activeClassName={styles.active}
              inactiveClassName="bg-background-muted border border-border hover:bg-muted"
            />
          );
        })}
      </div>
    </div>
  );
};
export default StatusFilter;
