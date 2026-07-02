package project_z.demo.Mappers.impl.RoomRequestMappers;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import project_z.demo.Mappers.Mapper;
import project_z.demo.dto.RoomRequestsDtos.RoomRequestShortWithoutRoomDto;
import project_z.demo.dto.UserDtos.UserShortDto;
import project_z.demo.entity.RoomRequestsEntity;
import project_z.demo.entity.UserEntity;

@Component
@RequiredArgsConstructor
public class RoomRequestsShortWithoutRoomMapper implements Mapper<RoomRequestsEntity, RoomRequestShortWithoutRoomDto> {

    private final Mapper<UserEntity, UserShortDto> userMapper;
    private final ModelMapper modelMapper;

    @Override
    public RoomRequestShortWithoutRoomDto mapTo(RoomRequestsEntity entity) {
        return RoomRequestShortWithoutRoomDto.builder()
                .id(entity.getId())
                .userId(entity.getUser() != null ?entity.getUser().getUserId() : null)
                .sender(userMapper.mapTo(entity.getSender()))
                .status(entity.getStatus())
                .type(entity.getType())
                .createdAt(entity.getCreatedAt())
                .build();
    }

    @Override
    public RoomRequestsEntity mapFrom(RoomRequestShortWithoutRoomDto dto) {
        throw new UnsupportedOperationException(
                "Mapping is not supported.");
    }
}