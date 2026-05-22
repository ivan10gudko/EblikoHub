package project_z.demo.common.QueryParameters;

import java.util.List;

import lombok.Data;
import lombok.Getter;
import project_z.demo.enums.TitleStatus;
import project_z.demo.enums.TitleType;
@Data
@Getter

public class TitleQueryParameters extends QueryParameters {
    private TitleStatus status;
    private String search;
    private List<TitleType> types;
}
