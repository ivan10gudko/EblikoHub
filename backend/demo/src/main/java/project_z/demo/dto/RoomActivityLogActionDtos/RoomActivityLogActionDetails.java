package project_z.demo.dto.RoomActivityLogActionDtos;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.Getter;
import lombok.Setter;
import project_z.demo.dto.RoomDtos.RoomShortDto;
import project_z.demo.enums.RoomAction;
@Getter
@Setter
public class RoomActivityLogActionDetails {

    private UUID id;

    private RoomShortDto room;

    private RoomShortDto user;

    private RoomAction action;

    private LocalDateTime createdAt;
}
