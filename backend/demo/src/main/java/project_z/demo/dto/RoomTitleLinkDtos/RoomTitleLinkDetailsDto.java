package project_z.demo.dto.RoomTitleLinkDtos;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.Data;
import project_z.demo.dto.RoomTitleDtos.RoomTitleDetailsDto;
import project_z.demo.dto.TitleDtos.TitleShortDto;
@Data
public class RoomTitleLinkDetailsDto {

    private UUID id;

    private TitleShortDto title;

    private RoomTitleDetailsDto roomTitle;
    
    private LocalDateTime createdAt;
}
