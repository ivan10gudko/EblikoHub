package project_z.demo.dto.TitleDtos;

import java.time.LocalDateTime;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import project_z.demo.enums.TitleStatus;
import project_z.demo.enums.TitleType;
@Getter
@Setter
public class TitleShortDto {
    private Long titleId;
    private Integer apiTitleId;
    private String titleName;
    private Map<String, Float> rating;
    private TitleStatus status;
    private String imageUrl;
    private LocalDateTime createdAt;
    private TitleType type;

}
