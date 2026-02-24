package project_z.demo.controllers;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.modelmapper.ModelMapper;
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
import project_z.demo.dto.RoomDto;
import project_z.demo.dto.UserDto;
import project_z.demo.entity.RoomEntity;
import project_z.demo.entity.UserEntity;
import project_z.demo.services.RoomService;
import project_z.demo.services.UserService;






@RestController
@RequestMapping("/api/v1/rooms")
public class RoomController {
    @Autowired
    private RoomService roomService;
    @Autowired
    private UserService userService;
    @Autowired
    private Mapper<RoomEntity,RoomDto> roomMapper;
    @Autowired
    private ModelMapper modelMapper;
    @GetMapping("/{roomId}")
    public ResponseEntity<RoomDto> getRoomById(@PathVariable("roomId")Long roomId  ) {
        RoomEntity roomEntity = roomService.findOne(roomId).orElseThrow(
            () -> new RuntimeException("there is no room with that id")
        );
        RoomDto response = roomMapper.mapTo(roomEntity);
        return new ResponseEntity<>(response, HttpStatus.OK);

    }
    
    @GetMapping("/user/{id}")
    public List<RoomEntity> getRoomsByUserId(@PathVariable("id") UUID id) {
        List<RoomEntity> response = roomService.getRoomsByUserId(id);
        return response;
    }
    @GetMapping
    public List<RoomEntity> getAllRooms() {
       List<RoomEntity> response = roomService.findAll();
       return response;
    }

    @PostMapping("/{userId}")
    public ResponseEntity<RoomDto> createRoom(@PathVariable("userId") UUID userId, @RequestBody RoomDto roomDto) {
        UserEntity owner = userService.findOne(userId).orElseThrow(
            ()-> new RuntimeException("user not found ")
        );
        RoomEntity roomEntity = roomMapper.mapFrom(roomDto);
        roomEntity.setOwner(owner);
        RoomEntity savedRoom = roomService.save(roomEntity);
        RoomDto savedRoomDto = roomMapper.mapTo(savedRoom);
        return new ResponseEntity<>(savedRoomDto, HttpStatus.CREATED);
    }
    @PutMapping(path = "/{id}")
    public ResponseEntity<RoomDto> roomFullUpdate(@PathVariable("id") Long id, @RequestBody RoomDto roomDto) {
        RoomEntity roomEntity = roomMapper.mapFrom(roomDto);
        RoomEntity updatedRoomEntity = roomService.save(roomEntity);
        RoomDto updatedRoomDto = roomMapper.mapTo(updatedRoomEntity);
        return new ResponseEntity<>(updatedRoomDto, HttpStatus.OK);
    }
    @PatchMapping(path = "/{id}")
    public ResponseEntity<RoomDto> roomPartialUpdate(@PathVariable("id") Long id,@RequestBody RoomDto roomDto) {
        RoomEntity existing = roomService.findOne(id)
        .orElseThrow(() -> new RuntimeException("Room not found"));
            modelMapper.map(roomDto, existing);
        List<UserEntity> users = new ArrayList<>();
        if (roomDto.getMembers() != null) {
        for (UserDto u : roomDto.getMembers()) {
            
        if (u != null && u.getUserId() != null) {
                userService.findOne(u.getUserId()).ifPresent(users::add);
    }
        }
        }
        existing.setMembers(users);
        RoomEntity updatedRoom = roomService.save(existing);
        RoomDto updatedRoomDto = roomMapper.mapTo(updatedRoom);
        return new ResponseEntity<>(updatedRoomDto,HttpStatus.OK);
    }
    
    @PatchMapping(path = "/{id}/members")
    public ResponseEntity<RoomDto> addMembers(
        @PathVariable("id") Long id,
        @RequestBody List<UUID> memberIds){
            RoomEntity updated = roomService.addMembersToRoom(id, memberIds);
            return new ResponseEntity<>(roomMapper.mapTo(updated), HttpStatus.OK);
            
        }
    @DeleteMapping(path = "/{id}/members")
    public ResponseEntity<Void> deleteMembers(
    @PathVariable("id")long id,
    @RequestBody List<UUID> userIds){
        roomService.deleteMembers(id, userIds);
        return new ResponseEntity<>(HttpStatus.OK);
    }
    @DeleteMapping(path = "/{id}")
    public ResponseEntity<Void> deleteRoom(@PathVariable("id") long id){
        if(!roomService.isExists(id)){
            return new ResponseEntity<>( HttpStatus.NOT_FOUND);
        }
        roomService.deleteById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
    
}
