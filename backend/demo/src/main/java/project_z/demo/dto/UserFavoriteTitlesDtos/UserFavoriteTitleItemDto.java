package project_z.demo.dto.UserFavoriteTitlesDtos;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import project_z.demo.dto.TitleDtos.TitleShortDto;
@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserFavoriteTitleItemDto {
    private UUID id;
    private TitleShortDto title;
}
