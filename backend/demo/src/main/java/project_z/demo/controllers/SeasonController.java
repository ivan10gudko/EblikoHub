package project_z.demo.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor;
import project_z.demo.Mappers.Mapper;
import project_z.demo.common.Exceptions.ResourceNotFoundException;
import project_z.demo.dto.SeasonDtos.SeasonCreateDto;
import project_z.demo.dto.SeasonDtos.SeasonDto;
import project_z.demo.dto.SeasonDtos.SeasonPatchUpdateDto;
import project_z.demo.entity.SeasonEntity;
import project_z.demo.entity.TitleEntity;
import project_z.demo.services.SeasonService;
import project_z.demo.services.TitleService;

@RestController
@RequestMapping("/api/v1/seasons")
@RequiredArgsConstructor
public class SeasonController {

    private final SeasonService seasonService;
    private final TitleService titleService;
    private final Mapper<SeasonEntity, SeasonDto> seasonMapper;
    private final Mapper<SeasonEntity, SeasonCreateDto> createSeasonMapper;

    @GetMapping(path = "/{titleId}")
    public List<SeasonDto> getSeasons(@PathVariable("titleId") Long titleId) {
        return seasonService.findAll(titleId);
    }

    @PreAuthorize("hasRole('ADMIN') || @securityService.isTitleOwner(#titleId)")
    @PostMapping(path = "/{titleId}")
    public SeasonDto createSeason(@PathVariable("titleId") Long titleId,
            @RequestBody SeasonCreateDto seasonDto) {
        TitleEntity titleEntity = titleService.findOne(titleId).orElseThrow(
                () -> new ResourceNotFoundException("there is no title with that id"));
        
        SeasonEntity seasonEntity = createSeasonMapper.mapFrom(seasonDto);
        titleService.addSeason(seasonEntity, titleEntity);

        return seasonMapper.mapTo(seasonEntity);
    }

    @PreAuthorize("hasRole('ADMIN') || @securityService.isSeasonOwner(#seasonId)")
    @PutMapping(path = "/{seasonId}")
    public ResponseEntity<SeasonDto> fullSeasonUpdate(@PathVariable("seasonId") Long seasonId,
            @RequestBody SeasonDto seasonDto) {
        SeasonEntity existingSeason = seasonService.findById(seasonId).orElseThrow(
                () -> new ResourceNotFoundException("season not found"));

        existingSeason.setName(seasonDto.getName());
        existingSeason.setRating(seasonDto.getRating());

        if (seasonDto.getStatus() != null) {
            existingSeason.setStatus(seasonDto.getStatus());
        }

        SeasonEntity saved = seasonService.save(existingSeason);
        return new ResponseEntity<>(seasonMapper.mapTo(saved), HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN') || @securityService.isTitleOwner(#titleId)")
    @PutMapping("/{titleId}/sync")
    public List<SeasonDto> syncSeasons(
            @PathVariable Long titleId,
            @RequestBody List<SeasonDto> dtos) {
        return seasonService.batchUpdate(titleId, dtos);
    }

    @PreAuthorize("hasRole('ADMIN') || @securityService.isSeasonOwner(#seasonId)")
    @PatchMapping(path = "/{seasonId}")
    public ResponseEntity<SeasonDto> partialSeasonUpdate(@PathVariable("seasonId") Long seasonId,
            @RequestBody SeasonPatchUpdateDto seasonDto) {
        if (!seasonService.isExists(seasonId)) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        SeasonEntity response = seasonService.partialUpdate(seasonId, seasonDto);
        return new ResponseEntity<>(seasonMapper.mapTo(response), HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN') || @securityService.isSeasonOwner(#seasonId)")
    @DeleteMapping(path = "/{seasonId}")
    public ResponseEntity<Void> deleteSeason(@PathVariable Long seasonId) {
        if (!seasonService.isExists(seasonId)) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        seasonService.deleteById(seasonId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}