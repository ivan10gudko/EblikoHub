package project_z.demo.dto.RoomTitleDtos;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import project_z.demo.enums.TitleStatus;
@Setter
@Getter
@AllArgsConstructor
public class RoomTitleUserIdAndTitleStatusDto {
    private UUID userId;
    private TitleStatus status;
}
