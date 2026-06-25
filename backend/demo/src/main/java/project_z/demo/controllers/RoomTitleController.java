package project_z.demo.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import project_z.demo.dto.RoomTitleDtos.RoomTitleCreateDto;
import project_z.demo.dto.RoomTitleDtos.RoomTitleDetailsDto;
import project_z.demo.dto.RoomTitleDtos.RoomTitleUpdateDto;
import project_z.demo.services.RoomTitleService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/rooms/{roomId}/titles")
@RequiredArgsConstructor
public class RoomTitleController {

    private final RoomTitleService roomTitleService;

    @PostMapping
    @PreAuthorize("@securityService.isAdminOrOwner(#roomId)")
    public ResponseEntity<RoomTitleDetailsDto> create(
            @PathVariable Long roomId,
            @RequestBody RoomTitleCreateDto dto) {
        return ResponseEntity.ok(roomTitleService.create(dto));
    }

    @GetMapping
    @PreAuthorize("@securityService.isRoomMember(#roomId)")
    public ResponseEntity<List<RoomTitleDetailsDto>> findAll(
            @PathVariable Long roomId) {
        return ResponseEntity.ok(roomTitleService.findAllByRoom(roomId));
    }

    @PutMapping("/{titleId}")
    @PreAuthorize("@securityService.isAdminOrOwner(#roomId)")
    public ResponseEntity<RoomTitleDetailsDto> update(
            @PathVariable Long roomId,
            @PathVariable UUID titleId,
            @RequestBody RoomTitleUpdateDto dto) {
        return ResponseEntity.ok(roomTitleService.update(titleId, dto));
    }

    @DeleteMapping("/{titleId}")
    @PreAuthorize("@securityService.isAdminOrOwner(#roomId)")
    public ResponseEntity<Void> delete(
            @PathVariable Long roomId,
            @PathVariable UUID titleId) {
        roomTitleService.delete(titleId);
        return ResponseEntity.noContent().build();
    }
}