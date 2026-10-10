package project_z.demo.dto.UserFavoriteCharacterDtos;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import project_z.demo.dto.CharacterDtos.CharacterShortDto;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserFavoriteCharacterItemDto {
    private UUID id;
    private Integer position;
    private CharacterShortDto character;
}
