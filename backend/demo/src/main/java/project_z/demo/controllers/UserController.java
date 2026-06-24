package project_z.demo.controllers;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;
import project_z.demo.Mappers.Mapper;
import project_z.demo.common.QueryParameters.UserQueryParameters;
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
    public ResponseEntity<?> createUser(@RequestBody UserPostDto user) {
        UserEntity userEntity = userPostMapper.mapFrom(user);
        if (userRepository.existsByNameTag(userEntity.getNameTag())) {
            return ResponseEntity.badRequest()
                    .body("NameTag '" + userEntity.getNameTag() + "' already exists");
        }
        UserEntity savedUserEntity = userService.save(userEntity);
        return new ResponseEntity<>(userMapper.mapTo(savedUserEntity), HttpStatus.CREATED);
    }

    @GetMapping(path = "/{id}")
    public ResponseEntity<UserDto> getUserById(@PathVariable("id") UUID id) {
        UserEntity foundUser = userService.findOne(id);
        return new ResponseEntity<>(userMapper.mapTo(foundUser), HttpStatus.OK);
    }

    @GetMapping(path = "/{nameTag}/nameTag")
    public UserDto findUsersByNameTag(@PathVariable("nameTag") String nameTag) {
        UserEntity foundUser = userService.findByNameTag(nameTag).orElseThrow(
                () -> new RuntimeException("user not found")
        );
        return userMapper.mapTo(foundUser);
    }

    @GetMapping(path = "/{nameTag}/checkNameTag")
    public boolean isNameTagIsAlreadyTaken(@PathVariable("nameTag") String nameTag) {
        return !userRepository.existsByNameTag(nameTag);
    }

    @GetMapping(path = "/name/{name}")
    public ResponseEntity<Page<UserDto>> findUsersByName(@PathVariable("name") String name, UserQueryParameters userQueryParameters) {
        Page<UserEntity> entities = userService.findByName(name, userQueryParameters);
        Page<UserDto> res = entities.map(userMapper::mapTo);
        if (res.isEmpty()) {
            return new ResponseEntity<>(res, HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN') || @securityService.isUserOwner(#id)")
    @PutMapping(path = "/{id}")
    public ResponseEntity<UserDto> fullUpdateUser(
            @PathVariable("id") UUID id,
            @RequestBody UserUpdateDto userDto) {
        UserEntity userToUpdate = userService.findOne(id);
        userPutMapper.updateEntity(userDto, userToUpdate);
        UserEntity savedUserEntity = userService.save(userToUpdate);
        return new ResponseEntity<>(userMapper.mapTo(savedUserEntity), HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN') || @securityService.isUserOwner(#id)")
    @PatchMapping(path = "/{id}")
    public ResponseEntity<UserDto> partialUpdate(
            @PathVariable("id") UUID id,
            @RequestBody UserDto userDto) {
        if (!userService.isExists(id)) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        UserEntity userEntity = userMapper.mapFrom(userDto);
        UserEntity updatedUserEntity = userService.partialUpdate(id, userEntity);
        return new ResponseEntity<>(userMapper.mapTo(updatedUserEntity), HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN') || @securityService.isUserOwner(#id)")
    @PutMapping(path = "/avatar/{id}")
    public ResponseEntity<String> changeUserImg(
            @PathVariable("id") UUID id,
            @RequestParam("file") MultipartFile file) {
        UserEntity userEntity = userService.findOne(id);
        String response = userService.uploadAvatar(userEntity, file);
        userEntity.setImg(response);
        userRepository.save(userEntity);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping(path = "/{id}")
    public ResponseEntity<Void> deleteUserById(@PathVariable("id") UUID id) {
        if (!userService.isExists(id)) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        userService.deleteById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}