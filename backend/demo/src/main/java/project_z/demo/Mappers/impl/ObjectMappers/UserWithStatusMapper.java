package project_z.demo.Mappers.impl.ObjectMappers;

import java.util.UUID;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;
import lombok.RequiredArgsConstructor;
import project_z.demo.Mappers.Mapper;
import project_z.demo.dto.UserDtos.UserDtoWithFriendshipStatus;
import project_z.demo.entity.UserEntity;
import project_z.demo.enums.RequestStatus;

@Component
@RequiredArgsConstructor
public class UserWithStatusMapper implements Mapper<Object[], UserDtoWithFriendshipStatus> {

    private final ModelMapper modelMapper;

    @Override
    public UserDtoWithFriendshipStatus mapTo(Object[] result) {
        UserEntity user = (UserEntity) result[0];
        RequestStatus status = (RequestStatus) result[1];
        UUID friendshipId = (UUID) result[2];
        UserDtoWithFriendshipStatus dto = modelMapper.map(user, UserDtoWithFriendshipStatus.class);
        dto.setFriendshipStatus(status != null ? status : RequestStatus.NONE);
        dto.setFriendshipId(friendshipId);
        return dto;
    }

    @Override
    public Object[] mapFrom(UserDtoWithFriendshipStatus dto) {
        throw new UnsupportedOperationException(
                "Mapping from UserDtoWithFriendshipStatus to Object[] is not supported.");
    }
}