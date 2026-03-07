package project_z.demo.dto.RoomDtos;
import java.util.List;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
public class RoomCreateDto {
    private String roomName;
    private List<UUID> members;
}