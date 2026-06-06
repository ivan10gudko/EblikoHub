package project_z.demo.dto.RoomDtos;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoomShortDto {
    private Long roomId;
    private String roomName;
    private UUID ownerId;
    private long usersCount;
}
