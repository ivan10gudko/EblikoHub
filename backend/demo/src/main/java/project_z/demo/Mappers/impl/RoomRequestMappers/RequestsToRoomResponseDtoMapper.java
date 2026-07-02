package project_z.demo.Mappers.impl.RoomRequestMappers;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import project_z.demo.Mappers.Mapper;
import project_z.demo.dto.RoomDtos.RoomShortDto;
import project_z.demo.dto.RoomRequestsDtos.RequestsToRoomResponseDto;
import project_z.demo.dto.RoomRequestsDtos.RoomRequestShortDto;
import project_z.demo.dto.RoomRequestsDtos.RoomRequestShortWithUserDto;
import project_z.demo.dto.UserDtos.UserShortDto;
import project_z.demo.entity.RoomEntity;
import project_z.demo.entity.RoomRequestsEntity;
import project_z.demo.entity.UserEntity;

@Component
@RequiredArgsConstructor
public class RequestsToRoomResponseDtoMapper {

    public RequestsToRoomResponseDto mapTo(List<RoomRequestShortWithUserDto> dtos, long roomId) {
        return RequestsToRoomResponseDto.builder()
                .roomId(roomId)
                .requests(dtos)
                .build();

    }

    public RoomRequestsEntity mapFrom() {
        throw new UnsupportedOperationException(
                "Mapping from UserDtoWithFriendshipStatus to Object[] is not supported.");
    }
}
