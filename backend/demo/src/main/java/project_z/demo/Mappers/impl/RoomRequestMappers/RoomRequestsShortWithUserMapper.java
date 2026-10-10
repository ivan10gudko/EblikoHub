package project_z.demo.Mappers.impl.RoomRequestMappers;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import project_z.demo.Mappers.Mapper;
import project_z.demo.dto.RoomDtos.RoomShortDto;
import project_z.demo.dto.RoomRequestsDtos.RoomRequestShortWithUserDto;
import project_z.demo.dto.UserDtos.UserShortDto;
import project_z.demo.entity.RoomEntity;
import project_z.demo.entity.RoomRequestsEntity;
import project_z.demo.entity.UserEntity;

    @Component
@RequiredArgsConstructor
public class RoomRequestsShortWithUserMapper implements Mapper<RoomRequestsEntity, RoomRequestShortWithUserDto> {

    private final ModelMapper modelMapper;
    private final Mapper<RoomEntity, RoomShortDto> roomMapper;
    private final Mapper<UserEntity, UserShortDto> userMapper;

    @Override
    public RoomRequestShortWithUserDto mapTo(RoomRequestsEntity entity) {
        return RoomRequestShortWithUserDto.builder()
                .id(entity.getId())
                .user(entity.getUser() != null ? userMapper.mapTo(entity.getUser()) : null)
                .sender(userMapper.mapTo(entity.getSender()))
                .status(entity.getStatus())
                .type(entity.getType())
                .createdAt(entity.getCreatedAt())
                .build();
    }

    @Override
    public RoomRequestsEntity mapFrom(RoomRequestShortWithUserDto friendshipDetailsDto) {
        return modelMapper.map(friendshipDetailsDto, RoomRequestsEntity.class);
    }
}
