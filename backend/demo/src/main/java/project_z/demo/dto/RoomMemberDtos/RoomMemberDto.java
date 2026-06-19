package project_z.demo.dto.RoomMemberDtos;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.Data;
import project_z.demo.dto.UserDtos.UserShortDto;
import project_z.demo.enums.RequestStatus;
import project_z.demo.enums.RequestType;

@Data
public class RoomMemberDto {
    private UUID requestId;
    private UserShortDto user; 
    private RequestStatus status;
    private RequestType type;
    private LocalDateTime createdAt;
}