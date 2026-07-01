package project_z.demo.controllers;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import project_z.demo.common.QueryParameters.RoomTitlesQueryParameters;
import project_z.demo.dto.RoomTitleDtos.RoomTitleCreateDto;
import project_z.demo.dto.RoomTitleDtos.RoomTitleDetailsDto;
import project_z.demo.dto.RoomTitleDtos.RoomTitleSummaryDto;
import project_z.demo.dto.RoomTitleDtos.RoomTitleUpdateDto;
import project_z.demo.dto.RoomTitleDtos.RoomTitlesResponseDto;
import project_z.demo.security.SecurityService;
import project_z.demo.services.RoomTitleService;

import java.util.List;
import java.util.UUID;


@RestController
@RequestMapping("/api/v1/rooms/{roomId}/titles")
@RequiredArgsConstructor
public class RoomTitleController {

    private final RoomTitleService roomTitleService;
    private final SecurityService securityService;

    @PostMapping
    @PreAuthorize("@securityService.isAdminOrOwner(#roomId)")
    public ResponseEntity<RoomTitleDetailsDto> create(
            @PathVariable Long roomId,
            @RequestBody RoomTitleCreateDto dto) {
        return ResponseEntity.ok(roomTitleService.create(dto,roomId));
    }
    
    @GetMapping("/getRoomTitles")
    public ResponseEntity<RoomTitlesResponseDto> getMethodName(@PathVariable("roomId") Long roomId, RoomTitlesQueryParameters roomTitlesQueryParameters) {
        UUID userId = securityService.getCurrentUserId();
        return  new ResponseEntity<>(roomTitleService.getRoomTitles(roomId, userId, roomTitlesQueryParameters), HttpStatus.OK);
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