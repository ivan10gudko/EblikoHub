package project_z.demo.dto.RoomTitleLinkDtos;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import project_z.demo.dto.TitleDtos.TitleShortDto;
import project_z.demo.dto.TitleDtos.TitleVisualDto;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RoomTitleLinkShortDto {
     private UUID id;

    private TitleVisualDto title;

    private UUID roomTitleId;
    
    private LocalDateTime createdAt;
}
