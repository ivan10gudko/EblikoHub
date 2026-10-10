package project_z.demo.dto.RoomRequestsDtos;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import project_z.demo.dto.RoomDtos.RoomShortDto;
import project_z.demo.dto.UserDtos.UserShortDto;
import project_z.demo.enums.RequestStatus;
import project_z.demo.enums.RequestType;

@Getter
@Setter
@Builder
public class RoomRequestShortDto {
    private UUID id;

    private RoomShortDto room;

    private UUID userId;

    private UserShortDto sender;

    private RequestStatus status;

    private RequestType type;

    private LocalDateTime createdAt;
}
