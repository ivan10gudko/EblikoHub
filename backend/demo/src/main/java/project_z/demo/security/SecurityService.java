package project_z.demo.security;

import java.util.UUID;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import project_z.demo.repositories.RoomRepository;
import project_z.demo.repositories.SeasonRepository;
import project_z.demo.repositories.TitleRepository;

@Service
@RequiredArgsConstructor
public class SecurityService {

    private final TitleRepository titleRepository;
    private final RoomRepository roomRepository;
    private final SeasonRepository seasonRepository;
    private final JwtService jwtService;

    public boolean isTitleOwner(Long titleId, String token) {
        String currentUserId = jwtService.extractUsername(token).toString();

        return titleRepository.findById(titleId)
                .map(title -> title.getUser().getUserId().toString().equals(currentUserId))
                .orElse(false);
    }
    public boolean isRoomOwner(Long roomId, String token) {
        String currentUserId = jwtService.extractUsername(token).toString();

        return roomRepository.findById(roomId)
                .map(room ->room.getOwner().getUserId().toString().equals(currentUserId))
                .orElse(false);
    }
    public boolean isSeasonOwner(Long seasonId, String token){
        String currentUserId = jwtService.extractUsername(token).toString();

        return seasonRepository.findById(seasonId)
                .map(season -> season.getTitle().getUser().getUserId().toString().equals(currentUserId))
                .orElse(false);
    }
    public boolean isUserOwner(UUID userId, String token) {
        String currentUserId = jwtService.extractUsername(token).toString();
        return userId.toString().equals(currentUserId);
    }
    public boolean hasRole(UUID userId, String role) {
        String userRole = jwtService.extractRole(userId);
        return userRole != null && userRole.equalsIgnoreCase(role);
    }
}