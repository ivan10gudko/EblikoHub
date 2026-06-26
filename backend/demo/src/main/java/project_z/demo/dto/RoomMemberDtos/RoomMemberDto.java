package project_z.demo.dto.RoomMemberDtos;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.Data;
import project_z.demo.dto.UserDtos.UserShortDto;
import project_z.demo.enums.RequestType;
import project_z.demo.enums.RoomRole;

@Data
public class RoomMemberDto {
    private UUID requestId;
    private UserShortDto user; 
    private RequestType type;
    private RoomRole role;
    private LocalDateTime createdAt;
}