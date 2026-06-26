package project_z.demo.services;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import project_z.demo.dto.RoomRequestsDtos.RoomRequestDetailsDto;
import project_z.demo.enums.RequestStatus;
import project_z.demo.enums.RequestType;
@Service
public interface RoomRequestService {
    void sendRequest(UUID senderId, UUID receiverId, long roomId, RequestType type);
    void acceptRequest(Long roomId, UUID receiverId);
    void rejectRequest(Long roomId, UUID receiverId);
    List<RoomRequestDetailsDto> getRequestsByUserId(UUID userId, RequestStatus status, RequestType type);
}
