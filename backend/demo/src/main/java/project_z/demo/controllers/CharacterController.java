package project_z.demo.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import project_z.demo.Mappers.Mapper;
import project_z.demo.common.QueryParameters.CharacterQueryParameters;
import project_z.demo.dto.CharacterDtos.CharacterCreateDto;
import project_z.demo.dto.CharacterDtos.CharacterDetailsDto;
import project_z.demo.dto.CharacterDtos.CharacterShortDto;
import project_z.demo.dto.CharacterDtos.CharacterPatchUpdateDto;
import project_z.demo.entity.CharacterEntity;
import project_z.demo.security.JwtService;
import project_z.demo.services.CharacterService;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/characters")
@RequiredArgsConstructor
public class CharacterController {

    private final CharacterService characterService;

    private final JwtService jwtService;

    @PostMapping
    public ResponseEntity<CharacterDetailsDto> createCharacter(
            @RequestHeader("Authorization") String token,
            @RequestBody CharacterCreateDto dto) {
        UUID userId = jwtService.extractUsername(token);
        CharacterDetailsDto created = characterService.createCharacter(dto, userId);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CharacterDetailsDto> getCharacter(
            @RequestHeader("Authorization") String token,
            @PathVariable("id") UUID id) {
        UUID userId = jwtService.extractUsername(token);
        CharacterDetailsDto dto = characterService.findOne(id, userId);
        return new ResponseEntity<>(dto, HttpStatus.OK);
    }

    @GetMapping("/search")
    public ResponseEntity<Page<CharacterShortDto>> searchCharacters(
            @RequestHeader("Authorization") String token,
            CharacterQueryParameters params) {
        UUID userId = jwtService.extractUsername(token);
        Page<CharacterShortDto> page = characterService.search(params, userId);
        return new ResponseEntity<>(page, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN') || @securityService.isCharacterOwner(id)")
    @PatchMapping("/{id}")
    public ResponseEntity<CharacterDetailsDto> partialUpdateCharacter(
            @RequestHeader("Authorization") String token,
            @PathVariable("id") UUID id,
            @RequestBody CharacterPatchUpdateDto dto) {
        UUID userId = jwtService.extractUsername(token);
        CharacterDetailsDto updated = characterService.partialUpdate(id, dto, userId);
        return new ResponseEntity<>(updated, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN') || @securityService.isCharacterOwner(id)")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCharacter(
            @RequestHeader("Authorization") String token,
            @PathVariable("id") UUID id) {
        UUID userId = jwtService.extractUsername(token);
        characterService.deleteById(id, userId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
