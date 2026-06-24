package project_z.demo.dto.RoomBanDtos;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.Data;
import project_z.demo.dto.RoomDtos.RoomShortDto;
import project_z.demo.dto.UserDtos.UserDto;
@Data
public class RoomBanDetailsDto {
    private UUID id;

    private RoomShortDto room;

    private UserDto user;

    private String reason;

    private LocalDateTime createdAt;
}
