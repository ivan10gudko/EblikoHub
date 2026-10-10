package project_z.demo.services;

import java.util.UUID;

import project_z.demo.dto.UserDtos.UserProfileDto;

public interface UserFavoriteCharacterService {
    UserProfileDto addCharacterToFavorite(UUID userId, UUID characterId, Integer position);
    void deleteCharacterFromFavorite(UUID favoriteId);
}
