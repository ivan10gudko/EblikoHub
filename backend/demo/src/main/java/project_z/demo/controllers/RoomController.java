package project_z.demo.controllers;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
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
import org.springframework.web.bind.annotation.RestController;

import project_z.demo.Mappers.Mapper;
import project_z.demo.common.Exceptions.ResourceNotFoundException;
import project_z.demo.common.QueryParameters.RoomQueryParameters;
import project_z.demo.dto.RoomDtos.RoomCreateDto;
import project_z.demo.dto.RoomDtos.RoomDto;
import project_z.demo.dto.RoomDtos.RoomShortDto;
import project_z.demo.dto.UserDtos.UserShortDto;
import project_z.demo.entity.RoomEntity;
import project_z.demo.entity.UserEntity;
import project_z.demo.security.JwtService;
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
    private Mapper<RoomEntity, RoomDto> roomMapper;
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private JwtService jwtService;

    @GetMapping("/{roomId}")
    public ResponseEntity<RoomDto> getRoomById(@PathVariable("roomId") Long roomId) {
        RoomEntity roomEntity = roomService.findOne(roomId).orElseThrow(
                () -> new RuntimeException("there is no room with that id"));
        RoomDto response = roomMapper.mapTo(roomEntity);
        return new ResponseEntity<>(response, HttpStatus.OK);

    }

    @GetMapping("/user/{id}")
    public ResponseEntity<Page<RoomShortDto>> getRoomsByUserId(@PathVariable("id") UUID id,
            RoomQueryParameters roomQueryParameters) {
        Page<RoomShortDto> response = roomService.getRoomsByUserId(id, roomQueryParameters);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }


    @PostMapping
    public ResponseEntity<RoomDto> createRoom(@RequestBody RoomCreateDto roomDto,
            @RequestHeader("Authorization") String token) {
        RoomDto response = roomService.createRoom(token, roomDto);
        return new ResponseEntity<>(response, HttpStatus.CREATED);

    }

    @PreAuthorize("hasRole('ADMIN') || @securityService.isRoomOwner(#id, #token)")
    @PutMapping(path = "/{id}")
    public ResponseEntity<RoomDto> roomFullUpdate(@PathVariable("id") Long id,
            @RequestHeader("Authorization") String token, @RequestBody RoomDto roomDto) {
        RoomEntity roomEntity = roomMapper.mapFrom(roomDto);

        RoomEntity updatedRoomEntity = roomService.save(roomEntity);

        RoomDto updatedRoomDto = roomMapper.mapTo(updatedRoomEntity);

        return new ResponseEntity<>(updatedRoomDto, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN') || @securityService.isRoomOwner(#id, #token)")
    @PatchMapping(path = "/{id}")
    public ResponseEntity<RoomDto> roomPartialUpdate(@PathVariable("id") Long id,
            @RequestHeader("Authorization") String token, @RequestBody RoomDto roomDto) {
        RoomEntity existing = roomService.findOne(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found"));

        modelMapper.map(roomDto, existing);

        List<UserEntity> users = new ArrayList<>();

        if (roomDto.getMembers() != null) {
            for (UserShortDto u : roomDto.getMembers()) {

                if (u != null && u.getUserId() != null) {
                    UserEntity user = userService.findOne(u.getUserId());
                    if (user != null) {
                        users.add(user);
                    }
                }
            }
        }

        existing.setMembers(users);
        RoomEntity updatedRoom = roomService.save(existing);
        RoomDto updatedRoomDto = roomMapper.mapTo(updatedRoom);
        return new ResponseEntity<>(updatedRoomDto, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN') || @securityService.isRoomOwner(#id, #token)")
    @PatchMapping(path = "/{id}/members")
    public ResponseEntity<RoomDto> addMembers(
            @PathVariable("id") Long id,
            @RequestHeader("Authorization") String token,
            @RequestBody List<UUID> memberIds) {
        RoomEntity updated = roomService.addMembersToRoom(id, memberIds);
        return new ResponseEntity<>(roomMapper.mapTo(updated), HttpStatus.OK);

    }

    @PreAuthorize("hasRole('ADMIN') || @securityService.isRoomOwner(#id, #token)")
    @DeleteMapping(path = "/{id}/members")
    public ResponseEntity<Void> deleteMembers(
            @PathVariable("id") long id,
            @RequestHeader("Authorization") String token,
            @RequestBody List<UUID> userIds) {
        roomService.deleteMembers(id, userIds);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN') || @securityService.isRoomOwner(#id, #token)")
    @DeleteMapping(path = "/{id}")
    public ResponseEntity<Void> deleteRoom(@PathVariable("id") long id, @RequestHeader("Authorization") String token) {
        if (!roomService.isExists(id)) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        roomService.deleteById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PostMapping(path = "/{id}/leave")
    public ResponseEntity<Void> leaveRoom(
            @PathVariable("id") Long roomId,
            @RequestHeader("Authorization") String token) {
        UUID userId = jwtService.extractUsername(token);
        roomService.leaveRoom(userId, roomId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
