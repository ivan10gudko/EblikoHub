package project_z.demo.dto.UserDtos;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import project_z.demo.enums.RequestStatus;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDtoWithFriendshipStatus {
    private UUID userId;
    private String name;
    private String nameTag;
    private String img;
    private RequestStatus friendshipStatus;
    private UUID friendshipId;
}