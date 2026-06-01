package project_z.demo.dto.FriendshipDtos;

import org.openapitools.jackson.nullable.JsonNullable;

import lombok.Data;
import project_z.demo.enums.FriendshipStatus;
@Data
public class FriendshipPartialUpdateDto {

    private JsonNullable<FriendshipStatus> status = JsonNullable.undefined();

}
