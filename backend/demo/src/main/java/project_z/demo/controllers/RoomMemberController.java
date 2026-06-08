package project_z.demo.controllers;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import project_z.demo.dto.RoomMemberDtos.RoomMemberDto;
import project_z.demo.dto.UserDtos.UserShortDto;
import project_z.demo.entity.RoomMemberEntity;
import project_z.demo.enums.RequestStatus;
import project_z.demo.enums.RequestType;
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

    @GetMapping("/requests")
    public ResponseEntity<List<RoomMemberDto>> getRequests(
            @PathVariable Long roomId,
            @RequestParam RequestStatus status,
            @RequestParam RequestType type) {
        return ResponseEntity.ok(roomMemberService.getRequests(roomId, status, type));
    }

    @PostMapping("/join")
    public ResponseEntity<Void> joinRoom(
            @RequestHeader("Authorization") String token,
            @PathVariable("roomId") Long roomId) {

        UUID userId = jwtService.extractUsername(token);
        roomMemberService.sendRequest(userId, userId, roomId, RequestType.JOIN_REQUEST);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @PreAuthorize("@securityService.isRoomOwner(#roomId, #token)")
    @PostMapping("/invite/{receiverId}")
    public ResponseEntity<Void> inviteUser(
            @RequestHeader("Authorization") String token,
            @PathVariable("roomId") Long roomId,
            @PathVariable("receiverId") UUID receiverId) {

        UUID senderId = jwtService.extractUsername(token);
        roomMemberService.sendRequest(senderId, receiverId, roomId, RequestType.INVITE);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @PreAuthorize("@securityService.isRoomOwner(#roomId, #token) || @securityService.isRoomMember(#roomId, #token)")
    @PutMapping("/accept/{receiverId}")
    public ResponseEntity<Void> acceptRequest(
            @RequestHeader("Authorization") String token,
            @PathVariable("roomId") Long roomId,
            @PathVariable("receiverId") UUID receiverId) {

        roomMemberService.acceptRequest(roomId, receiverId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping("/reject/{receiverId}")
    public ResponseEntity<Void> rejectRequest(
            @RequestHeader("Authorization") String token,
            @PathVariable("roomId") Long roomId,
            @PathVariable("receiverId") UUID receiverId) {

        roomMemberService.rejectRequest(roomId, receiverId);
        return new ResponseEntity<>(HttpStatus.OK);
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