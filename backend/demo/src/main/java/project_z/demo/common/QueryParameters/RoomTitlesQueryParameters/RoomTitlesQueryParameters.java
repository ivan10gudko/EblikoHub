package project_z.demo.common.QueryParameters.RoomTitlesQueryParameters;

import java.util.List;
import java.util.UUID;

import lombok.Getter;
import lombok.Setter;
import project_z.demo.common.QueryParameters.QueryParameters;
import project_z.demo.enums.TitleStatus;
import project_z.demo.enums.TitleType;
@Getter
@Setter
public class RoomTitlesQueryParameters extends QueryParameters {
    private String search;

    private List<TitleType> types;

    private TitleStatus status;

    private List<UUID> memberIds;
}
