package project_z.demo.dto.RoomTitleDtos;

import java.util.List;

import lombok.Getter;
import lombok.Setter;
import project_z.demo.dto.TitleDtos.TitleWithOwnerShortDto;

@Getter
@Setter
public class RoomTitleWithLinksDto {
    private RoomTitleDetailsDto roomTitle;

    private List<TitleWithOwnerShortDto> links;
}
