package project_z.demo.services.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collector;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import project_z.demo.JavaUtil.BeanUtilsHelper;
import project_z.demo.JavaUtil.PagingHelper;
import project_z.demo.Mappers.Mapper;
import project_z.demo.common.Exceptions.ResourceNotFoundException;
import project_z.demo.common.QueryParameters.RoomQueryParameters;
import project_z.demo.dto.RoomDtos.RoomCreateDto;
import project_z.demo.dto.RoomDtos.RoomDto;
import project_z.demo.dto.RoomDtos.RoomShortDto;
import project_z.demo.dto.TitleDtos.TitleDto;
import project_z.demo.entity.RoomEntity;
import project_z.demo.entity.RoomMemberEntity;
import project_z.demo.entity.TitleEntity;
import project_z.demo.entity.UserEntity;
import project_z.demo.enums.RequestStatus;
import project_z.demo.enums.RequestType;
import project_z.demo.repositories.RoomMemberRepository;
import project_z.demo.repositories.RoomRepository;
import project_z.demo.repositories.Specifications.RoomSpecifications;
import project_z.demo.repositories.UserRepository;
import project_z.demo.security.JwtService;
import project_z.demo.services.RoomService;

@Service
public class RoomServiceImpl implements RoomService {

    @Autowired
    private RoomRepository roomRepository;
    @Autowired
    private BeanUtilsHelper beanUtilsHelper;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private JwtService jwtService;
    @Autowired
    private Mapper<RoomEntity, RoomDto> roomMapper;
    @Autowired
    private Mapper<RoomEntity, RoomShortDto> roomShortMapper;
    @Autowired
    private RoomMemberRepository roomMemberRepository;

    @Override
    public RoomEntity save(RoomEntity roomEntity) {
        return roomRepository.save(roomEntity);
    }

    @Override
    public Page<RoomShortDto> getRoomsByUserId(UUID userId, RoomQueryParameters queryParameters) {

        Pageable pageable = PagingHelper.toPageable(queryParameters);
        Page<RoomEntity> roomsPage;

        String sortBy = queryParameters.getSortBy();

        if ("memberCount".equals(sortBy) || "membersCount".equals(sortBy)) {

            Pageable nativePageable = PageRequest.of(
                    pageable.getPageNumber(),
                    pageable.getPageSize(),
                    Sort.unsorted());

            roomsPage = "asc".equalsIgnoreCase(queryParameters.getOrder())
                    ? roomRepository.findAllByMemberCountAsc(userId, nativePageable)
                    : roomRepository.findAllByMemberCountDesc(userId, nativePageable);
        } else {

            Specification<RoomEntity> spec = Specification.where(RoomSpecifications.hasMember(userId));
            roomsPage = roomRepository.findAll(spec, pageable);
        }

        if (roomsPage.isEmpty()) {
            return Page.empty(pageable);
        }

        return roomsPage.map(roomShortMapper::mapTo);
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

    public RoomDto createRoom(String token, RoomCreateDto dto) {
        UUID ownerId = jwtService.extractUsername(token);
        UserEntity owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("Owner not found"));

        RoomEntity roomEntity = RoomEntity.builder()
                .roomName(dto.getRoomName())
                .owner(owner)
                .build();
        RoomEntity savedRoom = roomRepository.save(roomEntity);

        if (dto.getMembers() != null) {
            Iterable<UserEntity> membersIterable = userRepository.findAllById(dto.getMembers());
            List<UserEntity> members = new ArrayList<>();
            members = StreamSupport.stream(membersIterable.spliterator(), false)

                    .collect(Collectors.toList());
            List<RoomMemberEntity> memberEntities = members.stream().map(user -> {
                RoomMemberEntity member = new RoomMemberEntity();
                member.setRoom(savedRoom);
                member.setReceiver(user);
                member.setSender(owner);
                member.setStatus(RequestStatus.PENDING);
                member.setType(RequestType.INVITE);
                return member;
            }).collect(Collectors.toList());

            roomMemberRepository.saveAll(memberEntities);
            savedRoom.setMembers(memberEntities);
        }

        return roomMapper.mapTo(savedRoom);
    }

    @Override
    @Transactional
    public RoomDto pinRoom(Long roomId, UUID userId) {

        roomRepository.unpinAllTitlesForUser(userId);

        RoomEntity room = roomRepository.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Title not found with id: " + roomId));

        room.setPinned(true);
        RoomEntity savedTitle = roomRepository.save(room);

        return roomMapper.mapTo(savedTitle);
    }

    @Override
    public void unpin(UUID userId) {
        roomRepository.unpinAllTitlesForUser(userId);
    }
}
