package project_z.demo.common.QueryParameters.RoomTitlesQueryParameters;

import lombok.Getter;
import lombok.Setter;
import project_z.demo.common.QueryParameters.QueryParameters;

@Getter
@Setter
public class RoomTitlesWithSearchQueryParameters extends QueryParameters {
    private String search;
}
