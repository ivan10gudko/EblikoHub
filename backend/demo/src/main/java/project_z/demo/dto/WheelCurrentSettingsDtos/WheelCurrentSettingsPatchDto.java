package project_z.demo.dto.WheelCurrentSettingsDtos;

import org.openapitools.jackson.nullable.JsonNullable;

import lombok.Getter;
import lombok.Setter;
import project_z.demo.enums.WheelMode;
@Getter
@Setter
public class WheelCurrentSettingsPatchDto {
    private JsonNullable<WheelMode> mode = JsonNullable.undefined();
    private JsonNullable<Integer> spinDuration = JsonNullable.undefined();
}
