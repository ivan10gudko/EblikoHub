package project_z.demo.services.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import project_z.demo.Mappers.Mapper;
import project_z.demo.common.Exceptions.ResourceNotFoundException;
import project_z.demo.common.Exceptions.RoomMembersExceptions.RoomMembersConflictException;
import project_z.demo.dto.RoomRequestsDtos.RoomRequestCountsDto;
import project_z.demo.dto.RoomRequestsDtos.RoomRequestDetailsDto;
import project_z.demo.dto.RoomRequestsDtos.RoomRequestShortDto;
import project_z.demo.entity.*;
import project_z.demo.enums.RequestStatus;
import project_z.demo.enums.RequestType;
import project_z.demo.enums.RoomRole;
import project_z.demo.repositories.*;
import project_z.demo.services.RoomRequestService;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoomRequestServiceImpl implements RoomRequestService {
    private final RoomRequestRepository roomRequestRepository;
    private final RoomMemberRepository roomMemberRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final RoomBanRepository roomBanRepository;
    private final Mapper<RoomRequestsEntity, RoomRequestDetailsDto> requestMapper;
    private final Mapper<RoomRequestsEntity, RoomRequestShortDto> requestShortMapper;

    @Transactional
    public void sendRequest(UUID senderId, UUID receiverId, long roomId, RequestType type) {
        if (roomBanRepository.existsByRoomRoomIdAndUserUserId(roomId, receiverId)) {
            throw new AccessDeniedException("User is permanently banned from this room.");
        }

        RoomEntity room = roomRepository.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found"));

        roomRequestRepository.findByRoom_RoomIdAndUser_UserId(roomId, receiverId).ifPresent(req -> {
            if (req.getStatus() == RequestStatus.PENDING) {
                throw new RoomMembersConflictException("Request is already pending.");
            }
            if (req.getStatus() == RequestStatus.REJECTED && type == RequestType.JOIN_REQUEST) {
                throw new RoomMembersConflictException("Your previous request was rejected.");
            }
        });

        RoomRequestsEntity request = roomRequestRepository.findByRoom_RoomIdAndUser_UserId(roomId, receiverId)
                .orElse(new RoomRequestsEntity());

        request.setRoom(room);

        request.setSender(
                userRepository.findById(senderId).orElseThrow(() -> new ResourceNotFoundException("sender not found")));

        if (type == RequestType.INVITE) {
            request.setUser(userRepository.findById(receiverId)
                    .orElseThrow(() -> new ResourceNotFoundException("receiver not found")));
        } else {
            request.setUser(null);
        }
        request.setStatus(RequestStatus.PENDING);
        request.setType(type);

        roomRequestRepository.save(request);
    }

    @Override
    public RoomRequestCountsDto getRequestCounts(UUID userId) {
        return roomRequestRepository.getRoomRequestCounts(userId);
    }

    @Override
    @Transactional
    public void acceptRequest(UUID roomRequestId) {
        RoomRequestsEntity request = roomRequestRepository.findById(roomRequestId)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found"));

        RoomMemberEntity member = new RoomMemberEntity();
        member.setRoom(request.getRoom());
        member.setUser(request.getUser());
        member.setRole(RoomRole.MEMBER);
        roomMemberRepository.save(member);
        roomRequestRepository.delete(request);
    }

    @Transactional
    public void rejectRequest(UUID roomRequestId) {
        RoomRequestsEntity request = roomRequestRepository.findById(roomRequestId)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found"));

        request.setStatus(RequestStatus.REJECTED);
        roomRequestRepository.save(request);
    }

    @Override
    public void cancelRequest(UUID roomRequestId) {
        RoomRequestsEntity request = roomRequestRepository.findById(roomRequestId)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found"));
        roomRequestRepository.deleteById(roomRequestId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RoomRequestShortDto> getRequestsByUserId(UUID userId, RequestStatus status, RequestType type) {
        if(type.equals(RequestType.JOIN_REQUEST)){
            return roomRequestRepository.findOutgoingRequests(userId, status, type)
                .stream()
                .map(requestShortMapper::mapTo)
                .collect(Collectors.toList());
        }
        else{
            return roomRequestRepository.findIncomingRequests(userId, status, type)
                .stream()
                .map(requestShortMapper::mapTo)
                .collect(Collectors.toList());
        }
    }
}