package project_z.demo.controllers;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import project_z.demo.Mappers.Mapper;
import project_z.demo.dto.FriendshipDtos.FriendRequestDto;
import project_z.demo.dto.FriendshipDtos.FriendshipCountsDto;
import project_z.demo.dto.FriendshipDtos.FriendshipDetailsDto;
import project_z.demo.dto.FriendshipDtos.FriendshipPartialUpdateDto;
import project_z.demo.dto.UserDtos.UserDto;
import project_z.demo.entity.UserEntity;
import project_z.demo.services.FriendshipService;
@RestController
@RequestMapping("/api/v1/friendships")
@RequiredArgsConstructor
public class FriendshipController {

    private final FriendshipService friendshipService;
    private final Mapper<UserEntity, UserDto> userMapper;

    @PostMapping("/request/{receiverId}")
    public ResponseEntity<Void> sendFriendRequest(@PathVariable("receiverId") UUID receiverId) {
        UUID senderId = SecurityContextHolder.getContext().getAuthentication() != null 
                        ? UUID.fromString(SecurityContextHolder.getContext().getAuthentication().getName()) 
                        : null;
        
        friendshipService.sendFriendRequest(senderId, receiverId);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @PreAuthorize("hasRole('ADMIN') || @securityService.canAcceptFriendRequest(#senderId)")
    @PutMapping("/accept/{senderId}")
    public ResponseEntity<Void> acceptFriendRequest(@PathVariable("senderId") UUID senderId) {
        UUID receiverId = UUID.fromString(SecurityContextHolder.getContext().getAuthentication().getName());
        friendshipService.acceptFriendRequest(receiverId, senderId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN') || @securityService.canAcceptFriendRequest(#senderId)")
    @PutMapping("/reject/{senderId}")
    public ResponseEntity<Void> rejectFriendRequest(@PathVariable("senderId") UUID senderId) {
        UUID receiverId = UUID.fromString(SecurityContextHolder.getContext().getAuthentication().getName());
        friendshipService.rejectFriendRequest(receiverId, senderId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<UserDto>> getFriendsByUserId(@PathVariable("userId") UUID userId) {
        List<UserEntity> friends = friendshipService.findFriendsByUserId(userId);
        List<UserDto> response = friends.stream()
                .map(userMapper::mapTo)
                .collect(Collectors.toList());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<FriendshipDetailsDto> getFriendshipById(@PathVariable("id") UUID id) {
        return ResponseEntity.ok(friendshipService.findOne(id));
    }

    @GetMapping("/{userId}/receivedPending")
    public List<FriendRequestDto> getReceivedPendingRequestsByUserId(@PathVariable("userId") UUID userId) {
        return friendshipService.findPendingFriendRequestsByUserId(userId);
    }

    @GetMapping("/{userId}/sentPending")
    public List<FriendRequestDto> getSentPendingRequestsByUserId(@PathVariable("userId") UUID userId) {
        return friendshipService.findSentFriendRequestsByUserId(userId);
    }

    @GetMapping("/{userId}/stats")
    public ResponseEntity<FriendshipCountsDto> getUserFriendshipStats(@PathVariable("userId") UUID userId) {
        return ResponseEntity.ok(friendshipService.getUserFriendshipStats(userId));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{id}")
    public ResponseEntity<FriendshipDetailsDto> partialUpdate(
            @PathVariable("id") UUID id,
            @RequestBody FriendshipPartialUpdateDto updateDto) {
        return ResponseEntity.ok(friendshipService.partialUpdate(id, updateDto));
    }

    @PreAuthorize("hasRole('ADMIN') || @securityService.isFriendshipMember(#id)")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFriendshipById(@PathVariable("id") UUID id) {
        friendshipService.deleteFriendById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}