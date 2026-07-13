package project_z.demo.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import project_z.demo.common.QueryParameters.UserQueryParameters;
import project_z.demo.dto.RoomBanDtos.RoomBanCreateDto;
import project_z.demo.dto.RoomBanDtos.RoomBanDetailsDto;
import project_z.demo.dto.UserDtos.UserDtoWithRoomBanStatus;
import project_z.demo.security.SecurityService;
import project_z.demo.services.RoomBanService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/rooms/{roomId}/bans")
@RequiredArgsConstructor
public class RoomBanController {

    private final RoomBanService roomBanService;
    private final SecurityService securityService;

    @GetMapping
    @PreAuthorize("@securityService.isAdminOrOwner(#roomId)")
    public ResponseEntity<List<RoomBanDetailsDto>> findAllByRoom(@PathVariable Long roomId) {
        return ResponseEntity.ok(roomBanService.findAllByRoom(roomId));
    }

    @PostMapping
    @PreAuthorize("@securityService.isAdminOrOwner(#roomId)")
    public ResponseEntity<RoomBanDetailsDto> create(
            @PathVariable Long roomId,
            @RequestBody RoomBanCreateDto banDto) {
        return new ResponseEntity<>(roomBanService.create(banDto, roomId), HttpStatus.CREATED);
    }

    @GetMapping("/check/{userId}")
    @PreAuthorize("@securityService.isAdminOrOwner(#roomId) || @securityService.isUserOwner(#userId)")
    public ResponseEntity<Boolean> isBanned(
            @PathVariable Long roomId,
            @PathVariable UUID userId) {
        return ResponseEntity.ok(roomBanService.isBanned(roomId, userId));
    }

    @DeleteMapping("/{roomBanId}")
    @PreAuthorize("@securityService.isAdminOrOwner(#roomId)")
    public ResponseEntity<Void> unban(@PathVariable("roomBanId") UUID roomBanId){
        roomBanService.unban(roomBanId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/search")
    @PreAuthorize("@securityService.isAdminOrOwner(#roomId)")
    public ResponseEntity<Page<UserDtoWithRoomBanStatus>> searchUsers(
            @PathVariable("roomId") Long roomId,
            UserQueryParameters queryParameters) {

        UUID currentUserId = securityService.getCurrentUserId();

        Page<UserDtoWithRoomBanStatus> response = roomBanService.searchUsers(
                roomId, currentUserId, queryParameters);

        return ResponseEntity.ok(response);
    }
    
}