package project_z.demo.dto.RoomTitleLinkDtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import project_z.demo.dto.RoomTitleDtos.RoomTitleShortDto;
import project_z.demo.dto.TitleDtos.TitleShortDto;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SuggestedTitleLinkDto {
    private TitleShortDto title;
    private RoomTitleShortDto roomTitle;
    private String confidence;
}
