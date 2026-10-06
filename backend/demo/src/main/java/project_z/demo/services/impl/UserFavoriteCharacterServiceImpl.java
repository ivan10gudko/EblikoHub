package project_z.demo.services.impl;

import java.util.UUID;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import project_z.demo.common.Exceptions.ResourceNotFoundException;
import project_z.demo.common.Exceptions.UserFavoriteCharacterExceptions.UserFavoriteCharacterPositionOccupiedException;
import project_z.demo.common.Exceptions.UserFavoriteCharacterExceptions.UserFavoriteCharactersLimitReachedException;
import project_z.demo.config.AppConfig;
import project_z.demo.dto.UserDtos.UserProfileDto;
import project_z.demo.entity.CharacterEntity;
import project_z.demo.entity.UserEntity;
import project_z.demo.entity.UserFavoriteCharacterEntity;
import project_z.demo.repositories.CharacterRepository;
import project_z.demo.repositories.UserFavoriteCharacterRepository;
import project_z.demo.services.UserFavoriteCharacterService;
import project_z.demo.services.UserService;

@Service
@RequiredArgsConstructor
public class UserFavoriteCharacterServiceImpl implements UserFavoriteCharacterService {

    private final UserFavoriteCharacterRepository favoriteCharacterRepository;
    private final UserService userService;
    private final CharacterRepository characterRepository;
    private final AppConfig appConfig;

    @Override
    @Transactional
    public UserProfileDto addCharacterToFavorite(UUID userId, UUID characterId, Integer position) {
        UserEntity user = userService.findOne(userId);

        CharacterEntity character = characterRepository.findById(characterId).orElseThrow(
                () -> new ResourceNotFoundException("Character not found"));

        if (!character.getUser().getUserId().equals(userId)) {
            throw new AccessDeniedException("You can only add your own characters to favorites");
        }

        boolean alreadyExists = favoriteCharacterRepository.existsByUserUserIdAndCharacterId(userId, characterId);

        if (!alreadyExists) {
            // Reusing maxFavoriteTitles config or if you want a separate maxFavoriteCharacters
            // I'll use maxFavoriteTitles for now as instructed "просто під персонажів підігнати +- ту саму логіку"
            // Wait, I will add maxFavoriteCharacters to AppConfig later, let's use it now
            if (position == null || position < 1 || position > appConfig.getMaxFavoriteCharacters()) {
                throw new IllegalArgumentException(
                        "Invalid position: must be between 1 and " + appConfig.getMaxFavoriteCharacters());
            }

            if (favoriteCharacterRepository.existsByUserUserIdAndPosition(userId, position)) {
                throw new UserFavoriteCharacterPositionOccupiedException("Position " + position + " is already occupied.");
            }

            long currentFavoritesCount = favoriteCharacterRepository.countByUserUserId(userId);
            if (currentFavoritesCount >= appConfig.getMaxFavoriteCharacters()) {
                throw new UserFavoriteCharactersLimitReachedException(
                        "You have reached the maximum limit of favorite characters ("
                                + appConfig.getMaxFavoriteCharacters() + ")");
            }

            UserFavoriteCharacterEntity favorite = UserFavoriteCharacterEntity.builder()
                    .user(user)
                    .character(character)
                    .position(position)
                    .build();
            favoriteCharacterRepository.save(favorite);
        }

        UserProfileDto res = userService.getUserProfile(userId, null);

        return res;
    }

    @Override
    @Transactional
    public void deleteCharacterFromFavorite(UUID favoriteId) {
        if (!favoriteCharacterRepository.existsById(favoriteId)) {
            throw new ResourceNotFoundException("Favorite character record not found");
        }

        favoriteCharacterRepository.deleteById(favoriteId);
    }
}
