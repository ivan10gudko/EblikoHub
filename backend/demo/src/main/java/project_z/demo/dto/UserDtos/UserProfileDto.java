package project_z.demo.dto.UserDtos;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import project_z.demo.dto.UserFavoriteTitlesDtos.UserFavoriteTitleItemDto;
import project_z.demo.enums.RequestStatus;
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserProfileDto {
    private UUID userId;
    private String name;
    private String nameTag;
    private String description;
    private String img;
    private LocalDateTime createdAt;
    private List<UserFavoriteTitleItemDto> favoriteTitles;

    private RequestStatus friendshipStatus;
    private UUID friendshipId;
}