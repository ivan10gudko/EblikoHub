package project_z.demo.dto.TitleDtos;

import java.time.LocalDateTime;
import java.util.Map;

import lombok.Getter;
import lombok.Setter;
import project_z.demo.enums.TitleStatus;

@Setter
@Getter
public class TitleShortWithLinksToRoomTitleDto {
    private Long titleId;
    private Integer apiTitleId;
    private String titleName;
    private Map<String, Float> rating;
    private TitleStatus status;
    private String imageUrl;
    private LocalDateTime createdAt;
    private boolean IsAlreadyLinked;
}
