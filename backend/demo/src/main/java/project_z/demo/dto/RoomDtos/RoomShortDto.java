package project_z.demo.dto.RoomDtos;

import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonAutoDetect(fieldVisibility = JsonAutoDetect.Visibility.ANY, getterVisibility = JsonAutoDetect.Visibility.NONE, isGetterVisibility = JsonAutoDetect.Visibility.NONE)
public class RoomShortDto {
    private Long roomId;
    private String roomName;
    private UUID ownerId;
    @JsonProperty("isPinned")
    private boolean isPinned;
    private String imageUrl;
    private long usersCount;
}
