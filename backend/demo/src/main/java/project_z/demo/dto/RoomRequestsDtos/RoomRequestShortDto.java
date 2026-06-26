package project_z.demo.dto.RoomRequestsDtos;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.Getter;
import lombok.Setter;
import project_z.demo.enums.RequestStatus;
import project_z.demo.enums.RequestType;
@Getter
@Setter
public class RoomRequestShortDto {
    private UUID id;

    private Long roomId;

    private UUID userId;

    private UUID senderId;

    private RequestStatus status;

    private RequestType type;

    private LocalDateTime createdAt;
}
