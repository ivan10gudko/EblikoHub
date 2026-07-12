package project_z.demo.dto.RoomMemberDtos;

import java.util.UUID;

import lombok.Getter;
import lombok.Setter;
import project_z.demo.enums.RoomRole;

@Getter
@Setter
public class RoomMemberRoleUpdateDto {
    private UUID roomMemberId;
    private RoomRole role;
}
