package project_z.demo.dto.RoomTitleLinkDtos;

import java.util.List;

import lombok.Data;

@Data
public class RoomTitleLinkBatchCreateDto {
    private List<RoomTitleLinkCreateDto> links;
}
