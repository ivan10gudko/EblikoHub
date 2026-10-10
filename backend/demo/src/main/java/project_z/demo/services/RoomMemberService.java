package project_z.demo.services;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import project_z.demo.dto.RoomMemberDtos.RoomMemberDto;
import project_z.demo.dto.RoomMemberDtos.RoomMemberIdDto;
import project_z.demo.dto.RoomMemberDtos.RoomMemberRoleUpdateDto;
import project_z.demo.dto.UserDtos.UserShortDto;
import project_z.demo.entity.RoomEntity;
import project_z.demo.entity.UserEntity;
import project_z.demo.enums.RoomRole;

@Service
public interface RoomMemberService {
    void leaveRoom(Long roomId, UUID userId);

    void pinRoom(Long roomId, UUID userId);

    void unpinAll(UUID userId);

    RoomMemberDto getRooMemberByRoomIdAndUserId(Long roomId, UUID userId);

    List<UserShortDto> getAcceptedMembers(Long roomId);

    RoomMemberDto leaveOwner(long roomId, RoomMemberIdDto dto, UUID currentUserId);

    RoomMemberDto updateMemberRole(UUID currentUserId, long roomId, RoomMemberRoleUpdateDto dto);

    void addMemberToRoom(RoomEntity room, UserEntity user, RoomRole role);
}
