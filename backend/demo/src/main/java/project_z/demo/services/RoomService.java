package project_z.demo.services;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import project_z.demo.common.QueryParameters.RoomQueryParameters;
import project_z.demo.dto.RoomDtos.RoomCreateDto;
import project_z.demo.dto.RoomDtos.RoomDto;
import project_z.demo.dto.RoomDtos.RoomShortDto;
import project_z.demo.entity.RoomEntity;

@Service
public interface RoomService {
RoomEntity save(RoomEntity roomEntity);
Page<RoomShortDto> getRoomsByUserId(UUID userId, RoomQueryParameters queryParameters);
RoomEntity partialUpdate(Long id, RoomEntity source);
boolean isExists(Long id);
Optional<RoomEntity> findOne(Long titleId);
void deleteById(Long id);
RoomEntity addMembersToRoom(Long roomId, List<UUID> userIds);
void deleteMembers(Long roomId, List<UUID> userIds);
RoomDto createRoom(String token, RoomCreateDto dto);
void leaveRoom(UUID userId, Long roomId);
}
