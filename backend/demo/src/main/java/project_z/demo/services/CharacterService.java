package project_z.demo.services;

import org.springframework.data.domain.Page;
import project_z.demo.common.QueryParameters.CharacterQueryParameters;
import project_z.demo.dto.CharacterDtos.CharacterCreateDto;
import project_z.demo.dto.CharacterDtos.CharacterDetailsDto;
import project_z.demo.dto.CharacterDtos.CharacterShortDto;
import project_z.demo.dto.CharacterDtos.CharacterPatchUpdateDto;
import project_z.demo.entity.CharacterEntity;

import java.util.UUID;

public interface CharacterService {
    CharacterDetailsDto createCharacter(CharacterCreateDto dto, UUID userId);

    CharacterDetailsDto findOne(UUID id, UUID userId);

    Page<CharacterShortDto> search(CharacterQueryParameters params, UUID userId);

    CharacterDetailsDto partialUpdate(UUID id, CharacterPatchUpdateDto dto, UUID userId);

    void deleteById(UUID id, UUID userId);
}
