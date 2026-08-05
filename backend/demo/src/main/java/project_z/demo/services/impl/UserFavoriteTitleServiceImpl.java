package project_z.demo.services.impl;

import project_z.demo.services.UserFavoriteTitleService;

import java.util.UUID;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import project_z.demo.Mappers.Mapper;
import project_z.demo.common.Exceptions.ResourceNotFoundException;
import project_z.demo.common.Exceptions.UserFavoriteTitleExceptions.UserFavoriteTitlesLimitReachedException;
import project_z.demo.common.Exceptions.UserFavoriteTitleExceptions.UserFavoriteTitlePositionOccupiedException;
import project_z.demo.config.AppConfig;
import project_z.demo.dto.UserDtos.UserProfileDto;
import project_z.demo.entity.TitleEntity;
import project_z.demo.entity.UserEntity;
import project_z.demo.entity.UserFavoriteTitleEntity;
import project_z.demo.repositories.UserFavoriteTitleRepository;
import project_z.demo.services.TitleService;
import project_z.demo.services.UserFavoriteTitleService;
import project_z.demo.services.UserService;

@Service
@RequiredArgsConstructor
public class UserFavoriteTitleServiceImpl implements UserFavoriteTitleService {

    private final UserFavoriteTitleRepository favoriteTitleRepository;
    private final UserService userService;
    private final TitleService titleService;
    private final Mapper<UserEntity, UserProfileDto> userProfileMapper;
    private final AppConfig appConfig;

    @Override
    @Transactional
    public UserProfileDto addTitleToFavorite(UUID userId, Long titleId, Integer position) {
        UserEntity user = userService.findOne(userId);

        TitleEntity title = titleService.findOne(titleId).orElseThrow(
                () -> new ResourceNotFoundException("Title not found"));

        if (!title.getUser().getUserId().equals(userId)) {
            throw new AccessDeniedException("You can only add your own titles to favorites");
        }

        boolean alreadyExists = favoriteTitleRepository.existsByUserUserIdAndTitleTitleId(userId, titleId);

        if (!alreadyExists) {
            if (position == null || position < 1 || position > appConfig.getMaxFavoriteTitles()) {
                throw new IllegalArgumentException("Invalid position: must be between 1 and " + appConfig.getMaxFavoriteTitles());
            }
            
            if (favoriteTitleRepository.existsByUserUserIdAndPosition(userId, position)) {
                throw new UserFavoriteTitlePositionOccupiedException("Position " + position + " is already occupied.");
            }

            long currentFavoritesCount = favoriteTitleRepository.countByUserUserId(userId);
            if (currentFavoritesCount >= appConfig.getMaxFavoriteTitles()) {
                throw new UserFavoriteTitlesLimitReachedException("You have reached the maximum limit of favorite titles ("
                        + appConfig.getMaxFavoriteTitles() + ")");
            }

            UserFavoriteTitleEntity favorite = UserFavoriteTitleEntity.builder()
                    .user(user)
                    .title(title)
                    .position(position)
                    .build();
            favoriteTitleRepository.save(favorite);
        }

        UserProfileDto res = userService.getUserProfile(userId);

        return res;
    }

    @Override
    @Transactional
    public void deleteTitleFromFavorite(UUID favoriteId) {
        if (!favoriteTitleRepository.existsById(favoriteId)) {
            throw new ResourceNotFoundException("Favorite title record not found");
        }

        favoriteTitleRepository.deleteById(favoriteId);
    }
}