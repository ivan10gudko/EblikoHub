package project_z.demo.dto.TitleDtos;
import org.openapitools.jackson.nullable.JsonNullable;

import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import project_z.demo.enums.TitleStatus;
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TitlePatchUpdateDto {
    @Id
    private JsonNullable<Integer> apiTitleId = JsonNullable.undefined();
    private JsonNullable<String> titleName = JsonNullable.undefined();
    private JsonNullable<TitleStatus> status = JsonNullable.undefined();
}
