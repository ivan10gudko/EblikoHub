package project_z.demo.dto.FriendshipDtos;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import project_z.demo.dto.UserDtos.UserDto;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FriendRequestDto {
    private UUID friendshipId;
    private UserDto user;
}