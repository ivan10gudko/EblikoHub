package project_z.demo.common.QueryParameters;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class UserQueryParameters extends QueryParameters {
    private String name;
}
