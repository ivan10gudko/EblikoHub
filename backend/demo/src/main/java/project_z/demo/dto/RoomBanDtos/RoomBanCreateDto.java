package project_z.demo.dto.RoomBanDtos;

import java.util.UUID;

import lombok.Data;
@Data
public class RoomBanCreateDto {

    private Long roomId;

    private UUID userId;

    private String reason;

}
