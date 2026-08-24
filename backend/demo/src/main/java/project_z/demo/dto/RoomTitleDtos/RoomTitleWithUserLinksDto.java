package project_z.demo.dto.RoomTitleDtos;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import project_z.demo.dto.RoomTitleLinkDtos.RoomTitleLinkShortDto;
import project_z.demo.enums.TitleType;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomTitleWithUserLinksDto {
     private UUID id;

    private String titleName;

    private String imageUrl;
    
    private TitleType titleType;

    private Long apiTitleId;

    private UUID addedByUserId;

    private List<RoomTitleLinkShortDto> links;

    private LocalDateTime createdAt;
}
