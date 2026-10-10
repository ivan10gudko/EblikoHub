package project_z.demo.services;

import java.util.UUID;

import project_z.demo.dto.TitleDtos.TitleDto;

public interface TitleCharacterService {
    TitleDto linkCharacterToTitle(Long titleId, UUID characterId, UUID userId);
    TitleDto unlinkCharacterFromTitle(Long titleId, UUID userId);
}
