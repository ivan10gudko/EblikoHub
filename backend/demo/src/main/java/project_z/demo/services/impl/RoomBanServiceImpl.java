package project_z.demo.services.impl;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import project_z.demo.Mappers.Mapper;
import project_z.demo.dto.RoomBanDtos.RoomBanCreateDto;
import project_z.demo.dto.RoomBanDtos.RoomBanDetailsDto;
import project_z.demo.entity.RoomBanEntity;
import project_z.demo.repositories.RoomBanRepository;
import project_z.demo.services.RoomBanService;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RoomBanServiceImpl implements RoomBanService {

    private final RoomBanRepository roomBanRepository;
    private final Mapper<RoomBanEntity, RoomBanDetailsDto> banMapper; 
    private final Mapper<RoomBanEntity, RoomBanCreateDto> banCreateMapper; 


    @Override
    @Transactional
    public RoomBanDetailsDto create(RoomBanCreateDto banDto) {
        RoomBanEntity entity = banCreateMapper.mapFrom(banDto);
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
}