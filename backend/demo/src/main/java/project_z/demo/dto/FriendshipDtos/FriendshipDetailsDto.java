package project_z.demo.dto.FriendshipDtos;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.Data;
import project_z.demo.enums.FriendshipStatus;

@Data
public class FriendshipDetailsDto {
    private UUID friendshipId;

    private UUID sender;
    
    private UUID receiver;

    private FriendshipStatus status;

    private LocalDateTime createdAt;
}
