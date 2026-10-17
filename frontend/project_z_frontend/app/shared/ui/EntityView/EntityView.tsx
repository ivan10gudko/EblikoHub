import type { ReactNode } from "react";
import EditIcon from "@mui/icons-material/Edit";
import { Button } from "~/shared/ui/Button";
import { CompactRate } from "~/shared/ui/CompactRate";
import { ChangeHighlight } from "~/shared/ui/ChangeHighlight";
import { ErrorScreen } from "~/shared/ui/ErrorScreen";
import { ReadOnlyStatusBadge } from "~/entities/titleRecord";
import {
    EntityViewContext,
    useEntityView,
    type EntityViewChanged,
    type EntityViewValues,
} from "./EntityViewContext";

const LABEL_CLASS =
    "text-xs font-bold tracking-widest text-muted-foreground uppercase opacity-60 block mb-1";

const Label = ({ children }: { children: ReactNode }) => (
    <span className={LABEL_CLASS}>{children}</span>
);

const SHELL_CLASS = "flex flex-col max-h-[70vh] h-full justify-between p-2";

interface RootProps {
    values: EntityViewValues;
    changed?: EntityViewChanged;
    children: ReactNode;
}

const Root = ({ values, changed = {}, children }: RootProps) => (
    <EntityViewContext.Provider value={{ values, changed }}>
        <div className={SHELL_CLASS}>{children}</div>
    </EntityViewContext.Provider>
);

const Body = ({ children }: { children: ReactNode }) => (
    <div className="overflow-y-auto flex-1 pr-2 pb-6 space-y-6 custom-scrollbar min-h-0">
        {children}
    </div>
);

const Header = ({ children }: { children: ReactNode }) => {
    const { values } = useEntityView();
    return (
        <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left">
            <img
                src={values.imageUrl || "/defaultTitleRecordImage.jpg"}
                alt={values.name}
                className="w-42 h-58 object-cover rounded-xl shadow-md border border-border/40 shrink-0"
            />
            <div className="flex-1 space-y-4 w-full min-w-0">{children}</div>
        </div>
    );
};

const Row = ({ children }: { children: ReactNode }) => (
    <div className="grid grid-cols-2 gap-4 pt-2">{children}</div>
);

const Name = ({ label }: { label: string }) => {
    const { values, changed } = useEntityView();
    return (
        <div className="min-w-0">
            <Label>{label}</Label>
            <ChangeHighlight isChanged={!!changed.name} className="px-1 inline-block w-full">
                <div className="min-w-0 w-full">
                    <h2
                        className="text-2xl font-black text-foreground uppercase leading-tight truncate"
                        title={values.name}
                    >
                        {values.name}
                    </h2>
                </div>
            </ChangeHighlight>
        </div>
    );
};

interface TypeProps<T extends string = string> {
    options: Array<{ label: string; value: T }>;
    colors?: Record<T, string>;
}

const Type = <T extends string = string>({ options, colors }: TypeProps<T>) => {
    const { values, changed } = useEntityView();
    if (!values.type) return null;

    const label = options.find((o) => o.value === values.type)?.label ?? values.type;
    const colorClass = colors?.[values.type as T] ?? "text-foreground";

    return (
        <ChangeHighlight isChanged={!!changed.type} className="p-1">
            <Label>Type</Label>
            <span className={`font-black text-sm uppercase tracking-wider ${colorClass}`}>
                {label}
            </span>
        </ChangeHighlight>
    );
};

const StatusField = () => {
    const { values, changed } = useEntityView();
    return (
        <ChangeHighlight isChanged={!!changed.status} className="p-1">
            <Label>Status</Label>
            <div className="inline-block">
                <ReadOnlyStatusBadge status={values.status} />
            </div>
        </ChangeHighlight>
    );
};

const Rating = () => {
    const { values, changed } = useEntityView();
    return (
        <div className="pt-2">
            <Label>Rating</Label>
            <ChangeHighlight
                isChanged={!!changed.rating}
                className="pointer-events-none opacity-90 inline-block p-0.5"
            >
                <CompactRate currentRating={values.rating} avgRating={values.avgRating} />
            </ChangeHighlight>
        </div>
    );
};

const Description = () => {
    const { values, changed } = useEntityView();
    return (
        <div className="space-y-2 border-t border-border/40 pt-4">
            <span className={`${LABEL_CLASS} ml-1`}>Description & Notes</span>
            <ChangeHighlight isChanged={!!changed.description} className="rounded-xl w-full">
                <div className="w-full p-4 border-2 border-border/60 bg-card/30 rounded-xl font-medium text-foreground text-sm leading-relaxed whitespace-pre-wrap break-words overflow-hidden">
                    {values.description?.trim() ? (
                        values.description
                    ) : (
                        <span className="text-muted-foreground italic opacity-60">
                            No description provided yet.
                        </span>
                    )}
                </div>
            </ChangeHighlight>
        </div>
    );
};

interface ActionsProps {
    onClose: () => void;
    onEdit?: () => void;
    isOwn?: boolean;
}

const Actions = ({ onClose, onEdit, isOwn }: ActionsProps) => (
    <div className="flex gap-3 pt-4 border-t border-border bg-background mt-auto shrink-0">
        <Button onClick={onClose} variant="cancel" className="w-full sm:flex-1">
            Close
        </Button>
        {isOwn && onEdit && (
            <Button onClick={onEdit} variant="save" className="w-full sm:flex-2">
                <EditIcon sx={{ fontSize: 18 }} />
                Edit Details
            </Button>
        )}
    </div>
);

interface NotFoundProps {
    title: string;
    message: string;
    onClose: () => void;
}

const NotFound = ({ title, message, onClose }: NotFoundProps) => (
    <div className={SHELL_CLASS}>
        <ErrorScreen title={title} message={message} className="min-h-0 h-full py-8" />
        <Actions onClose={onClose} />
    </div>
);

export const EntityView = Object.assign(Root, {
    Body,
    Header,
    Row,
    Name,
    Type,
    Status: StatusField,
    Rating,
    Description,
    Actions,
    NotFound,
});