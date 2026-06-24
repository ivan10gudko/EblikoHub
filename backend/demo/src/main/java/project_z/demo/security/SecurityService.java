package project_z.demo.security;

import java.util.UUID;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import project_z.demo.enums.RequestStatus;
import project_z.demo.enums.RoomRole;
import project_z.demo.repositories.FriendshipRepository;
import project_z.demo.repositories.RoomMemberRepository;
import project_z.demo.repositories.RoomRepository;
import project_z.demo.repositories.SeasonRepository;
import project_z.demo.repositories.TitleRepository;

@Service
@RequiredArgsConstructor
public class SecurityService {

    private final TitleRepository titleRepository;
    private final RoomRepository roomRepository;
    private final SeasonRepository seasonRepository;
    private final FriendshipRepository friendshipRepository;
    private final RoomMemberRepository roomMemberRepository;

    private UUID getCurrentUserId() {
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
        return roomMemberRepository.findByRoomRoomIdAndReceiverUserId(roomId, currentUserId)
                .map(member -> member.getRole() == RoomRole.OWNER || member.getRole() == RoomRole.ADMIN)
                .orElse(false);
    }
    
    public boolean isRoomMember(Long roomId) {
        UUID currentUserId = getCurrentUserId();
        return roomMemberRepository.existsByRoomRoomIdAndReceiverUserId(roomId, currentUserId);
    }
}