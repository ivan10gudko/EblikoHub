package project_z.demo.services.impl;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import project_z.demo.Mappers.Mapper;
import project_z.demo.common.Exceptions.ResourceNotFoundException;
import project_z.demo.dto.RoomMemberDtos.RoomMemberDto;
import project_z.demo.dto.UserDtos.UserShortDto;
import project_z.demo.entity.RoomMemberEntity;
import project_z.demo.entity.UserEntity;
import project_z.demo.repositories.RoomBanRepository;
import project_z.demo.repositories.RoomMemberRepository;
import project_z.demo.repositories.RoomRepository;
import project_z.demo.repositories.UserRepository;
import project_z.demo.services.RoomMemberService;

@Service
@RequiredArgsConstructor
public class RoomMemberServiceImpl implements RoomMemberService {
    private final RoomMemberRepository roomMemberRepository;
    private final Mapper<RoomMemberEntity, RoomMemberDto> memberMapper;
    private final Mapper<UserEntity, UserShortDto> userMapper;
    private final RoomBanRepository roomBanRepository;

    @Override
    @Transactional
    public void leaveRoom(Long roomId, UUID userId) {
        RoomMemberEntity member = roomMemberRepository.findOneByRoom_RoomIdAndUser_UserId(roomId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Membership not found"));
        roomMemberRepository.delete(member);
    }

    @Transactional
    public void pinRoom(Long roomId, UUID userId) {
        roomMemberRepository.unpinAllForUser(userId);

        RoomMemberEntity member = roomMemberRepository.findOneByRoom_RoomIdAndUser_UserId(roomId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("You are not a member of this group"));

        member.setPinned(true);
        roomMemberRepository.save(member);
    }

    @Transactional
    public void unpinAll(UUID userId) {
        roomMemberRepository.unpinAllForUser(userId);
    }

    @Override
    public List<UserShortDto> getAcceptedMembers(Long roomId) {
        return roomMemberRepository.findByRoom_RoomId(roomId)
                .stream()
                .map(member -> userMapper.mapTo(member.getUser()))
                .collect(Collectors.toList());
    }

    @Override
    public RoomMemberDto getRooMemberByRoomIdAndUserId(Long roomId, UUID userId){
      RoomMemberEntity roomMemberEntity =  roomMemberRepository.findOneByRoom_RoomIdAndUser_UserId(roomId, userId).orElseThrow(
        () -> new ResourceNotFoundException("This user dont have a membership in room " + roomId)
      );
      return memberMapper.mapTo((roomMemberEntity));
    }
}
