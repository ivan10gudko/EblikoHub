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
boolean isExists(Long id);
RoomDto findOne(Long titleId);
void deleteById(Long id);
RoomDto createRoom(String token, RoomCreateDto dto);
RoomDto pinRoom(Long roomId, UUID userId);
void unpin(UUID userId);
}
