package project_z.demo.controllers;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import project_z.demo.dto.RoomRequestsDtos.RoomRequestDetailsDto;
import project_z.demo.enums.RequestStatus;
import project_z.demo.enums.RequestType;
import project_z.demo.services.RoomRequestService;

@RestController
@RequestMapping("/api/v1/users/{userId}/room-requests")
@RequiredArgsConstructor
public class UserRoomInteractionController {

    private final RoomRequestService roomRequestService;

    @GetMapping
    public ResponseEntity<List<RoomRequestDetailsDto>> getMyRequests(
            @PathVariable UUID userId,
            @RequestParam RequestStatus status,
            @RequestParam RequestType type) {

        List<RoomRequestDetailsDto> requests = roomRequestService.getRequestsByUserId(userId, status, type);
        return ResponseEntity.ok(requests);
    }
}