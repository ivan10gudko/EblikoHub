package project_z.demo.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import project_z.demo.dto.RoomTitleLinkDtos.RoomTitleLinkCreateDto;
import project_z.demo.dto.RoomTitleLinkDtos.RoomTitleLinkDetailsDto;
import project_z.demo.services.RoomTitleLinkService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/rooms/{roomId}/links")
@RequiredArgsConstructor
public class RoomTitleLinkController {

    private final RoomTitleLinkService linkService;

    @PostMapping
    @PreAuthorize("@securityService.isRoomMember(#roomId)")
    public ResponseEntity<RoomTitleLinkDetailsDto> create(
            @PathVariable Long roomId,
            @RequestBody RoomTitleLinkCreateDto dto) {
        return ResponseEntity.ok(linkService.createLink(dto));
    }

    @GetMapping("/roomTitle/{roomTitleId}")
    @PreAuthorize("@securityService.isRoomMember(#roomId)")
    public ResponseEntity<List<RoomTitleLinkDetailsDto>> findByRoomTitle(
            @PathVariable Long roomId,
            @PathVariable UUID roomTitleId) {
        return ResponseEntity.ok(linkService.findByRoomTitleId(roomTitleId));
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("@securityService.isRoomMember(#roomId)")
    public ResponseEntity<List<RoomTitleLinkDetailsDto>> findUserLinks(
            @PathVariable Long roomId,
            @PathVariable UUID userId) {
        return ResponseEntity.ok(linkService.findUserLinksInRoom(userId, roomId));
    }

    @DeleteMapping("/{roomTitleLinkId}")
    @PreAuthorize("@securityService.isRoomMember(#roomId)") 
    public ResponseEntity<Void> deleteLink(
            @PathVariable Long roomId,
            @PathVariable UUID roomTitleLinkId) {
        linkService.deleteLink(roomTitleLinkId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/room-title/{roomTitleId}/all")
    @PreAuthorize("@securityService.isAdminOrOwner(#roomId)")
    public ResponseEntity<Void> deleteAllByRoomTitle(
            @PathVariable Long roomId,
            @PathVariable UUID roomTitleId) {
        linkService.deleteLinksByRoomTitle(roomTitleId);
        return ResponseEntity.noContent().build();
    }
}