package project_z.demo.services.impl;

import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import project_z.demo.Mappers.Mapper;
import project_z.demo.common.Exceptions.ResourceNotFoundException;
import project_z.demo.dto.TitleDtos.TitleDto;
import project_z.demo.entity.CharacterEntity;
import project_z.demo.entity.TitleEntity;
import project_z.demo.repositories.CharacterRepository;
import project_z.demo.repositories.TitleRepository;
import project_z.demo.services.TitleCharacterService;

@Service
@RequiredArgsConstructor
public class TitleCharacterServiceImpl implements TitleCharacterService {

    private final TitleRepository titleRepository;
    private final CharacterRepository characterRepository;
    private final Mapper<TitleEntity, TitleDto> titleMapper;

    @Override
    @Transactional
    public TitleDto linkCharacterToTitle(Long titleId, UUID characterId, UUID userId) {
        TitleEntity title = titleRepository.findById(titleId)
                .orElseThrow(() -> new ResourceNotFoundException("Title not found"));

        CharacterEntity character = characterRepository.findById(characterId)
                .orElseThrow(() -> new ResourceNotFoundException("Character not found"));

        title.setCharacter(character);
        TitleEntity savedTitle = titleRepository.save(title);

        return titleMapper.mapTo(savedTitle);
    }

    @Override
    @Transactional
    public TitleDto unlinkCharacterFromTitle(Long titleId, UUID userId) {
        TitleEntity title = titleRepository.findById(titleId)
                .orElseThrow(() -> new ResourceNotFoundException("Title not found"));

        title.setCharacter(null);
        TitleEntity savedTitle = titleRepository.save(title);

        return titleMapper.mapTo(savedTitle);
    }
}
