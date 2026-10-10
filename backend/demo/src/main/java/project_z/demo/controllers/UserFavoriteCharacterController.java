package project_z.demo.controllers;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import project_z.demo.dto.UserDtos.UserProfileDto;
import project_z.demo.security.JwtService;
import project_z.demo.services.UserFavoriteCharacterService;

@RestController
@RequestMapping("/api/v1/userFavoriteCharacters")
@RequiredArgsConstructor
public class UserFavoriteCharacterController {

    private final UserFavoriteCharacterService favoriteCharacterService;
    private final JwtService jwtService;

    @PostMapping("/{characterId}")
    public ResponseEntity<UserProfileDto> addCharacterToFavorite(
            @PathVariable("characterId") UUID characterId,
            @RequestParam("position") Integer position,
            @RequestHeader("Authorization") String token) {

        UUID userId = jwtService.extractUsername(token);
        UserProfileDto res = favoriteCharacterService.addCharacterToFavorite(userId, characterId, position);
        return new ResponseEntity<>(res, HttpStatus.CREATED);
    }

    @PreAuthorize("hasRole('ADMIN') || @securityService.isFavoriteCharacterOwner(#favoriteId)")
    @DeleteMapping("/{favoriteId}")
    public ResponseEntity<Void> deleteCharacterFromFavorite(
            @PathVariable("favoriteId") UUID favoriteId) {

        favoriteCharacterService.deleteCharacterFromFavorite(favoriteId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
