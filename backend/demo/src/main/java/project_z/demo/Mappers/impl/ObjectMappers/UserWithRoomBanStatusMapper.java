package project_z.demo.Mappers.impl.ObjectMappers;

import java.util.UUID;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;
import lombok.RequiredArgsConstructor;
import project_z.demo.Mappers.Mapper;
import project_z.demo.dto.UserDtos.UserDtoWithRoomBanStatus;
import project_z.demo.entity.UserEntity;

@Component
@RequiredArgsConstructor
public class UserWithRoomBanStatusMapper implements Mapper<Object[], UserDtoWithRoomBanStatus> {

    private final ModelMapper modelMapper;

    @Override
    public UserDtoWithRoomBanStatus mapTo(Object[] result) {
        UserEntity user = (UserEntity) result[0];
        Boolean isBanned = (Boolean) result[1];
        UUID roomBanId = (UUID) result[2];
        
        UserDtoWithRoomBanStatus dto = modelMapper.map(user, UserDtoWithRoomBanStatus.class);
        dto.setBanned(isBanned != null && isBanned);
        dto.setRoomBanId(roomBanId);
        return dto;
    }

    @Override
    public Object[] mapFrom(UserDtoWithRoomBanStatus dto) {
        throw new UnsupportedOperationException(
                "Mapping from UserDtoWithRoomBanStatus to Object[] is not supported.");
    }
}
