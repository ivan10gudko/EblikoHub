package project_z.demo.Mappers.impl.CharacterMappers;

import org.springframework.stereotype.Component;
import project_z.demo.Mappers.Mapper;
import project_z.demo.dto.CharacterDtos.CharacterCreateDto;
import project_z.demo.dto.CharacterDtos.CharacterDetailsDto;
import project_z.demo.entity.CharacterEntity;

@Component
public class CharacterCreateMapperImpl implements Mapper<CharacterEntity, CharacterCreateDto> {

    @Override
    public CharacterCreateDto mapTo(CharacterEntity characterEntity) {
        throw new UnsupportedOperationException(
                "Mapping from CharacterEntity to CharacterCreateDto is not supported.");
    }

    @Override
    public CharacterEntity mapFrom(CharacterCreateDto characterDetailsDto) {
        return CharacterEntity.builder()
                .name(characterDetailsDto.getName())
                .imageUrl(characterDetailsDto.getImageUrl())
                .apiId(characterDetailsDto.getApiId())
                .build();
    }
}
