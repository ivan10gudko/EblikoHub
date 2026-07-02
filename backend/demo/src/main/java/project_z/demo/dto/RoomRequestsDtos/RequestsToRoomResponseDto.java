package project_z.demo.dto.RoomRequestsDtos;

import java.util.List;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
@Builder
public class RequestsToRoomResponseDto{
    private long roomId;
    private List<RoomRequestShortWithUserDto> requests;
}