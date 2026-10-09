package project_z.demo.dto.SeasonDtos;

import java.util.Map;

import lombok.Data;
import project_z.demo.entity.TitleEntity;
import project_z.demo.enums.TitleStatus;
import project_z.demo.enums.seasons.SeasonType;

@Data
public class SeasonCreateDto {
    private String name;
    private Map<String, Float> rating;
    private TitleStatus status;
    private Integer apiTitleId;
    private String description;
    private SeasonType type;
    private String imageUrl;
    private Long titleId;
}
