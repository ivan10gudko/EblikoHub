package project_z.demo.dto.TitleDtos;

import lombok.Getter;
import lombok.Setter;
import project_z.demo.enums.TitleType;

@Getter
@Setter
public class TitleVisualDto {
    private Long titleId;
    private Integer apiTitleId;
    private String titleName;
    private String imageUrl;
    private TitleType titleType;
}