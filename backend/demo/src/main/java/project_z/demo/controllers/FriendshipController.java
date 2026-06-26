package project_z.demo.controllers;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import project_z.demo.JavaUtil.PagingHelper;
import project_z.demo.Mappers.Mapper;
import project_z.demo.common.QueryParameters.FriendshipQueryParameters;
import project_z.demo.common.QueryParameters.UserQueryParameters;
import project_z.demo.dto.FriendshipDtos.FriendRequestDto;
import project_z.demo.dto.FriendshipDtos.FriendshipCountsDto;
import project_z.demo.dto.FriendshipDtos.FriendshipDetailsDto;
import project_z.demo.dto.FriendshipDtos.FriendshipPartialUpdateDto;
import project_z.demo.dto.UserDtos.UserDto;
import project_z.demo.dto.UserDtos.UserDtoWithFriendshipStatus;
import project_z.demo.entity.FriendshipEntity;
import project_z.demo.entity.UserEntity;
import project_z.demo.security.JwtService;
import project_z.demo.services.FriendshipService;

@RestController
@RequestMapping("/api/v1/friendships")
public class FriendshipController {

    @Autowired
    private FriendshipService friendshipService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private Mapper<FriendshipEntity, FriendshipDetailsDto> friendshipMapper;

    @Autowired
    private Mapper<UserEntity, UserDto> userMapper;

    @PostMapping("/request/{receiverId}")
    public ResponseEntity<Void> sendFriendRequest(
            @RequestHeader("Authorization") String token,
            @PathVariable("receiverId") UUID receiverId) {

        UUID senderId = jwtService.extractUsername(token);
        friendshipService.sendFriendRequest(senderId, receiverId);

        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @PreAuthorize("hasRole('ADMIN') || @securityService.canAcceptFriendRequest(#token, #senderId)")
    @PutMapping("/accept/{senderId}")
    public ResponseEntity<Void> acceptFriendRequest(
            @RequestHeader("Authorization") String token,
            @PathVariable("senderId") UUID senderId) {

        UUID receiverId = jwtService.extractUsername(token);
        friendshipService.acceptFriendRequest(receiverId, senderId);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN') || @securityService.canAcceptFriendRequest(#token, #senderId)")
    @PutMapping("/reject/{senderId}")
    public ResponseEntity<Void> rejectFriendRequest(
            @RequestHeader("Authorization") String token,
            @PathVariable("senderId") UUID senderId) {

        UUID receiverId = jwtService.extractUsername(token);
        friendshipService.rejectFriendRequest(receiverId, senderId);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/search/{name}")
    public ResponseEntity<Page<UserDtoWithFriendshipStatus>> searchUsers(
            @RequestHeader(value = "Authorization", required = false) String token,
            @PathVariable("name") String name,
            FriendshipQueryParameters friendshipQueryParameters) {

        UUID currentUserId = (token != null) ? jwtService.extractUsername(token) : null;

        Page<UserDtoWithFriendshipStatus> response = friendshipService.searchUsers(name, currentUserId,
                friendshipQueryParameters);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<FriendRequestDto>> getFriendsByUserId(@PathVariable("userId") UUID userId) {
        List<FriendRequestDto> res = friendshipService.findFriendsByUserId(userId);
        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<FriendshipDetailsDto> getFriendshipById(@PathVariable("id") UUID id) {
        FriendshipDetailsDto dto = friendshipService.findOne(id);
        return new ResponseEntity<>(dto, HttpStatus.OK);
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
        FriendshipCountsDto stats = friendshipService.getUserFriendshipStats(userId);
        return new ResponseEntity<>(stats, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{id}")
    public ResponseEntity<FriendshipDetailsDto> partialUpdate(
            @PathVariable("id") UUID id,
            @RequestBody FriendshipPartialUpdateDto updateDto) {

        FriendshipDetailsDto updated = friendshipService.partialUpdate(id, updateDto);
        return new ResponseEntity<>(updated, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN') || @securityService.isFriendshipMember(#token, #id)")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFriendshipById(
            @PathVariable("id") UUID id,
            @RequestHeader("Authorization") String token) {

        friendshipService.deleteFriendById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}