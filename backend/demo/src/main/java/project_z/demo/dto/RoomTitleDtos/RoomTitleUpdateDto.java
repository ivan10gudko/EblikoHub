package project_z.demo.dto.RoomTitleDtos;

import lombok.Data;
import project_z.demo.dto.RoomDtos.RoomShortDto;
import project_z.demo.enums.TitleType;

@Data
public class RoomTitleUpdateDto {

    private String titleName;

    private String imageUrl;

    private TitleType titleType;

    private Long apiTitleId;
}
