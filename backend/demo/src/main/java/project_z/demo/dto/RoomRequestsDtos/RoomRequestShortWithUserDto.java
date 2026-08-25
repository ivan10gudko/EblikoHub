package project_z.demo.dto.RoomRequestsDtos;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import project_z.demo.dto.RoomDtos.RoomShortDto;
import project_z.demo.dto.UserDtos.UserShortDto;
import project_z.demo.enums.RequestStatus;
import project_z.demo.enums.RequestType;
@Setter
@Getter
@Builder
public class RoomRequestShortWithUserDto {
    private UUID id;

    private UserShortDto user;

    private UserShortDto sender;

    private RequestStatus status;

    private RequestType type;

    private LocalDateTime createdAt;
}


