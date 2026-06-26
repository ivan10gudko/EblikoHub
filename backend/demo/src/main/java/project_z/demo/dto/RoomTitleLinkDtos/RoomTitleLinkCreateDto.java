package project_z.demo.dto.RoomTitleLinkDtos;

import java.util.UUID;

import lombok.Data;

@Data
public class RoomTitleLinkCreateDto {
    private Long titleId;

    private UUID roomTitleId;
}
