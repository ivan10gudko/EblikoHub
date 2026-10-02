package project_z.demo.common.QueryParameters;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class CharacterQueryParameters extends QueryParameters {
    private String search;
}
