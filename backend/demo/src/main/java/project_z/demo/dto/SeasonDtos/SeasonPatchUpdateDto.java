package project_z.demo.dto.SeasonDtos;

import java.util.Map;

import org.openapitools.jackson.nullable.JsonNullable;

import lombok.Data;
import project_z.demo.enums.TitleStatus;
import project_z.demo.enums.seasons.SeasonType;

@Data
public class SeasonPatchUpdateDto {
    private JsonNullable<String> seasonName = JsonNullable.undefined();
    private JsonNullable<TitleStatus> status = JsonNullable.undefined();
    private JsonNullable<Map<String, Float>> rating = JsonNullable.undefined();

    private JsonNullable<Integer> apiTitleId = JsonNullable.undefined();
    private JsonNullable<String> description = JsonNullable.undefined();
    private JsonNullable<SeasonType> type = JsonNullable.undefined();
    private JsonNullable<String> imageUrl = JsonNullable.undefined();
}
