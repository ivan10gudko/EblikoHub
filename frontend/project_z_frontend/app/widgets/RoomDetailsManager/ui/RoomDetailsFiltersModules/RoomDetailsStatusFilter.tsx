import { statusFilterStyles, statusOptionsFilters } from '~/shared/types/Status';
import { StatusButton } from '~/shared/ui/StatusButton'; 
import { useRoomDetailsFilterStore } from '../../store/roomDetailsFilter.store';

export const RoomDetailsStatusFilter = () => {
    const { status, setStatus } = useRoomDetailsFilterStore();

    return (
        <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-foreground uppercase px-1">
                Status
            </label>
            <div className="flex flex-wrap gap-2">
                {statusOptionsFilters.map(s => {
                    const styleKey = s.value ?? 'ALL';
                    const styles = statusFilterStyles[styleKey] || statusFilterStyles['ALL'];
                    const isActive = (status ?? undefined) === (s.value ?? undefined);

                    return (
                        <StatusButton
                            key={styleKey}
                            label={s.label}
                            isActive={isActive}
                            onClick={() => setStatus(s.value ?? undefined)}
                            className={styles.text}
                            activeClassName={styles.active}
                            inactiveClassName={styles.inactive}
                        />
                    );
                })}
            </div>
        </div>
    );
};