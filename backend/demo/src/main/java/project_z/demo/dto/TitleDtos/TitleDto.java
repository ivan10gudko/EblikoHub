package project_z.demo.dto.TitleDtos;

import java.time.LocalDateTime;
import java.util.Map;

import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import project_z.demo.enums.TitleStatus;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TitleDto {
    @Id
    private Long titleId;
    private Integer apiTitleId;
    private String titleName;
    private Map<String, Float> rating;
    private TitleStatus status;
    private LocalDateTime createdAt;
}
