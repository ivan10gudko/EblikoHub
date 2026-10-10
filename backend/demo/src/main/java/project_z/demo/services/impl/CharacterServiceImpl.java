package project_z.demo.services.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import project_z.demo.JavaUtil.PatchHelper;
import project_z.demo.JavaUtil.PagingHelper;
import project_z.demo.Mappers.Mapper;
import project_z.demo.common.Exceptions.ResourceNotFoundException;
import project_z.demo.common.QueryParameters.CharacterQueryParameters;
import project_z.demo.dto.CharacterDtos.CharacterCreateDto;
import project_z.demo.dto.CharacterDtos.CharacterDetailsDto;
import project_z.demo.dto.CharacterDtos.CharacterShortDto;
import project_z.demo.dto.CharacterDtos.CharacterPatchUpdateDto;
import project_z.demo.entity.CharacterEntity;
import project_z.demo.entity.UserEntity;
import project_z.demo.repositories.CharacterRepository;
import project_z.demo.repositories.UserRepository;
import project_z.demo.services.CharacterService;
import project_z.demo.common.Exceptions.CharacterExceptions.CharacterWithThatMalIdAlreadyExistsException;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CharacterServiceImpl implements CharacterService {

    private final CharacterRepository characterRepository;
    private final UserRepository userRepository;
    private final Mapper<CharacterEntity, CharacterDetailsDto> characterDetailsMapper;
    private final Mapper<CharacterEntity, CharacterShortDto> characterShortMapper;
    private final Mapper<CharacterEntity, CharacterCreateDto> characterCreateDtoMapper;
    private final PatchHelper patchHelper;

    @Override
    @Transactional
    public CharacterDetailsDto createCharacter(CharacterCreateDto dto, UUID userId) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (dto.getApiId() != null) {
            if (characterRepository.existsByApiIdAndUser_UserId(dto.getApiId(), userId)) {
                throw new CharacterWithThatMalIdAlreadyExistsException("Character with this MAL ID already exists in your list.");
            }
        }
        CharacterEntity characterEntity = characterCreateDtoMapper.mapFrom(dto);
        characterEntity.setUser(user);
        CharacterEntity saved = characterRepository.save(characterEntity);
        return characterDetailsMapper.mapTo(saved);
    }

    @Override
    public CharacterDetailsDto findOne(UUID id, UUID userId) {
        CharacterEntity character = characterRepository.findByIdAndUser_UserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Character not found"));
        return characterDetailsMapper.mapTo(character);
    }

    @Override
    public Page<CharacterShortDto> search(CharacterQueryParameters params, UUID userId) {
        Pageable pageable = PagingHelper.toPageable(params);
        Page<CharacterEntity> page;

        if (params.getSearch() != null && !params.getSearch().trim().isEmpty()) {
            page = characterRepository.findByNameContainingIgnoreCaseAndUser_UserId(params.getSearch().trim(), userId, pageable);
        } else {
            page = characterRepository.findAllByUser_UserId(userId, pageable);
        }

        return page.map(characterShortMapper::mapTo);
    }

    @Override
    @Transactional
    public CharacterDetailsDto partialUpdate(UUID id, CharacterPatchUpdateDto dto, UUID userId) {
        CharacterEntity character = characterRepository.findByIdAndUser_UserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Character not found"));

        patchHelper.updateIfPresent(dto.getName(), character::setName);
        patchHelper.updateIfPresent(dto.getImageUrl(), character::setImageUrl);

        CharacterEntity updated = characterRepository.save(character);
        return characterDetailsMapper.mapTo(updated);
    }

    @Override
    @Transactional
    public void deleteById(UUID id, UUID userId) {
        CharacterEntity character = characterRepository.findByIdAndUser_UserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Character not found"));
        characterRepository.delete(character);
    }
}
