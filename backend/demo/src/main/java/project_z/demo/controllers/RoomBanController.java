package project_z.demo.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import project_z.demo.dto.RoomBanDtos.RoomBanCreateDto;
import project_z.demo.dto.RoomBanDtos.RoomBanDetailsDto;
import project_z.demo.services.RoomBanService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/rooms/{roomId}/bans")
@RequiredArgsConstructor
public class RoomBanController {

    private final RoomBanService roomBanService;

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
}