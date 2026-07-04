package project_z.demo.services;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import project_z.demo.dto.RoomTitleLinkDtos.RoomTitleLinkCreateDto;
import project_z.demo.dto.RoomTitleLinkDtos.RoomTitleLinkDetailsDto;
import project_z.demo.entity.RoomTitleLinkEntity;

@Service
public interface RoomTitleLinkService {
    RoomTitleLinkDetailsDto createLink(RoomTitleLinkCreateDto dto);
    List<RoomTitleLinkDetailsDto> findByRoomTitleId(UUID roomTitleId);

    List<RoomTitleLinkDetailsDto> findUserLinksInRoom(UUID userId, Long roomId);

    void deleteLink(Long titleId, UUID roomTitleId);

    void deleteLinksByRoomTitle(UUID roomTitleId);
}
