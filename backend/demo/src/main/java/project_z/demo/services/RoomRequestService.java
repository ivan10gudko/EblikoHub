package project_z.demo.services;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import project_z.demo.dto.RoomRequestsDtos.RequestsToRoomResponseDto;
import project_z.demo.dto.RoomRequestsDtos.RoomRequestCountsDto;
import project_z.demo.dto.RoomRequestsDtos.RoomRequestDetailsDto;
import project_z.demo.dto.RoomRequestsDtos.RoomRequestShortDto;
import project_z.demo.dto.RoomRequestsDtos.RoomRequestShortWithUserDto;
import project_z.demo.enums.RequestStatus;
import project_z.demo.enums.RequestType;

@Service
public interface RoomRequestService {
    void sendRequest(UUID senderId, UUID receiverId, long roomId, RequestType type);

    void acceptRequest(UUID roomRequestId);

    void rejectRequest(UUID roomRequestId);

    List<RoomRequestShortDto> getRequestsByUserId(UUID userId, RequestStatus status, RequestType type);

    RequestsToRoomResponseDto getRequestsByRoomId(Long roomId, RequestStatus status, RequestType type);


    void cancelRequest(UUID roomRequestId);

    RoomRequestCountsDto getRequestCounts(UUID userId);
}
