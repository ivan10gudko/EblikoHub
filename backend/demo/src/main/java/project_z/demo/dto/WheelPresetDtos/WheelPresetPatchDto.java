package project_z.demo.dto.WheelPresetDtos;

import org.openapitools.jackson.nullable.JsonNullable;

import lombok.Getter;
import project_z.demo.enums.WheelMode;
@Getter
public class WheelPresetPatchDto {
    private JsonNullable<String> name = JsonNullable.undefined();
    private JsonNullable<WheelMode> mode = JsonNullable.undefined();
    private JsonNullable<Integer> spinDuration = JsonNullable.undefined();
}