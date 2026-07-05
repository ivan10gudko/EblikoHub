package project_z.demo.services;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import project_z.demo.dto.RoomBanDtos.RoomBanCreateDto;
import project_z.demo.dto.RoomBanDtos.RoomBanDetailsDto;

@Service
public interface RoomBanService {
    RoomBanDetailsDto create(RoomBanCreateDto ban,Long roomId);
    List<RoomBanDetailsDto> findAllByRoom(Long roomId);
    boolean isBanned(Long roomId, UUID userId);
    void unban(UUID id);
}
