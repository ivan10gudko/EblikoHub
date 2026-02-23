package project_z.demo.controllers;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
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
import project_z.demo.dto.TitleDto;
import project_z.demo.entity.TitleEntity;
import project_z.demo.entity.UserEntity;
import project_z.demo.services.TitleService;
import project_z.demo.services.UserService;







@RestController
@RequestMapping("/api/v1/titles")
public class TitleController {
@Autowired
private Mapper<TitleEntity, TitleDto> titleMapper;
@Autowired
private TitleService titleService;
@Autowired
private UserService userService;
@PostMapping("/{userId}")
public ResponseEntity<List<TitleDto>> CreateTitle (
    @PathVariable("userId") UUID userId,
    @RequestBody TitleDto titleDto) {
        TitleEntity titleEntity = titleMapper.mapFrom(titleDto);
        List<TitleEntity> titleEntitys = titleService.addTitle(titleEntity, userId);
        List<TitleDto> response = new ArrayList<>();
        for(TitleEntity entity : titleEntitys){
            response.add(titleMapper.mapTo(entity));
        }
    return new ResponseEntity<>(response, HttpStatus.CREATED);
}


@GetMapping("/{userId}")
public List<TitleDto> getTitleListByUserId(@PathVariable("userId") UUID userId){
    System.out.println("Searching for UUID: " + userId);
    UserEntity userEntity = userService.findOne(userId).orElseThrow(
    ()-> new RuntimeException("user not found"));
    List<TitleEntity> titles = userEntity.getTitleList();
    
    return titles.stream()
    .map(titleMapper::mapTo)
    .collect(Collectors.toList());
    
}

@GetMapping(path = "/{userId}/WATCHED")
public ResponseEntity<List<TitleDto>> getWatchedListByUserId(@PathVariable("userId") UUID userId){
        
        List<TitleEntity> titleEntitys = titleService.getWatchedList(userId);
        List<TitleDto> response = new ArrayList<>();
        for(TitleEntity titleEntity : titleEntitys){
            response.add(titleMapper.mapTo(titleEntity));
        }
        
        return new ResponseEntity<>(response, HttpStatus.OK);
}
@GetMapping(path = "/{userId}/PLANNED")
public ResponseEntity<List<TitleDto>> getWatchListByUserId(@PathVariable("userId") UUID userId){
        
        List<TitleEntity> titleEntitys = titleService.getWatchList(userId);
        List<TitleDto> response = new ArrayList<>();
        for(TitleEntity titleEntity : titleEntitys){
            response.add(titleMapper.mapTo(titleEntity));
        }
        
        return new ResponseEntity<>(response, HttpStatus.OK);
}
@PutMapping(path = "/{titleId}")
public ResponseEntity<TitleDto> fullUpdateTitle (
    @PathVariable("titleId") int titleId,
    @RequestBody TitleDto titleDto
    ) {
    boolean bookExists = titleService.isExists(titleDto.getTitleId());
     TitleEntity titleEntity = titleMapper.mapFrom(titleDto);
        TitleEntity savedTitle = titleService.createTitle(titleEntity);
        TitleDto savedTitleDto = titleMapper.mapTo(savedTitle);
        if(bookExists){
            return new ResponseEntity<>(titleDto, HttpStatus.OK);
        }
        else{
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
}
@PatchMapping(path = "/{titleId}")
    public ResponseEntity<TitleDto> partialUpdate (
        @PathVariable("titleId") Long titleId,@RequestBody TitleDto titleDto
        ){
             if(!titleService.isExists(titleId)){
            return  new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
       TitleEntity titleEntity = titleMapper.mapFrom(titleDto);
        TitleEntity updatedTitleEntity  = titleService.partialUpdate(titleId, titleEntity);
        return new ResponseEntity<>(titleMapper.mapTo(updatedTitleEntity), HttpStatus.OK);
    }
@DeleteMapping(path = "/{titleId}")
    public ResponseEntity<Void> deleteTitleById(
        @PathVariable("titleId") Long titleId
    ){
         if(!titleService.isExists(titleId)){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
         }
          titleService.deleteById(titleId);
          return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
  
    
}