package project_z.demo.controllers;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import project_z.demo.dto.RoomMemberDtos.RoomMemberDto;
import project_z.demo.dto.UserDtos.UserShortDto;
import project_z.demo.security.JwtService;
import project_z.demo.services.RoomMemberService;

@RestController
@RequestMapping("/api/v1/rooms/{roomId}/members")
public class RoomMemberController {

    @Autowired
    private RoomMemberService roomMemberService;

    @Autowired
    private JwtService jwtService;

    @GetMapping
    public ResponseEntity<List<UserShortDto>> getRoomMembers(@PathVariable Long roomId) {
        return ResponseEntity.ok(roomMemberService.getAcceptedMembers(roomId));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<RoomMemberDto> getRoomMemberByRoomAndUserId(@PathVariable("userId") UUID userId,
            @PathVariable("roomId") Long roomId) {
        return new ResponseEntity<>(roomMemberService.getRooMemberByRoomIdAndUserId(roomId, userId), HttpStatus.OK);
    }

    @DeleteMapping("/leave")
    public ResponseEntity<Void> leaveRoom(
            @RequestHeader("Authorization") String token,
            @PathVariable("roomId") Long roomId) {

        UUID userId = jwtService.extractUsername(token);
        roomMemberService.leaveRoom(roomId, userId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}