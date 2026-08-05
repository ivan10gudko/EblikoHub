package project_z.demo.controllers;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor;
import project_z.demo.dto.UserDtos.UserProfileDto;
import project_z.demo.security.JwtService;
import project_z.demo.services.UserFavoriteTitleService;

@RestController
@RequestMapping("/api/v1/userFavoriteTitles")
@RequiredArgsConstructor
public class UserFavoriteTitleController {

    private final UserFavoriteTitleService favoriteTitleService;
    private final JwtService jwtService;

    @PostMapping("/{titleId}")
    public ResponseEntity<UserProfileDto> addTitleToFavorite(
            @PathVariable("titleId") Long titleId,
            @RequestParam("position") Integer position,
            @RequestHeader("Authorization") String token) {

        UUID userId = jwtService.extractUsername(token);
        UserProfileDto updatedProfile = favoriteTitleService.addTitleToFavorite(userId, titleId, position);
        return new ResponseEntity<>(updatedProfile, HttpStatus.CREATED);
    }

    @PreAuthorize("hasRole('ADMIN') || @securityService.isFavoriteOwner(#favoriteId)")
    @DeleteMapping("/{favoriteId}")
    public ResponseEntity<Void> deleteTitleFromFavorite(
            @PathVariable("favoriteId") UUID favoriteId) {

        favoriteTitleService.deleteTitleFromFavorite(favoriteId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}