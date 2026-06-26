package project_z.demo.dto.RoomTitleDtos;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.Data;
import project_z.demo.dto.RoomDtos.RoomShortDto;
import project_z.demo.enums.TitleType;
@Data
public class RoomTitleDetailsDto {

    private UUID id;

    private RoomShortDto room;

    private String titleName;

    private String imageUrl;
    
    private TitleType titleType;

    private Long apiTitleId;

    private UUID addedByUserId;

    private LocalDateTime createdAt;
}
