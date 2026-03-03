package project_z.demo.common.QueryParameters;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
public class QueryParameters {
    private int page = 1; 
    private int limit = 10;
    private String sortBy = "createdAt";
    private String order = "asc";
}