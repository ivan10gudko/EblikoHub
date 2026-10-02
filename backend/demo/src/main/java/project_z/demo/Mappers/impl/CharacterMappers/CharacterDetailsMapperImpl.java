package project_z.demo.Mappers.impl.CharacterMappers;

import org.springframework.stereotype.Component;
import project_z.demo.Mappers.Mapper;
import project_z.demo.dto.CharacterDtos.CharacterDetailsDto;
import project_z.demo.entity.CharacterEntity;

@Component
public class CharacterDetailsMapperImpl implements Mapper<CharacterEntity, CharacterDetailsDto> {

    @Override
    public CharacterDetailsDto mapTo(CharacterEntity characterEntity) {
        return CharacterDetailsDto.builder()
                .id(characterEntity.getId())
                .apiId(characterEntity.getApiId())
                .name(characterEntity.getName())
                .imageUrl(characterEntity.getImageUrl())
                .createdAt(characterEntity.getCreatedAt())
                .build();
    }

    @Override
    public CharacterEntity mapFrom(CharacterDetailsDto characterDetailsDto) {
        return CharacterEntity.builder()
                .id(characterDetailsDto.getId())
                .apiId(characterDetailsDto.getApiId())
                .name(characterDetailsDto.getName())
                .imageUrl(characterDetailsDto.getImageUrl())
                .createdAt(characterDetailsDto.getCreatedAt())
                .build();
    }
}
