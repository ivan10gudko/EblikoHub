package project_z.demo.services;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import project_z.demo.dto.RoomMemberDtos.RoomMemberDto;
import project_z.demo.dto.UserDtos.UserShortDto;
import project_z.demo.enums.RequestStatus;
import project_z.demo.enums.RequestType;
@Service
public interface RoomMemberService {
    void sendRequest(UUID senderId, UUID receiverId, long roomId, RequestType type);
    void acceptRequest(Long roomId, UUID receiverId);
    void rejectRequest(Long roomId, UUID receiverId);
    void leaveRoom(Long roomId, UUID userId);
    List<UserShortDto> getAcceptedMembers(Long roomId);
    List<RoomMemberDto> getRequests(Long roomId, RequestStatus status, RequestType type);
    List<RoomMemberDto> getRequestsByUserId(UUID userId, RequestStatus status, RequestType type);
    void pinRoom(Long roomId, UUID userId);
    void unpinAll(UUID userId);
}
