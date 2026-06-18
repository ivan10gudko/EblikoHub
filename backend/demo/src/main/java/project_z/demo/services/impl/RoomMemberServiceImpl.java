package project_z.demo.services.impl;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import project_z.demo.Mappers.Mapper;
import project_z.demo.common.Exceptions.ResourceNotFoundException;
import project_z.demo.common.Exceptions.RoomMembersExceptions.RoomMembersConflictException;
import project_z.demo.dto.RoomMemberDtos.RoomMemberDto;
import project_z.demo.dto.UserDtos.UserShortDto;
import project_z.demo.entity.RoomEntity;
import project_z.demo.entity.RoomMemberEntity;
import project_z.demo.entity.UserEntity;
import project_z.demo.enums.RequestStatus;
import project_z.demo.enums.RequestType;
import project_z.demo.repositories.RoomMemberRepository;
import project_z.demo.repositories.RoomRepository;
import project_z.demo.repositories.UserRepository;
import project_z.demo.services.RoomMemberService;

@Service
public class RoomMemberServiceImpl implements RoomMemberService {
    private final RoomMemberRepository roomMemberRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final Mapper<RoomMemberEntity, RoomMemberDto> memberMapper;
    private final Mapper<UserEntity, UserShortDto> userMapper;

    public RoomMemberServiceImpl(
            RoomMemberRepository roomMemberRepository,
            RoomRepository roomRepository,
            UserRepository userRepository,
            Mapper<RoomMemberEntity, RoomMemberDto> memberMapper,
            Mapper<UserEntity, UserShortDto> userMapper) {
        this.roomMemberRepository = roomMemberRepository;
        this.roomRepository = roomRepository;
        this.userRepository = userRepository;
        this.memberMapper = memberMapper;
        this.userMapper = userMapper;
    }

    @Override
    @Transactional
    public void sendRequest(UUID senderId, UUID receiverId, long roomId, RequestType type) {
        RoomEntity room = roomRepository.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found"));

        Optional<RoomMemberEntity> existing = roomMemberRepository.findByRoomRoomIdAndReceiverUserId(roomId,
                receiverId);

        if (existing.isPresent()) {
            RoomMemberEntity member = existing.get();
            if (member.getStatus() == RequestStatus.ACCEPTED)
                throw new RoomMembersConflictException("Already a member.");

            member.setStatus(RequestStatus.PENDING);
            member.setSender(userRepository.findById(senderId).orElseThrow());
            member.setType(type);
            roomMemberRepository.save(member);
            return;
        }

        RoomMemberEntity newMember = new RoomMemberEntity();
        newMember.setRoom(room);
        newMember.setReceiver(userRepository.findById(receiverId).orElseThrow());
        newMember.setSender(userRepository.findById(senderId).orElseThrow());
        newMember.setStatus(RequestStatus.PENDING);
        newMember.setType(type);
        roomMemberRepository.save(newMember);
    }

    @Override
    @Transactional
    public void acceptRequest(Long roomId, UUID receiverId) {
        RoomMemberEntity member = roomMemberRepository.findByRoomRoomIdAndReceiverUserId(roomId, receiverId)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found"));

        member.setStatus(RequestStatus.ACCEPTED);
        roomMemberRepository.save(member);
    }

    @Override
    @Transactional
    public void rejectRequest(Long roomId, UUID receiverId) {
        RoomMemberEntity member = roomMemberRepository.findByRoomRoomIdAndReceiverUserId(roomId, receiverId)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found"));

        member.setStatus(RequestStatus.REJECTED);
        roomMemberRepository.save(member);
    }

    @Override
    @Transactional
    public void leaveRoom(Long roomId, UUID userId) {
        RoomMemberEntity member = roomMemberRepository.findByRoomRoomIdAndReceiverUserId(roomId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Membership not found"));

        roomMemberRepository.delete(member);
    }

    @Override
    public List<UserShortDto> getAcceptedMembers(Long roomId) {
        return roomMemberRepository.findByRoomRoomIdAndStatus(roomId, RequestStatus.ACCEPTED)
                .stream()
                .map(member -> userMapper.mapTo(member.getReceiver()))
                .collect(Collectors.toList());
    }

    @Override
    public List<RoomMemberDto> getRequests(Long roomId, RequestStatus status, RequestType type) {
        return roomMemberRepository.findByRoomRoomIdAndTypeAndStatus(roomId, type, status)
                .stream()
                .map(memberMapper::mapTo)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public List<RoomMemberDto> getRequestsByUserId(UUID userId, RequestStatus status, RequestType type) {
        return roomMemberRepository.findByReceiverUserIdAndTypeAndStatus(userId, type, status)
                .stream()
                .map(memberMapper::mapTo)
                .collect(Collectors.toList());
    }

    @Transactional
    public void pinRoom(Long roomId, UUID userId) {
        roomMemberRepository.unpinAllForUser(userId);

        RoomMemberEntity member = roomMemberRepository.findByRoomRoomIdAndReceiverUserId(roomId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("You are not a member of this group"));

        member.setPinned(true);
        roomMemberRepository.save(member);
    }

    @Transactional
    public void unpinAll(UUID userId) {
        roomMemberRepository.unpinAllForUser(userId);
    }
}
