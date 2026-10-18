import {

    SeasonType,
    type Season,
} from "~/entities/season/model/season.types";
import { EntityView } from "~/shared/ui/EntityView/EntityView";
import type { EntityViewValues } from "~/shared/ui/EntityView/EntityViewContext";
import { SEASON_TYPE_OPTIONS, SeasonTypeOptionsColors } from "../consts/season.consts";

interface ViewSeasonScreenProps {
    season?: Season | null;
    onClose: () => void;
    onEditClick?: () => void;
    isOwn?: boolean;
}

const toViewValues = (s: Season): EntityViewValues => ({
    name: s.name,
    imageUrl: s.imageUrl,
    status: s.status,
    type: s.type ?? SeasonType.TV,
    rating: s.rating?.overall,
    description: s.description,
});

export const ViewSeasonScreen = ({ season, onClose, onEditClick, isOwn }: ViewSeasonScreenProps) => {
    if (!season) {
        return (
            <EntityView.NotFound
                title="Season not found"
                message="Could not load the details for this season."
                onClose={onClose}
            />
        );
    }

    return (
        <EntityView values={toViewValues(season)}>
            <EntityView.Body>
                <EntityView.Header>
                    <EntityView.Name label="Season Name" />
                    <EntityView.Row>
                        <EntityView.Type options={SEASON_TYPE_OPTIONS} colors={SeasonTypeOptionsColors} />
                        <EntityView.Status />
                    </EntityView.Row>
                    <EntityView.Rating />
                </EntityView.Header>

                <EntityView.Description />
            </EntityView.Body>

            <EntityView.Actions onClose={onClose} onEdit={onEditClick} isOwn={isOwn} />
        </EntityView>
    );
};

export default ViewSeasonScreen;