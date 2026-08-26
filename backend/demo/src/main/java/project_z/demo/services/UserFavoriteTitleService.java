package project_z.demo.services;

import java.util.UUID;

import project_z.demo.dto.UserDtos.UserProfileDto;

public interface UserFavoriteTitleService {
    UserProfileDto addTitleToFavorite(UUID userId, Long titleId, Integer position);
    void deleteTitleFromFavorite(UUID favoriteId);
}
