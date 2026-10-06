package project_z.demo.Mappers.impl.UserFavoriteCharacterMappers;

import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import project_z.demo.Mappers.Mapper;
import project_z.demo.dto.CharacterDtos.CharacterShortDto;
import project_z.demo.dto.UserFavoriteCharacterDtos.UserFavoriteCharacterItemDto;
import project_z.demo.entity.CharacterEntity;
import project_z.demo.entity.UserFavoriteCharacterEntity;

@Component
@RequiredArgsConstructor
public class UserFavoriteCharacterItemMapperImpl implements Mapper<UserFavoriteCharacterEntity, UserFavoriteCharacterItemDto> {

    private final Mapper<CharacterEntity, CharacterShortDto> characterMapper;

    @Override
    public UserFavoriteCharacterItemDto mapTo(UserFavoriteCharacterEntity entity) {
        if (entity == null) {
            return null;
        }
        return UserFavoriteCharacterItemDto.builder()
                .id(entity.getId())
                .position(entity.getPosition())
                .character(characterMapper.mapTo(entity.getCharacter()))
                .build();
    }

    @Override
    public UserFavoriteCharacterEntity mapFrom(UserFavoriteCharacterItemDto dto) {
        if (dto == null) {
            return null;
        }
        return UserFavoriteCharacterEntity.builder()
                .id(dto.getId())
                .position(dto.getPosition())
                .character(characterMapper.mapFrom(dto.getCharacter()))
                .build();
    }
}
