package project_z.demo.services;

import java.util.List;
import java.util.UUID;

import project_z.demo.dto.RoomTitleDtos.RoomTitleCreateDto;
import project_z.demo.dto.RoomTitleDtos.RoomTitleDetailsDto;
import project_z.demo.dto.RoomTitleDtos.RoomTitleUpdateDto;

public interface RoomTitleService {
    RoomTitleDetailsDto create(RoomTitleCreateDto dto, Long roomId);
    RoomTitleDetailsDto findById(UUID id);
    List<RoomTitleDetailsDto> findAllByRoom(Long roomId);
    RoomTitleDetailsDto update(UUID id, RoomTitleUpdateDto dto);
    void delete(UUID id);
}