package project_z.demo.dto.RoomTitleDtos;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.Data;
import project_z.demo.dto.RoomDtos.RoomShortDto;
import project_z.demo.enums.TitleType;
@Data
public class RoomTitleShortDto {
    private UUID id;

    private RoomShortDto room;

    private String titleName;

    private String imageUrl;
    
    private TitleType titleType;

    private Long apiTitleId;
    
    private LocalDateTime createdAt;
}
