package project_z.demo.dto.TitleDtos;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
@Data
@AllArgsConstructor
public class SameCriteriaRatingResponse {
    private List<TitleSameCriteriaDto> titles;
    private Float avgRating;
}
