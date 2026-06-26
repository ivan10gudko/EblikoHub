package project_z.demo.services.impl;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import project_z.demo.JavaUtil.BeanUtilsHelper;
import project_z.demo.Mappers.Mapper;
import project_z.demo.common.Exceptions.ResourceNotFoundException;
import project_z.demo.common.QueryParameters.RoomQueryParameters;
import project_z.demo.dto.RoomDtos.RoomCreateDto;
import project_z.demo.dto.RoomDtos.RoomDto;
import project_z.demo.dto.RoomDtos.RoomShortDto;
import project_z.demo.entity.RoomEntity;
import project_z.demo.entity.RoomMemberEntity;
import project_z.demo.entity.RoomRequestsEntity;
import project_z.demo.entity.UserEntity;
import project_z.demo.enums.RequestStatus;
import project_z.demo.enums.RequestType;
import project_z.demo.enums.RoomRole;
import project_z.demo.repositories.RoomMemberRepository;
import project_z.demo.repositories.RoomRepository;
import project_z.demo.repositories.RoomRequestRepository;
import project_z.demo.repositories.Specifications.RoomSpecifications;
import project_z.demo.repositories.UserRepository;
import project_z.demo.security.JwtService;
import project_z.demo.services.RoomService;

@Service
@RequiredArgsConstructor
public class RoomServiceImpl implements RoomService {

    private final RoomRepository roomRepository;
    private final BeanUtilsHelper beanUtilsHelper;
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final Mapper<RoomEntity, RoomDto> roomMapper;
    private final Mapper<RoomEntity, RoomShortDto> roomShortMapper;
    private final RoomMemberRepository roomMemberRepository;
    private final RoomRequestRepository roomRequestRepository;

    @Override
    public RoomEntity save(RoomEntity roomEntity) {
        return roomRepository.save(roomEntity);
    }

    @Override
    public Page<RoomShortDto> getRoomsByUserId(UUID userId, RoomQueryParameters params) {
        Specification<RoomEntity> spec = Specification
                .where(RoomSpecifications.hasMember(userId))
                .and(RoomSpecifications.hasNameLike(params.getSearch()))
                .and(RoomSpecifications.sortByPinnedThenUser(userId, params.getSortBy(), params.getOrder()));

        Pageable pageable = PageRequest.of(params.getPage(), params.getLimit(), Sort.unsorted());

        Page<RoomEntity> roomPage = roomRepository.findAll(spec, pageable);

        List<Long> roomIds = roomPage.getContent().stream()
                .map(RoomEntity::getRoomId)
                .toList();

        Map<Long, Boolean> pinnedByRoomId = roomIds.isEmpty()
                ? Map.of()
                : roomMemberRepository.findByRoom_RoomIdInAndUser_UserId(roomIds, userId).stream()
                        .collect(Collectors.toMap(
                                m -> m.getRoom().getRoomId(),
                                RoomMemberEntity::isPinned));

        return roomPage.map(room -> {
            RoomShortDto dto = roomShortMapper.mapTo(room);
            dto.setPinned(pinnedByRoomId.getOrDefault(room.getRoomId(), false));
            dto.setOwner(room.getOwner().getUserId().equals(userId));
            return dto;
        });
    }

    @Override
    public boolean isExists(Long id) {
        return roomRepository.existsById(id);
    }

    @Override
    public RoomDto findOne(Long id) {
        RoomEntity room = roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found"));
        return roomMapper.mapTo(room);
    }

    @Override
    public void deleteById(Long Id) {
        roomRepository.deleteById(Id);
    }

    @Transactional
    public RoomDto createRoom(String token, RoomCreateDto dto) {
        UUID ownerId = jwtService.extractUsername(token);
        UserEntity owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("Owner not found"));

        RoomEntity roomEntity = RoomEntity.builder()
                .roomName(dto.getRoomName())
                .owner(owner)
                .build();
        RoomEntity savedRoom = roomRepository.save(roomEntity);

        RoomMemberEntity ownerMember = new RoomMemberEntity();
        ownerMember.setRoom(savedRoom);
        ownerMember.setUser(owner);
        ownerMember.setRole(RoomRole.OWNER);
        roomMemberRepository.save(ownerMember);

        if (dto.getMembers() != null) {
            List<UUID> memberIds = dto.getMembers().stream()
                    .filter(id -> !id.equals(ownerId))
                    .toList();

            Iterable<UserEntity> membersIterable = userRepository.findAllById(memberIds);
            List<UserEntity> members = StreamSupport.stream(membersIterable.spliterator(), false)
                    .collect(Collectors.toList());

            List<RoomRequestsEntity> inviteRequests = members.stream().map(user -> {
                RoomRequestsEntity request = new RoomRequestsEntity();
                request.setRoom(savedRoom);
                request.setUser(user);
                request.setSender(owner);
                request.setStatus(RequestStatus.PENDING);
                request.setType(RequestType.INVITE);
                return request;
            }).collect(Collectors.toList());

            roomRequestRepository.saveAll(inviteRequests);
        }

        return roomMapper.mapTo(savedRoom);
    }
}
