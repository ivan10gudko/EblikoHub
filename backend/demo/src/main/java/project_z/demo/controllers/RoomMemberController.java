package project_z.demo.controllers;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import project_z.demo.common.QueryParameters.UserQueryParameters;
import project_z.demo.dto.RoomMemberDtos.RoomMemberDto;
import project_z.demo.dto.RoomMemberDtos.RoomMemberIdDto;
import project_z.demo.dto.RoomMemberDtos.RoomMemberRoleUpdateDto;
import project_z.demo.dto.UserDtos.UserShortDto;
import project_z.demo.dto.UserDtos.UserWithRelationsToRoomDto;
import project_z.demo.security.JwtService;
import project_z.demo.security.SecurityService;
import project_z.demo.services.RoomMemberService;
import project_z.demo.services.UserService;

import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/api/v1/rooms/{roomId}/members")
@RequiredArgsConstructor
public class RoomMemberController {
    private final UserService userService;
    private final SecurityService securityService;
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

    @GetMapping("/users/search")
    public ResponseEntity<Page<UserWithRelationsToRoomDto>> findUsersInRoom(
            @PathVariable("roomId") Long roomId,
            @RequestParam("name") String name,
            UserQueryParameters queryParameters) {

        Page<UserWithRelationsToRoomDto> users = userService.searchUsersForRoom(name, roomId, queryParameters);

        return ResponseEntity.ok(users);
    }
    
    @PatchMapping
    @PreAuthorize("@securityService.isRoomOwner(#roomId)")
    public ResponseEntity<RoomMemberDto> updateMemberRole(
        @PathVariable("roomId") Long roomId,
        @RequestBody RoomMemberRoleUpdateDto dto){
        UUID userId = securityService.getCurrentUserId();
        return new ResponseEntity<>(roomMemberService.updateMemberRole(userId, roomId, dto), HttpStatus.OK);
    }

    @DeleteMapping("/leave")
    public ResponseEntity<Void> leaveRoom(
            @RequestHeader("Authorization") String token,
            @PathVariable("roomId") Long roomId) {

        UUID userId = jwtService.extractUsername(token);
        roomMemberService.leaveRoom(roomId, userId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PostMapping("/leaveAsAnOwner")
    @PreAuthorize("@securityService.isRoomOwner(#roomId)")
    public ResponseEntity<RoomMemberDto> leaveAsAnOwner(
        @RequestHeader ("Authorization") UUID userId,
        @PathVariable("roomId") Long roomId,
        @RequestBody RoomMemberIdDto dto){

            return new ResponseEntity<>(roomMemberService.leaveOwner(roomId,dto,userId),HttpStatus.OK);
        }
    
}