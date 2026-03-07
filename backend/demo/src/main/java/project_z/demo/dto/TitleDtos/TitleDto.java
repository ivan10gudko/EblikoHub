package project_z.demo.dto.TitleDtos;

import java.time.LocalDateTime;
import java.util.Map;

import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import project_z.demo.entity.TitleEntity.titleStatus;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TitleDto {
    @Id
    private Long titleId;
    private int apiTitleId;
    private String titleName;
    private Map<String, Float> rating;
    private titleStatus status;
    private LocalDateTime createdAt;
}
