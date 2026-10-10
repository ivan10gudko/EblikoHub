package project_z.demo.dto.FriendshipDtos;

import org.openapitools.jackson.nullable.JsonNullable;

import lombok.Data;
import project_z.demo.enums.RequestStatus;
@Data
public class FriendshipPartialUpdateDto {

    private JsonNullable<RequestStatus> status = JsonNullable.undefined();

}
