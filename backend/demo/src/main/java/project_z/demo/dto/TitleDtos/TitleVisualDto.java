package project_z.demo.dto.TitleDtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TitleVisualDto {
    private Long titleId;
    private Integer apiTitleId;
    private String titleName;
    private String imageUrl;
}