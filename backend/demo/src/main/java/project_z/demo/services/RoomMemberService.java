package project_z.demo.services;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import project_z.demo.dto.UserDtos.UserShortDto;

@Service
public interface RoomMemberService {
    void leaveRoom(Long roomId, UUID userId);
    void pinRoom(Long roomId, UUID userId);
    void unpinAll(UUID userId);
    List<UserShortDto> getAcceptedMembers(Long roomId);
}
