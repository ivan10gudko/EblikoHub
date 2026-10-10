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
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import project_z.demo.dto.TitleDtos.TitleDto;
import project_z.demo.security.JwtService;
import project_z.demo.services.TitleCharacterService;

@RestController
@RequestMapping("/api/v1/title-characters")
@RequiredArgsConstructor
public class TitleCharacterController {

    private final TitleCharacterService titleCharacterService;
    private final JwtService jwtService;

    @PreAuthorize("hasRole('ADMIN') || (@securityService.isTitleOwner(#titleId) && @securityService.isCharacterOwner(#characterId))")
    @PostMapping("/link/{titleId}/{characterId}")
    public ResponseEntity<TitleDto> linkCharacterToTitle(
            @PathVariable("titleId") Long titleId,
            @PathVariable("characterId") UUID characterId,
            @RequestHeader("Authorization") String token) {

        UUID userId = jwtService.extractUsername(token);
        TitleDto updatedTitle = titleCharacterService.linkCharacterToTitle(titleId, characterId, userId);
        return new ResponseEntity<>(updatedTitle, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN') || @securityService.isTitleOwner(#titleId)")
    @DeleteMapping("/unlink/{titleId}")
    public ResponseEntity<TitleDto> unlinkCharacterFromTitle(
            @PathVariable("titleId") Long titleId,
            @RequestHeader("Authorization") String token) {

        UUID userId = jwtService.extractUsername(token);
        TitleDto updatedTitle = titleCharacterService.unlinkCharacterFromTitle(titleId, userId);
        return new ResponseEntity<>(updatedTitle, HttpStatus.OK);
    }
}
