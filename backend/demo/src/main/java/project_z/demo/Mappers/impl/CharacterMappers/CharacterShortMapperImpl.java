package project_z.demo.Mappers.impl.CharacterMappers;

import org.springframework.stereotype.Component;
import project_z.demo.Mappers.Mapper;
import project_z.demo.dto.CharacterDtos.CharacterShortDto;
import project_z.demo.entity.CharacterEntity;

@Component
public class CharacterShortMapperImpl implements Mapper<CharacterEntity, CharacterShortDto> {

    @Override
    public CharacterShortDto mapTo(CharacterEntity characterEntity) {
        return CharacterShortDto.builder()
                .id(characterEntity.getId())
                .apiId(characterEntity.getApiId())
                .name(characterEntity.getName())
                .imageUrl(characterEntity.getImageUrl())
                .createdAt(characterEntity.getCreatedAt())
                .build();
    }

    @Override
    public CharacterEntity mapFrom(CharacterShortDto characterShortDto) {
        return CharacterEntity.builder()
                .id(characterShortDto.getId())
                .apiId(characterShortDto.getApiId())
                .name(characterShortDto.getName())
                .imageUrl(characterShortDto.getImageUrl())
                .createdAt(characterShortDto.getCreatedAt())
                .build();
    }
}
