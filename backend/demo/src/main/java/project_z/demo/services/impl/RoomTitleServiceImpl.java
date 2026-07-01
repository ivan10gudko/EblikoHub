package project_z.demo.services.impl;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import project_z.demo.Mappers.Mapper;
import project_z.demo.common.Exceptions.ResourceNotFoundException;
import project_z.demo.dto.RoomTitleDtos.RoomTitleCreateDto;
import project_z.demo.dto.RoomTitleDtos.RoomTitleDetailsDto;
import project_z.demo.dto.RoomTitleDtos.RoomTitleUpdateDto;
import project_z.demo.entity.RoomEntity;
import project_z.demo.entity.RoomTitleEntity;
import project_z.demo.repositories.RoomRepository;
import project_z.demo.repositories.RoomTitleEntityRepository;
import project_z.demo.security.SecurityService;
import project_z.demo.services.RoomTitleService;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RoomTitleServiceImpl implements RoomTitleService {
    private final RoomRepository roomRepository;
    private final RoomTitleEntityRepository repository;
    private final Mapper<RoomTitleEntity, RoomTitleDetailsDto> mapper;
    private final Mapper<RoomTitleEntity, RoomTitleUpdateDto> updateMapper;
    private final Mapper<RoomTitleEntity, RoomTitleCreateDto> createMapper;
    private final SecurityService securityService;
    @Override
    @Transactional
    public RoomTitleDetailsDto create(RoomTitleCreateDto dto, Long roomId) {
        UUID currentUserId = securityService.getCurrentUserId();
        RoomEntity roomEntity = roomRepository.findById(roomId).orElseThrow(() -> new ResourceNotFoundException("room not found"));
        RoomTitleEntity entity = createMapper.mapFrom(dto);
        entity.setRoom(roomEntity);
        entity.setAddedByUserId(currentUserId);
        
        return mapper.mapTo(repository.save(entity));
    }

    @Override
    public RoomTitleDetailsDto findById(UUID id) {
        return repository.findById(id)
                .map(mapper::mapTo)
                .orElseThrow(() -> new ResourceNotFoundException("Room Title not found"));
    }

    @Override
    public List<RoomTitleDetailsDto> findAllByRoom(Long roomId) {
        return repository.findByRoom_RoomId(roomId).stream()
                .map(mapper::mapTo)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void delete(UUID id) {
        repository.deleteById(id);
    }

    @Override
    @Transactional
    public RoomTitleDetailsDto update(UUID userId,RoomTitleUpdateDto dto){
        RoomTitleEntity roomTitleEntity = updateMapper.mapFrom(dto);
        return mapper.mapTo( repository.save(roomTitleEntity));
    }
    
}