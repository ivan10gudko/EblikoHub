import { Status, statusFilterStyles, statusOptionsFilters } from '~/shared/types/Status';
import { StatusButton } from '~/shared/ui/StatusButton'; import { useRoomDetailsFilterStore } from '../../store/roomDetailsFilter.store';
;

export const RoomDetailsStatusFilter = () => {
    const { status, setStatus } = useRoomDetailsFilterStore();

    return (
        <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase font-bold text-muted-foreground">Status</label>
            <div className="flex flex-wrap gap-1.5">
                {statusOptionsFilters.map(s => {
                    const isActive = (status ?? undefined) === (s.value ?? undefined);
                    const styles = statusFilterStyles[s.value ?? 'ALL'] || statusFilterStyles['ALL'];

                    return (
                        <StatusButton
                            key={s.value || 'all'}
                            label={s.label}
                            isActive={isActive}
                            onClick={() => setStatus(s.value ?? undefined)}
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