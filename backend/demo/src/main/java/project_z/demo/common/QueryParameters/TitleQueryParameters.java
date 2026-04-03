package project_z.demo.common.QueryParameters;

import lombok.Data;
import lombok.Getter;
import project_z.demo.enums.TitleStatus;
@Data
@Getter

public class TitleQueryParameters extends QueryParameters {
    private TitleStatus status;
}
