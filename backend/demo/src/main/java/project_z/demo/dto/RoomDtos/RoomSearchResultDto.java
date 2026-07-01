package project_z.demo.dto.RoomDtos;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RoomSearchResultDto {
    private Long roomId;
    private String roomName;
    private String imageUrl;
    private Integer memberCount;
    private Boolean isMember;
    private Boolean isRequested;

}
