package project_z.demo.security;

import java.util.UUID;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import project_z.demo.enums.RequestStatus;
import project_z.demo.enums.RequestType;
import project_z.demo.enums.RoomRole;
import project_z.demo.repositories.FriendshipRepository;
import project_z.demo.repositories.RoomMemberRepository;
import project_z.demo.repositories.RoomRepository;
import project_z.demo.repositories.RoomRequestRepository;
import project_z.demo.repositories.SeasonRepository;
import project_z.demo.repositories.TitleRepository;

@Service
@RequiredArgsConstructor
public class SecurityService {

    private final RoomRequestRepository roomRequestRepository;
    private final TitleRepository titleRepository;
    private final RoomRepository roomRepository;
    private final SeasonRepository seasonRepository;
    private final FriendshipRepository friendshipRepository;
    private final RoomMemberRepository roomMemberRepository;

    public UUID getCurrentUserId() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            throw new RuntimeException("User not authenticated");
        }
        return UUID.fromString(auth.getName());
    }

    public boolean isTitleOwner(Long titleId) {
        UUID currentUserId = getCurrentUserId();
        return titleRepository.findById(titleId)
                .map(title -> title.getUser().getUserId().equals(currentUserId))
                .orElse(false);
    }

    public boolean isRoomOwner(Long roomId) {
        UUID currentUserId = getCurrentUserId();
        return roomRepository.findById(roomId)
                .map(room -> room.getOwner().getUserId().equals(currentUserId))
                .orElse(false);
    }

    public boolean isFriendshipMember(UUID friendshipId) {
        UUID currentUserId = getCurrentUserId();
        return friendshipRepository.isUserMemberOfFriendship(friendshipId, currentUserId);
    }

    public boolean canAcceptFriendRequest(UUID senderId) {
        UUID currentUserId = getCurrentUserId();
        return friendshipRepository.existsBySenderUserIdAndReceiverUserIdAndStatus(
                senderId, currentUserId, RequestStatus.PENDING);
    }

    public boolean isSeasonOwner(Long seasonId) {
        UUID currentUserId = getCurrentUserId();
        return seasonRepository.findById(seasonId)
                .map(season -> season.getTitle().getUser().getUserId().equals(currentUserId))
                .orElse(false);
    }

    public boolean isUserOwner(UUID userId) {
        return userId.equals(getCurrentUserId());
    }

    public boolean hasRole(UUID userId, String role) {
        return false;
    }

    public boolean isAdminOrOwner(Long roomId) {
        UUID currentUserId = getCurrentUserId();
        return roomMemberRepository.findOneByRoom_RoomIdAndUser_UserId(roomId, currentUserId)
                .map(member -> member.getRole() == RoomRole.OWNER || member.getRole() == RoomRole.ADMIN)
                .orElse(false);
    }

    public boolean isRoomMember(Long roomId) {
        UUID currentUserId = getCurrentUserId();
        return roomMemberRepository.existsByRoom_RoomIdAndUser_UserId(roomId, currentUserId);
    }

    public boolean isRoomRequestMember(UUID roomRequestId) {
        UUID currentUserId = getCurrentUserId();
        return roomRequestRepository.findById(roomRequestId)
                .map(member -> member.getUser().getUserId().equals(currentUserId) ||
                        member.getSender().getUserId().equals(currentUserId))
                .orElse(false);
    }

   

    public boolean canProcessRequest(UUID roomRequestId) {
        UUID currentUserId = getCurrentUserId();

        return roomRequestRepository.findById(roomRequestId)
                .map(request -> {
                    if (request.getType() == RequestType.JOIN_REQUEST) {
                        return isAdminOrOwner(request.getRoom().getRoomId());
                    }
                    if (request.getType() == RequestType.INVITE) {
                        return request.getUser().getUserId().equals(currentUserId);
                    }
                    return false;
                })
                .orElse(false);
    }

    public boolean canCancel(UUID roomRequestId) {
        UUID currentUserId = getCurrentUserId();

        return roomRequestRepository.findById(roomRequestId)
                .map(request -> {
                    boolean isSender = request.getSender().getUserId().equals(currentUserId);
                    boolean isRoomAdmin = isAdminOrOwner(request.getRoom().getRoomId());

                    return isSender || isRoomAdmin;
                })
                .orElse(false);
    }
}