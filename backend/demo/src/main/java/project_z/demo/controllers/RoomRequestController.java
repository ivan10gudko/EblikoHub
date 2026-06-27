package project_z.demo.controllers;

import java.util.List;
import java.util.UUID;

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

import lombok.RequiredArgsConstructor;
import project_z.demo.dto.RoomRequestsDtos.RoomRequestCountsDto;
import project_z.demo.dto.RoomRequestsDtos.RoomRequestDetailsDto;
import project_z.demo.dto.RoomRequestsDtos.RoomRequestShortDto;
import project_z.demo.enums.RequestStatus;
import project_z.demo.enums.RequestType;
import project_z.demo.security.SecurityService;
import project_z.demo.services.RoomRequestService;

@RestController
@RequestMapping("/api/v1/rooms/requests")
@RequiredArgsConstructor
public class RoomRequestController {
    private final RoomRequestService roomRequestService;
    private final SecurityService securityService;

    @GetMapping
    public ResponseEntity<List<RoomRequestShortDto>> getRequests(
            @RequestParam("status") RequestStatus status,
            @RequestParam("type") RequestType type) {
        UUID userId = securityService.getCurrentUserId();
        return ResponseEntity.ok(roomRequestService.getRequestsByUserId(userId, status, type));
    }

    @GetMapping("/requestCounts/user/{userId}")
    public ResponseEntity<RoomRequestCountsDto> getRequestCountsByUserId(@PathVariable("userId") UUID userId) {
        return new ResponseEntity<>(roomRequestService.getRequestCounts(userId), HttpStatus.OK);
    }

    @PostMapping("/join/{roomId}")
    public ResponseEntity<Void> joinRoom(
            @RequestHeader("Authorization") String token,
            @PathVariable("roomId") Long roomId) {

        UUID userId = securityService.getCurrentUserId();
        roomRequestService.sendRequest(userId, userId, roomId, RequestType.JOIN_REQUEST);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @PreAuthorize("@securityService.isAdminOrOwner(#roomId)")
    @PostMapping("/invite")
    public ResponseEntity<Void> inviteUser(
            @RequestHeader("Authorization") String token,
            @RequestParam("roomId") Long roomId,
            @RequestParam("receiverId") UUID receiverId) {

        UUID senderId = securityService.getCurrentUserId();
        roomRequestService.sendRequest(senderId, receiverId, roomId, RequestType.INVITE);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @PreAuthorize("@securityService.canProcessRequest(#roomRequestId)")
    @PutMapping("/accept/{roomRequestId}")
    public ResponseEntity<Void> acceptRequest(
            @PathVariable("roomRequestId") UUID roomRequestId) {

        roomRequestService.acceptRequest(roomRequestId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PreAuthorize("@securityService.canProcessRequest(#roomRequestId)")
    @PutMapping("/reject/{roomRequestId}")
    public ResponseEntity<Void> rejectRequest(
            @PathVariable("roomRequestId") UUID roomRequestId) {

        roomRequestService.rejectRequest(roomRequestId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PreAuthorize("@securityService.canCancel(#roomRequestId)")
    @DeleteMapping("/cancelRequest/{roomRequestId}")
    public ResponseEntity<Void> cancelRequest(
            @PathVariable("roomRequestId") UUID roomRequestId) {

        roomRequestService.cancelRequest(roomRequestId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

}
