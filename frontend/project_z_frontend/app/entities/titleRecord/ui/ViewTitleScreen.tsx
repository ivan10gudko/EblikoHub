import { useMemo } from "react";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PushPinIcon from "@mui/icons-material/PushPin";
import {
  titleTypeOptions,
  TitleTypeOptionsColors,
  useTitleById,
  type TitleRecord,
} from "~/entities/titleRecord";
import { formatDate } from "~/shared/helpers";
import { useChangesHighlight } from "~/shared/hooks";
import { EntityView } from "~/shared/ui/EntityView/EntityView";
import type {
  EntityViewChanged,
  EntityViewValues,
} from "~/shared/ui/EntityView/EntityViewContext";

interface ViewTitleScreenProps {
  titleId: number | null;
  onClose: () => void;
  onEditClick?: () => void;
  isOwn?: boolean;
}

const toViewValues = (t: TitleRecord): EntityViewValues => ({
  name: t.titleName,
  imageUrl: t.imageUrl,
  status: t.status,
  type: t.titleType,
  rating: t.rating?.overall,
  avgRating: t.avgRating,
  description: t.description,
});

const useViewTitleChangesHighlight = (
  title?: TitleRecord | null,
  duration = 2000
): EntityViewChanged => {
  const titleName = title?.titleName;
  const status = title?.status;
  const rating = title?.rating?.overall;
  const type = title?.titleType;
  const description = title?.description;
  const hasTitle = !!title;

  const watchedData = useMemo(
    () => (hasTitle ? { titleName, status, rating, type, description } : undefined),
    [hasTitle, titleName, status, rating, type, description]
  );

  const changedFields = useChangesHighlight(
    watchedData,
    ["titleName", "status", "rating", "type", "description"],
    duration
  );

  return {
    name: changedFields.titleName,
    status: changedFields.status,
    rating: changedFields.rating,
    type: changedFields.type,
    description: changedFields.description,
  };
};

export const ViewTitleScreen = ({ titleId, onClose, onEditClick, isOwn }: ViewTitleScreenProps) => {
  const { data: title } = useTitleById(titleId ?? undefined);
  const changed = useViewTitleChangesHighlight(title, 2000);

  if (!title) {
    return (
      <EntityView.NotFound
        title="Title not found"
        message="Could not load the details for this title."
        onClose={onClose}
      />
    );
  }

  return (
    <EntityView values={toViewValues(title)} changed={changed}>
      <EntityView.Body>
        <EntityView.Header>
          <EntityView.Name label="Title Name" />
          <EntityView.Row>
            <EntityView.Type options={titleTypeOptions} colors={TitleTypeOptionsColors} />
            <EntityView.Status />
          </EntityView.Row>
          <EntityView.Rating />
        </EntityView.Header>

        <EntityView.Description />

        <div className="text-[11px] text-muted-foreground/60 font-medium px-1 flex justify-between items-center pt-2">
          {title.createdAt && (
            <span className="flex items-center gap-1">
              <CalendarMonthIcon sx={{ fontSize: 14 }} />
              Added: {formatDate(title.createdAt)}
            </span>
          )}
          {title.pinned && (
            <span className="text-primary font-bold flex items-center gap-0.5">
              <PushPinIcon sx={{ fontSize: 14, transform: "rotate(45deg)" }} />
              Pinned Title
            </span>
          )}
        </div>
      </EntityView.Body>

      <EntityView.Actions onClose={onClose} onEdit={onEditClick} isOwn={isOwn} />
    </EntityView>
  );
};