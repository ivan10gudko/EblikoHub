package project_z.demo.dto;

import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import project_z.demo.entity.TitleEntity;
import project_z.demo.entity.TitleEntity.titleStatus;
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SeasonDto {
    @Id
    private Long seasonId;
    private String name;
    private Float rating;
    private titleStatus status;
    private TitleEntity title;
}
