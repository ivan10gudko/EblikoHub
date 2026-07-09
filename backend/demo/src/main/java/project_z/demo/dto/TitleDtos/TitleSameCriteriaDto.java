package project_z.demo.dto.TitleDtos;

import java.util.List;
import java.util.stream.Collectors;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TitleSameCriteriaDto {
    private Long titleId;
    private String titleName;
    private Float ratingValue;

    public static TitleSameCriteriaDto fromRow(Object[] row) {
        return new TitleSameCriteriaDto(
                (Long) row[0],
                (String) row[1],
                row[3] != null ? ((Number) row[3]).floatValue() : 0f);
    }

    public static List<TitleSameCriteriaDto> fromRows(List<Object[]> rows) {
        if (rows == null)
            return List.of();
        return rows.stream()
                .map(TitleSameCriteriaDto::fromRow)
                .collect(Collectors.toList());
    }
}
