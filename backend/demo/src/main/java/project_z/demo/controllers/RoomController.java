package project_z.demo.controllers;

import java.util.UUID;

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

import lombok.RequiredArgsConstructor;
import project_z.demo.common.QueryParameters.RoomQueryParameters;
import project_z.demo.dto.RoomDtos.RoomCreateDto;
import project_z.demo.dto.RoomDtos.RoomDto;
import project_z.demo.dto.RoomDtos.RoomShortDto;
import project_z.demo.security.JwtService;
import project_z.demo.services.RoomMemberService;
import project_z.demo.services.RoomService;

@RestController
@RequestMapping("/api/v1/rooms")
@RequiredArgsConstructor
public class RoomController {

    private final RoomMemberService roomMemberService;
    private final RoomService roomService;
    private final JwtService jwtService;

    @GetMapping("/{roomId}")
    public ResponseEntity<RoomDto> getRoomById(@PathVariable("roomId") Long roomId) {
        return new ResponseEntity<>(roomService.findOne(roomId), HttpStatus.OK);
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

    @PostMapping("/{roomId}/pin")
    public ResponseEntity<Void> pinRoom(
            @PathVariable Long roomId,
            @RequestHeader("Authorization") String token) {
        UUID userId = jwtService.extractUsername(token);
        roomMemberService.pinRoom(roomId, userId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/unpin")
    public ResponseEntity<Void> unpinAll(@RequestHeader("Authorization") String token) {
        UUID userId = jwtService.extractUsername(token);
        roomMemberService.unpinAll(userId);
        return ResponseEntity.ok().build();
    }

    @PreAuthorize("hasRole('ADMIN') || @securityService.isRoomOwner(#id)")
    @DeleteMapping(path = "/{id}")
    public ResponseEntity<Void> deleteRoom(@PathVariable("id") long id) {
        if (!roomService.isExists(id)) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        roomService.deleteById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}