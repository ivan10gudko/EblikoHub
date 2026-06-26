package project_z.demo.controllers;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import project_z.demo.dto.RoomRequestsDtos.RoomRequestDetailsDto;
import project_z.demo.enums.RequestStatus;
import project_z.demo.enums.RequestType;
import project_z.demo.security.SecurityService;
import project_z.demo.services.RoomRequestService;

@RestController
@RequestMapping("/api/v1/rooms")
@RequiredArgsConstructor
public class RoomRequestController {
    private final RoomRequestService roomRequestService;
    private final SecurityService securityService;

    @GetMapping("/requests")
    public ResponseEntity<List<RoomRequestDetailsDto>> getRequests(
            @RequestParam("status") RequestStatus status,
            @RequestParam("type") RequestType type) {
        UUID userId = securityService.getCurrentUserId();
        return ResponseEntity.ok(roomRequestService.getRequestsByUserId(userId, status, type));
    }

    @PostMapping("/join")
    public ResponseEntity<Void> joinRoom(
            @RequestHeader("Authorization") String token,
            @PathVariable("roomId") Long roomId) {

        UUID userId = securityService.getCurrentUserId();
        roomRequestService.sendRequest(userId, userId, roomId, RequestType.JOIN_REQUEST);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @PreAuthorize("@securityService.isRoomOwner(#roomId)")
    @PostMapping("/invite/{receiverId}")
    public ResponseEntity<Void> inviteUser(
            @RequestHeader("Authorization") String token,
            @PathVariable("roomId") Long roomId,
            @PathVariable("receiverId") UUID receiverId) {

        UUID senderId = securityService.getCurrentUserId();
        roomRequestService.sendRequest(senderId, receiverId, roomId, RequestType.INVITE);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @PreAuthorize("@securityService.isRoomOwner(#roomId) || @securityService.isRoomMember(#roomId)")
    @PutMapping("/accept/{receiverId}")
    public ResponseEntity<Void> acceptRequest(
            @PathVariable("roomId") Long roomId,
            @PathVariable("receiverId") UUID receiverId) {

        roomRequestService.acceptRequest(roomId, receiverId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping("/reject/{receiverId}")
    public ResponseEntity<Void> rejectRequest(
            @RequestHeader("Authorization") String token,
            @PathVariable("roomId") Long roomId,
            @PathVariable("receiverId") UUID receiverId) {

        roomRequestService.rejectRequest(roomId, receiverId);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
