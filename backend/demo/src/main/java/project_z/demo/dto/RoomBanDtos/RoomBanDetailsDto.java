package project_z.demo.dto.RoomBanDtos;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.Data;
import project_z.demo.dto.RoomDtos.RoomShortDto;
import project_z.demo.dto.UserDtos.UserShortDto;
@Data
public class RoomBanDetailsDto {
    private UUID id;

    private long roomId;

    private UserShortDto user;

    private String reason;

    private UUID bannedByUserId;

    private LocalDateTime createdAt;

}
