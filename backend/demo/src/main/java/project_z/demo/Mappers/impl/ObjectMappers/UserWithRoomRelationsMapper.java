package project_z.demo.Mappers.impl.ObjectMappers;

import java.util.UUID;

import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import project_z.demo.Mappers.Mapper;
import project_z.demo.Mappers.impl.RoomRequestMappers.RoomRequestShortMapper;
import project_z.demo.Mappers.impl.RoomRequestMappers.RoomRequestsShortWithoutRoomMapper;
import project_z.demo.dto.UserDtos.UserShortDto;
import project_z.demo.dto.UserDtos.UserWithRelationsToRoomDto;
import project_z.demo.entity.RoomRequestsEntity;
import project_z.demo.entity.UserEntity;
import project_z.demo.enums.RoomRelationStatus;

@Component
@RequiredArgsConstructor
public class UserWithRoomRelationsMapper {

    private final Mapper<UserEntity, UserShortDto> userShortMapper;
    private final RoomRequestsShortWithoutRoomMapper roomRequestMapper;

    public UserWithRelationsToRoomDto mapTo(Object[] row) {
        UserEntity user = (UserEntity) row[0];
        String statusStr = (String) row[1]; 
        RoomRequestsEntity request = (RoomRequestsEntity) row[2];

        return UserWithRelationsToRoomDto.builder()
                .user(userShortMapper.mapTo(user))
                .relationStatus(RoomRelationStatus.valueOf(statusStr))
                .activeRequest(request != null ? roomRequestMapper.mapTo(request) : null)
                .build();
    }
}