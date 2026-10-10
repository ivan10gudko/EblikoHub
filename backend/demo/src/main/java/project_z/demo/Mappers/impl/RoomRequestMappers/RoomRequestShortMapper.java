package project_z.demo.Mappers.impl.RoomRequestMappers;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import project_z.demo.Mappers.Mapper;
import project_z.demo.dto.RoomDtos.RoomShortDto;
import project_z.demo.dto.RoomRequestsDtos.RoomRequestDetailsDto;
import project_z.demo.dto.RoomRequestsDtos.RoomRequestShortDto;
import project_z.demo.dto.UserDtos.UserShortDto;
import project_z.demo.entity.RoomEntity;
import project_z.demo.entity.RoomRequestsEntity;
import project_z.demo.entity.UserEntity;

@Component
@RequiredArgsConstructor
public class RoomRequestShortMapper implements Mapper<RoomRequestsEntity, RoomRequestShortDto> {

    private final ModelMapper modelMapper;
    private final Mapper<RoomEntity, RoomShortDto> roomMapper;
    private final Mapper<UserEntity, UserShortDto> userMapper;

    @Override
    public RoomRequestShortDto mapTo(RoomRequestsEntity entity) {
        return RoomRequestShortDto.builder()
                .id(entity.getId())
                .room(roomMapper.mapTo(entity.getRoom()))
                .userId(entity.getUser() != null ? entity.getUser().getUserId() : null)
                .sender(userMapper.mapTo(entity.getSender()))
                .status(entity.getStatus())
                .type(entity.getType())
                .createdAt(entity.getCreatedAt())
                .build();
    }

    @Override
    public RoomRequestsEntity mapFrom(RoomRequestShortDto friendshipDetailsDto) {
        return modelMapper.map(friendshipDetailsDto, RoomRequestsEntity.class);
    }
}
