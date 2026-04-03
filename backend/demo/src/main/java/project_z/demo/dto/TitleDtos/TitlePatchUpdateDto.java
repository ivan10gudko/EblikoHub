package project_z.demo.dto.TitleDtos;
import java.util.Map;

import org.openapitools.jackson.nullable.JsonNullable;

import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import project_z.demo.enums.TitleStatus;
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
public class TitlePatchUpdateDto {
    @Id
    private JsonNullable<Integer> apiTitleId = JsonNullable.undefined();
    private JsonNullable<String> titleName = JsonNullable.undefined();
    private JsonNullable<TitleStatus> status = JsonNullable.undefined();
    private JsonNullable<Map<String,Float>> rating = JsonNullable.undefined();
}
