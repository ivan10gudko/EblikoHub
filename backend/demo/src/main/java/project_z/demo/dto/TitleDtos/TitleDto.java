package project_z.demo.dto.TitleDtos;

import java.time.LocalDateTime;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonInclude;

import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import project_z.demo.enums.TitleStatus;
import project_z.demo.enums.TitleType;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
public class TitleDto {
    private Long titleId;
    private Integer apiTitleId;
    private String titleName;
    private Map<String, Float> rating;
    private TitleStatus status;
    private TitleType titleType;
    private Double customOrder;
    private String imageUrl;
    private boolean isPinned;
    private LocalDateTime createdAt;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Double avgRating;
}
