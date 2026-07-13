package project_z.demo.dto.UserDtos;

import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonProperty;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDtoWithRoomBanStatus {
    private UUID userId;
    private String name;
    private String nameTag;
    private String img;
    @JsonProperty("isBanned")
    private boolean isBanned;
    private UUID roomBanId;
}
