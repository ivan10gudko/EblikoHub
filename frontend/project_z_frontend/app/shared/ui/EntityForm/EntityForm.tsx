import type { ReactNode } from "react";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import { Button } from "~/shared/ui/Button";
import { Input } from "~/shared/ui/Input";
import { CompactRate } from "~/shared/ui/CompactRate";
import { ImageUrlField } from "~/shared/ui/imageUrlField";
import Select from "~/shared/ui/Select";
import { BaseStatusSelect } from "../BaseStatusSelect";
import {
    EntityFormContext,
    useEntityForm,
    type EntityFormValues,
    type EntityFormSetters,
} from "./EntityFormContext";

const LABEL_CLASS =
    "text-xs font-bold tracking-widest text-muted-foreground uppercase opacity-70 block mb-1";

const Label = ({ children }: { children: ReactNode }) => (
    <label className={LABEL_CLASS}>{children}</label>
);

interface RootProps {
    values: EntityFormValues;
    setters: EntityFormSetters;
    children: ReactNode;
}

const Root = ({ values, setters, children }: RootProps) => (
    <EntityFormContext.Provider value={{ values, setters }}>
        <div className="flex flex-col max-h-[70vh] h-full justify-between p-2">
            <ImageUrlField imageUrl={values.imageUrl} onImageChange={setters.setImageUrl}>
                <div className="flex flex-col h-full min-h-0">{children}</div>
            </ImageUrlField>
        </div>
    </EntityFormContext.Provider>
);

const Body = ({ children }: { children: ReactNode }) => (
    <div className="overflow-y-auto flex-1 space-y-4 pr-1 pb-4 custom-scrollbar min-h-0">{children}</div>
);

const Import = ({ label, children }: { label: string; children: ReactNode }) => (
    <div className="space-y-2">
        <Label>{label}</Label>
        {children}
    </div>
);

const Header = ({ children }: { children: ReactNode }) => (
    <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start text-center sm:text-left">
        <ImageUrlField.Preview containerClassName="w-38 h-54 sm:w-40 sm:h-56 shrink-0 rounded-xl overflow-hidden shadow-md border border-border/60" />
        <div className="flex-1 space-y-3.5 w-full text-left">{children}</div>
    </div>
);

const Row = ({ children }: { children: ReactNode }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{children}</div>
);

const Name = ({ label }: { label: string }) => {
    const { values, setters } = useEntityForm();
    return (
        <div>
            <Label>{label}</Label>
            <Input
                value={values.name}
                onChange={setters.setName}
                placeholder="Enter name..."
                className="h-11 border-2 p-3 border-border focus:border-primary rounded-xl font-bold w-full text-sm"
            />
        </div>
    );
};

interface TypeProps<T extends string = string> {
    options: Array<{ label: string; value: T }>;
    getColorClass?: Record<T, string>;
}

const Type = <T extends string = string>({ options, getColorClass }: TypeProps<T>) => {
    const { values, setters } = useEntityForm();
    return (
        <div>
            <Label>Type</Label>
            <Select
                value={values.type}
                onChange={setters.setType}
                options={options}
                triggerColorClass={getColorClass?.[values.type as T]}
                getOptionClass={(val) => getColorClass?.[val as T] ?? ""}
                className="h-11 border-2 border-border/60 rounded-xl font-bold text-foreground text-sm shadow-sm w-full"
            />
        </div>
    );
};

const StatusField = () => {
    const { values, setters } = useEntityForm();
    return (
        <div>
            <Label>Status</Label>
            <BaseStatusSelect
                variant="page"
                data={{ status: values.status }}
                onStatusChange={setters.setStatus}
                className="h-11 w-full border-2 border-border rounded-xl bg-background font-bold text-sm"
            />
        </div>
    );
};

const Rating = () => {
    const { values, setters } = useEntityForm();
    return (
        <div className="flex flex-col justify-end">
            <Label>Rating</Label>
            <div className="h-11 flex items-center">
                <CompactRate
                    currentRating={values.rating}
                    onRate={setters.setRating}
                    onClear={() => setters.setRating(undefined)}
                />
            </div>
        </div>
    );
};

const ImageUrl = () => (
    <div className="flex-1 w-full">
        <Label>Image URL</Label>
        <ImageUrlField.Input showLabel={false} />
    </div>
);

const Description = () => {
    const { values, setters } = useEntityForm();
    return (
        <div className="space-y-1.5 border-t border-border/40 pt-3.5">
            <Label>Description & Notes</Label>
            <textarea
                name="Description"
                placeholder="Enter description, plot summary or your notes..."
                value={values.description}
                onChange={(e) => setters.setDescription(e.target.value)}
                className="w-full p-3.5 border-2 border-border focus:border-primary rounded-xl font-medium text-foreground text-sm bg-background/50 hover:border-border/80 focus:bg-background transition-all shadow-sm resize-none outline-none focus:ring-2 focus:ring-primary/10 break-words [field-sizing:content] min-h-[100px]"
            />
        </div>
    );
};

interface ActionsProps {
    onClose: () => void;
    onSave: () => void;
    isPending: boolean;
    saveText?: string;
    onClear?: () => void;
}

const Actions = ({ onClose, onSave, isPending, saveText = "Save Changes", onClear }: ActionsProps) => (
    <div className="flex flex-col gap-3 pt-3 border-t border-border/60 bg-background shrink-0 mt-auto">
        <div className="flex gap-3">
            <Button onClick={onClose} variant="cancel" className="w-full sm:flex-1 h-11">
                Cancel
            </Button>
            <Button onClick={onSave} disabled={isPending} variant="save" className="w-full sm:flex-2 h-11">
                {isPending ? "Saving..." : saveText}
            </Button>
        </div>

        {onClear && (
            <Button
                onClick={onClear}
                variant="text-only"
                className="flex items-center gap-2 text-[10px] tracking-widest text-foreground hover:text-danger transition-colors uppercase py-2 px-4 self-start"
            >
                <DeleteSweepIcon sx={{ fontSize: 16 }} />
                Clear Form Data
            </Button>
        )}
    </div>
);

export const EntityForm = Object.assign(Root, {
    Body,
    Import,
    Header,
    Row,
    Name,
    Type,
    Status: StatusField,
    Rating,
    ImageUrl,
    Description,
    Actions,
});