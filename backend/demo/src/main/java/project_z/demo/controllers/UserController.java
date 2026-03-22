package project_z.demo.controllers;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;
import project_z.demo.Mappers.Mapper;
import project_z.demo.dto.UserDtos.UserDto;
import project_z.demo.dto.UserDtos.UserPostDto;
import project_z.demo.dto.UserDtos.UserUpdateDto;
import project_z.demo.entity.UserEntity;
import project_z.demo.repositories.UserRepository;
import project_z.demo.services.UserService;




    
@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {  

    private final UserService userService;
    private final Mapper<UserEntity, UserDto> userMapper;
    private final Mapper<UserEntity, UserPostDto> userPostMapper;
    private final Mapper<UserEntity, UserUpdateDto> userPutMapper;
    private final UserRepository userRepository;

    
    @PostMapping
    public ResponseEntity <?> createUser(@RequestBody UserPostDto user) {
        UserEntity userEntity = userPostMapper.mapFrom(user);
        if(userRepository.existsByNameTag(userEntity.getNameTag())){
            return ResponseEntity.badRequest()
            .body("NameTag '" + userEntity.getNameTag() + "already exists");
        }
        UserEntity savedUserEntity = userService.save(userEntity);
        return new ResponseEntity<>( userMapper.mapTo(savedUserEntity), HttpStatus.CREATED);
    }
    
    @GetMapping(path = "/{id}")
    public ResponseEntity<UserDto> getUserById(@PathVariable("id") UUID id){
        UserEntity foundUser = userService.findOne(id);
        return new ResponseEntity<> (userMapper.mapTo(foundUser), HttpStatus.OK);
            
    }
    @GetMapping(path = "/{nameTag}/nameTag")
    public UserDto findUsersByNameTag(@PathVariable("nameTag") String nameTag) {
        UserEntity foundUser = userService.findByNameTag(nameTag).orElseThrow(
            () -> new RuntimeException("user not found")
        );
        UserDto response = userMapper.mapTo(foundUser);
        return response;
    }

    @GetMapping(path = "/{nameTag}/checkNameTag")
    public boolean isNameTagIsAlreadyTaken(@PathVariable("nameTag")String nameTag) {
        if(userRepository.existsByNameTag(nameTag)){
            return false;
        }
        return true;
    }
    
    @GetMapping(path = "/name/{name}")
    public ResponseEntity<List<UserDto>> findUsersByName(@PathVariable("name")String name) {
        List<UserDto> response = userService.findByName(name).stream().map(userMapper::mapTo).collect(Collectors.toList());
        if(response.isEmpty()){
            return new ResponseEntity<>(response, HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    
    @PreAuthorize("hasRole('ADMIN') || @securityService.isUserOwner(#id, #token)")
    @PutMapping(path  = "/{id}")
    public ResponseEntity<UserDto> fullUpdateUser(
        @PathVariable("id") UUID id,
        @RequestHeader("Authorization") String token,
        @RequestBody UserUpdateDto userDto) {
        UserEntity userToUpdate = userService.findOne(id);

        userPutMapper.updateEntity(userDto,userToUpdate);
        
        UserEntity savedUserEntity =  userService.save(userToUpdate);
      return new ResponseEntity<> (userMapper.mapTo(savedUserEntity), HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN') || @securityService.isUserOwner(#id, #token)")
    @PatchMapping(path = "/{id}")
    public ResponseEntity<UserDto> partialUpdate (
        @PathVariable("id") UUID id,
        @RequestHeader("Authorization") String token,
        @RequestBody UserDto userDto
        ){
             if(!userService.isExists(id)){
            return  new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
       UserEntity userEntity = userMapper.mapFrom(userDto);
        UserEntity updatedUserEntity  = userService.partialUpdate(id, userEntity);
        return new ResponseEntity<>(userMapper.mapTo(updatedUserEntity), HttpStatus.OK);
    }
    @PreAuthorize("hasRole('ADMIN') || @securityService.isUserOwner(#id, #token)")
    @PutMapping(path = "/avatar/{id}")
    public ResponseEntity<String> changeUserImg(
        @PathVariable("id") UUID id,
        @RequestHeader("Authorization") String token,
        @RequestParam("file") MultipartFile file){
        UserEntity userEntity = userService.findOne(id);
        
        String response =  userService.uploadAvatar(userEntity,file);
        userEntity.setImg(response);
        userRepository.save(userEntity);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping(path = "/{id}")
    public ResponseEntity<Void> deleteUserById(
        @PathVariable("id") UUID id,
        @RequestHeader("Authorization") String token
    ){
         if(!userService.isExists(id)){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
         }
          userService.deleteById(id);
          return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
