package project_z.demo.dto.UserBadgesDtos;

import java.util.UUID;

import lombok.Data;
import project_z.demo.dto.UserDtos.UserDto;
import project_z.demo.enums.UserAboutType;

@Data
public class UserBadgesDetailsDto {
    private UUID id;
    private UserDto user;
    private UserAboutType type;
}
