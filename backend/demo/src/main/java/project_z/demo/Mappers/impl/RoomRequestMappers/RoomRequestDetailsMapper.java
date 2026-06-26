package project_z.demo.Mappers.impl.RoomRequestMappers;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import project_z.demo.Mappers.Mapper;
import project_z.demo.dto.RoomDtos.RoomShortDto;
import project_z.demo.dto.RoomRequestsDtos.RoomRequestDetailsDto;
import project_z.demo.dto.UserDtos.UserShortDto;
import project_z.demo.entity.RoomEntity;
import project_z.demo.entity.RoomRequestsEntity;
import project_z.demo.entity.UserEntity;

@Component
@RequiredArgsConstructor
public class RoomRequestDetailsMapper implements Mapper<RoomRequestsEntity, RoomRequestDetailsDto> {

    private final ModelMapper modelMapper;
    private final Mapper<RoomEntity, RoomShortDto> roomMapper;
    private final Mapper<UserEntity, UserShortDto> userMapper;

    @Override
    public RoomRequestDetailsDto mapTo(RoomRequestsEntity entity) {
        return RoomRequestDetailsDto.builder()
                .id(entity.getId())
                .room(roomMapper.mapTo(entity.getRoom()))
                .user(userMapper.mapTo(entity.getUser()))
                .sender(userMapper.mapTo(entity.getSender()))
                .status(entity.getStatus())
                .type(entity.getType())
                .createdAt(entity.getCreatedAt())
                .build();
    }
    
    @Override
    public RoomRequestsEntity mapFrom(RoomRequestDetailsDto friendshipDetailsDto) {
        return modelMapper.map(friendshipDetailsDto, RoomRequestsEntity.class);
    }
}