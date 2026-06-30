package project_z.demo.dto.RoomTitleDtos;

import java.util.List;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import project_z.demo.dto.TitleDtos.TitleShortDto;
import project_z.demo.enums.TitleStatus;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RoomTitleSummaryDto {
    private UUID roomTitleId;
    private RoomTitleShortDto titleInfo;    
    private Double computedAvgRating;
    private TitleStatus myStatus;
    private TitleShortDto myTitleInfo;
    private List<RoomTitleUserIdAndTitleStatusDto> userParticipation;
}

