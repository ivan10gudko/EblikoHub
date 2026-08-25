package project_z.demo.dto.RoomDtos;

import java.util.UUID;

import org.openapitools.jackson.nullable.JsonNullable;

import lombok.Getter;
import lombok.Setter;
import project_z.demo.enums.TitleStatus;
import project_z.demo.enums.TitleType;

@Getter
@Setter
public class RoomPatchUpdateDto {
    private JsonNullable<String> roomName = JsonNullable.undefined();
    private JsonNullable<String> imageUrl = JsonNullable.undefined();
    private JsonNullable<String> description = JsonNullable.undefined();
}
