package project_z.demo.dto.CharacterDtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.openapitools.jackson.nullable.JsonNullable;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CharacterPatchUpdateDto {
    private JsonNullable<String> name = JsonNullable.undefined();
    private JsonNullable<String> imageUrl = JsonNullable.undefined();
}
