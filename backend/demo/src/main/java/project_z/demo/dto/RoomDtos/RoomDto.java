package project_z.demo.dto.RoomDtos;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import project_z.demo.dto.UserDtos.UserDto;
import project_z.demo.dto.UserDtos.UserShortDto;


@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class RoomDto {
    private Long roomId;
    private String roomName;
    private UUID owner;
    private List<UserShortDto> members;
    private String imageUrl;
    private boolean isPinned;
    private LocalDateTime createdAt;
    
}