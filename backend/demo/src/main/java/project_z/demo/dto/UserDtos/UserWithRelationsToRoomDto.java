package project_z.demo.dto.UserDtos;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import project_z.demo.dto.RoomRequestsDtos.RoomRequestShortDto;
import project_z.demo.dto.RoomRequestsDtos.RoomRequestShortWithoutRoomDto;
import project_z.demo.enums.RoomRelationStatus;
@Getter
@Setter
@Builder
public class UserWithRelationsToRoomDto {
    private UserShortDto user;
    private RoomRelationStatus relationStatus;
    
    private RoomRequestShortWithoutRoomDto activeRequest; 
}