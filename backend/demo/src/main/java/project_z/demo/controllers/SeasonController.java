package project_z.demo.controllers;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import project_z.demo.Mappers.Mapper;
import project_z.demo.dto.SeasonDto;
import project_z.demo.dto.TitleDto;
import project_z.demo.entity.SeasonEntity;
import project_z.demo.entity.TitleEntity;
import project_z.demo.services.SeasonService;
import project_z.demo.services.TitleService;




@RestController
@RequestMapping("/api/v1/seasons")
public class SeasonController {
    @Autowired
    private SeasonService seasonService;
    @Autowired 
    private Mapper<SeasonEntity, SeasonDto> seasonMapper;
    @Autowired
    private TitleService titleService;
    @Autowired
    private Mapper<TitleEntity, TitleDto> titleMapper;
@GetMapping(path = "/{titleId}")
public List<SeasonDto> getSeasons(@PathVariable("titleId") Long titleId) {
    List<SeasonEntity> entitys = seasonService.findAll(titleId);
    List<SeasonDto> response = new ArrayList<>();
    return seasonService.findAll(titleId).stream().map(a-> seasonMapper.mapTo(a)).collect(Collectors.toList());
}
@PostMapping(path = "/{titleId}")
public TitleDto createSeason(@PathVariable("titleId") Long titleId, @RequestBody SeasonDto seasonDto) {
    TitleEntity titleEntity = titleService.findOne(titleId).orElseThrow(
        () -> new RuntimeException("there is no title with that id")
    );
    SeasonEntity seasonEntity = seasonMapper.mapFrom(seasonDto);
    TitleEntity response = titleService.addSeason(seasonEntity, titleEntity);
    
    return titleMapper.mapTo(titleEntity);
}
@PutMapping(path = "/{seasonId}")
public ResponseEntity<SeasonDto> fullSeasonUpdate(@PathVariable("seasonId") long seasonId, @RequestBody SeasonDto seasonDto) {
    SeasonEntity existingSeason = seasonService.findById(seasonId).orElseThrow(
      ()-> new RuntimeException("season dont found")
    );


    existingSeason.setName(seasonDto.getName());
    existingSeason.setRating(seasonDto.getRating());
    
    if (seasonDto.getStatus() != null) {
       existingSeason.setStatus(seasonDto.getStatus());
    }

    SeasonEntity saved = seasonService.save(existingSeason);
    

    return new ResponseEntity<>(seasonMapper.mapTo(saved), HttpStatus.OK);
}
@PatchMapping(path = "/{seasonId}")
public ResponseEntity<SeasonDto> partialSeasonUpdate(@PathVariable("seasonId") long seasonId, @RequestBody SeasonDto seasonDto){
    if (!seasonService.isExists(seasonId)){
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    SeasonEntity seasonEntity = seasonMapper.mapFrom(seasonDto);
    SeasonEntity response = seasonService.partialUpdate(seasonId, seasonEntity);
    return new ResponseEntity<>(seasonMapper.mapTo(response), HttpStatus.OK);
}
@DeleteMapping(path = "/{seasonId}")
public ResponseEntity<Void> deleteSeason(@PathVariable long seasonId){
    if(!seasonService.isExists(seasonId)){
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    seasonService.deleteById(seasonId);
    return new ResponseEntity<>(HttpStatus.NO_CONTENT);
}
}
