package project_z.demo.services.impl;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import project_z.demo.Mappers.Mapper;
import project_z.demo.Mappers.impl.RoomRequestMappers.RequestsToRoomResponseDtoMapper;
import project_z.demo.common.Exceptions.ResourceNotFoundException;
import project_z.demo.common.Exceptions.RoomMembersExceptions.RoomMembersConflictException;
import project_z.demo.common.Exceptions.RoomRequestExceptions.SelfRoomInviteException;
import project_z.demo.dto.RoomRequestsDtos.RequestsToRoomResponseDto;
import project_z.demo.dto.RoomRequestsDtos.RoomRequestCountsDto;
import project_z.demo.dto.RoomRequestsDtos.RoomRequestDetailsDto;
import project_z.demo.dto.RoomRequestsDtos.RoomRequestShortDto;
import project_z.demo.dto.RoomRequestsDtos.RoomRequestShortWithUserDto;
import project_z.demo.entity.RoomEntity;
import project_z.demo.entity.RoomRequestsEntity;
import project_z.demo.entity.UserEntity;
import project_z.demo.enums.RequestStatus;
import project_z.demo.enums.RequestType;
import project_z.demo.enums.RoomRole;
import project_z.demo.repositories.RoomBanRepository;
import project_z.demo.repositories.RoomMemberRepository;
import project_z.demo.repositories.RoomRepository;
import project_z.demo.repositories.RoomRequestRepository;
import project_z.demo.repositories.UserRepository;
import project_z.demo.services.RoomMemberService;
import project_z.demo.services.RoomRequestService;

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
    private final Mapper<RoomRequestsEntity, RoomRequestShortWithUserDto> requestShortWithUserMapper;
    private final RequestsToRoomResponseDtoMapper requestsToRoomResponseDtoMapper;
    private final RoomMemberService roomMemberService;

    @Override
    @Transactional
    public void sendRequest(UUID senderId, UUID receiverId, long roomId, RequestType type) {
        if (roomBanRepository.existsByRoomRoomIdAndUserUserId(roomId, receiverId)) {
            throw new AccessDeniedException("User is permanently banned from this room.");
        }

        if (senderId.equals(receiverId) && type.equals(RequestType.INVITE)) {
            throw new SelfRoomInviteException("you cant invite yourself");
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

        UserEntity targetUser = (request.getType() == RequestType.JOIN_REQUEST)
                ? request.getSender()
                : request.getUser();

        roomMemberService.addMemberToRoom(request.getRoom(), targetUser, RoomRole.MEMBER);

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
        if (type.equals(RequestType.JOIN_REQUEST)) {
            return roomRequestRepository.findOutgoingRequests(userId, status, type)
                    .stream()
                    .map(requestShortMapper::mapTo)
                    .collect(Collectors.toList());
        } else {
            return roomRequestRepository.findIncomingRequests(userId, status, type)
                    .stream()
                    .map(requestShortMapper::mapTo)
                    .collect(Collectors.toList());
        }
    }

    @Override
    @Transactional(readOnly = true)
    public RequestsToRoomResponseDto getRequestsByRoomId(Long roomId, RequestStatus status, RequestType type) {
        List<RoomRequestsEntity> requests = roomRequestRepository.findByRoom_RoomIdAndStatusAndType(roomId, status,
                type);

        List<RoomRequestShortWithUserDto> dtos = requests.stream()
                .map(requestShortWithUserMapper::mapTo)
                .collect(Collectors.toList());
        return requestsToRoomResponseDtoMapper.mapTo(dtos, roomId);
    }
}