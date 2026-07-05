package project_z.demo.services.impl;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import project_z.demo.Mappers.Mapper;
import project_z.demo.common.Exceptions.ResourceNotFoundException;
import project_z.demo.common.Exceptions.RoomBanExceptions.RoomSelfBanException;
import project_z.demo.dto.RoomBanDtos.RoomBanCreateDto;
import project_z.demo.dto.RoomBanDtos.RoomBanDetailsDto;
import project_z.demo.entity.RoomBanEntity;
import project_z.demo.entity.RoomEntity;
import project_z.demo.entity.RoomMemberEntity;
import project_z.demo.entity.UserEntity;
import project_z.demo.repositories.RoomBanRepository;
import project_z.demo.repositories.RoomMemberRepository;
import project_z.demo.repositories.RoomRepository;
import project_z.demo.repositories.UserRepository;
import project_z.demo.security.SecurityService;
import project_z.demo.services.RoomBanService;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RoomBanServiceImpl implements RoomBanService {

    private final SecurityService securityService;
    private final RoomBanRepository roomBanRepository;
    private final RoomMemberRepository roomMemberRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final Mapper<RoomBanEntity, RoomBanDetailsDto> banMapper;
    private final Mapper<RoomBanEntity, RoomBanCreateDto> banCreateMapper;

    @Override
    @Transactional
    public RoomBanDetailsDto create(RoomBanCreateDto banDto, Long roomId) {
        UUID currentUserId = securityService.getCurrentUserId();

        if(currentUserId.equals(banDto.getUserId())){
            throw new RoomSelfBanException("You cant ban yourself");
        }

        UserEntity userBannedByEntity = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + currentUserId));
        RoomEntity roomEntity = roomRepository.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("no room found with id" + roomId));
        RoomMemberEntity roomMemberEntity = roomMemberRepository.findOneByRoom_RoomIdAndUser_UserId(roomId, banDto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Room member not found with id: " + banDto.getUserId()));
        RoomBanEntity entity = new RoomBanEntity();
        entity.setReason(banDto.getReason());
        entity.setBannedBy(userBannedByEntity);
        entity.setUser(roomMemberEntity.getUser());
        entity.setRoom(roomEntity);
        roomMemberRepository.delete(roomMemberEntity);
        return banMapper.mapTo(roomBanRepository.save(entity));
    }

    @Override
    public List<RoomBanDetailsDto> findAllByRoom(Long roomId) {
        return roomBanRepository.findByRoomRoomId(roomId).stream()
                .map(banMapper::mapTo)
                .toList();
    }

    @Override
    public boolean isBanned(Long roomId, UUID userId) {
        return roomBanRepository.existsByRoomRoomIdAndUserUserId(roomId, userId);
    }

    @Override
    public void unban(UUID id){
        RoomBanEntity roomBanEntity = roomBanRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Room ban not found")
        );
        roomBanRepository.delete(roomBanEntity);
    }
}