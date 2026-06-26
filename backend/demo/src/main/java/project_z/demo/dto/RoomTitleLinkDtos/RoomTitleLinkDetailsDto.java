package project_z.demo.dto.RoomTitleLinkDtos;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.Data;
import project_z.demo.dto.RoomTitleDtos.RoomTitleShortDto;
import project_z.demo.dto.TitleDtos.TitleDto;
@Data
public class RoomTitleLinkDetailsDto {

    private UUID id;

    private TitleDto title;

    private RoomTitleShortDto roomTitle;
    
    private LocalDateTime createdAt;
}
