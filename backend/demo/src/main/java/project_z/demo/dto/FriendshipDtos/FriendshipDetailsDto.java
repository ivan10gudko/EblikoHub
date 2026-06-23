package project_z.demo.dto.FriendshipDtos;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.Data;
import project_z.demo.enums.RequestStatus;

@Data
public class FriendshipDetailsDto {
    private UUID friendshipId;

    private UUID sender;
    
    private UUID receiver;

    private RequestStatus status;

    private LocalDateTime createdAt;
}
