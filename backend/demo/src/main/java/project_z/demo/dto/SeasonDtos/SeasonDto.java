package project_z.demo.dto.SeasonDtos;

import java.util.Map;

import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import project_z.demo.entity.TitleEntity;
import project_z.demo.enums.TitleStatus;
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
public class SeasonDto {
    private Long seasonId;
    private String name;
    private Map<String, Float> rating;
    private TitleStatus status;
}
