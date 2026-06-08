package project_z.demo.controllers;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import project_z.demo.Mappers.Mapper;
import project_z.demo.common.QueryParameters.RoomQueryParameters;
import project_z.demo.dto.RoomDtos.RoomCreateDto;
import project_z.demo.dto.RoomDtos.RoomDto;
import project_z.demo.dto.RoomDtos.RoomShortDto;
import project_z.demo.entity.RoomEntity;
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
    private JwtService jwtService;

    @GetMapping("/{roomId}")
    public ResponseEntity<RoomDto> getRoomById(@PathVariable("roomId") Long roomId) {
        return new ResponseEntity<>( roomService.findOne(roomId) , HttpStatus.OK);
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

    @PreAuthorize("hasRole('ADMIN') || @securityService.isRoomOwner(#roomId, #token)")
    @PostMapping(path = "/{roomId}/pinRoom")
    public ResponseEntity<RoomDto> pinRoom(
            @PathVariable("roomId") Long roomId,
            @RequestHeader("Authorization") String token
    ) {

        UUID userId = jwtService.extractUsername(token);


        RoomDto updatedRoom = roomService.pinRoom(roomId, userId);
        return new ResponseEntity<>(updatedRoom, HttpStatus.OK);
    }
    
    @PostMapping(path = "/unpin")
    public ResponseEntity<Void> unpin(@RequestHeader("Authorization") String token) {
        
        UUID userId = jwtService.extractUsername(token);
        roomService.unpin(userId);

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

}
