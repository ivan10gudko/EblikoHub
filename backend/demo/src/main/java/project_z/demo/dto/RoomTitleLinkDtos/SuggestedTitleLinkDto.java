package project_z.demo.dto.RoomTitleLinkDtos;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SuggestedTitleLinkDto {
    private UUID roomTitleId;
    private String roomTitleName;
    private Long titleId;
    private String titleName;
    private String confidence;
}
