package project_z.demo.dto.RoomDtos;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import project_z.demo.dto.UserDtos.UserDto;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
public class RoomDto {
    private Long roomId;
    private String roomName;
    private UserDto owner;
    private List<UserDto> members;
    private LocalDateTime createdAt;
}