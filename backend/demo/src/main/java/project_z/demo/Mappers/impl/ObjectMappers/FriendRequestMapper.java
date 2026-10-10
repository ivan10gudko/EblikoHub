package project_z.demo.Mappers.impl.ObjectMappers;

import java.util.UUID;
import org.springframework.stereotype.Component;
import lombok.RequiredArgsConstructor;
import project_z.demo.dto.FriendshipDtos.FriendRequestDto;
import project_z.demo.dto.UserDtos.UserDto;
import project_z.demo.dto.UserDtos.UserShortDto;
import project_z.demo.Mappers.Mapper;

@Component
@RequiredArgsConstructor
public class FriendRequestMapper implements Mapper<Object[], FriendRequestDto> {

    @Override
    public FriendRequestDto mapTo(Object[] row) {
        if (row == null || row.length < 5) {
            throw new IllegalArgumentException("Result array for FriendRequestMapper must contain at least 5 elements");
        }

        UUID userId = (UUID) row[0];
        String name = (String) row[1];
        String nameTag = (String) row[2];
        String img = (String) row[3];
        UUID friendshipId = (UUID) row[4]; 

        UserShortDto userDto = new UserShortDto(userId, name, nameTag, img);
        return new FriendRequestDto(friendshipId, userDto);
    }

    @Override
    public Object[] mapFrom(FriendRequestDto dto) {
        throw new UnsupportedOperationException("Mapping from FriendRequestDto to Object[] is not supported.");
    }
}