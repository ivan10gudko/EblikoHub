package project_z.demo.dto.TitleDtos;

import java.util.List;
import java.util.stream.Collectors;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TitleShortDto {
    private Long titleId;
    private String titleName;
    private Float ratingValue;

    public static TitleShortDto fromRow(Object[] row) {
        return new TitleShortDto(
                (Long) row[0],
                (String) row[1],
                row[3] != null ? ((Number) row[3]).floatValue() : 0f);
    }

    public static List<TitleShortDto> fromRows(List<Object[]> rows) {
        if (rows == null)
            return List.of();
        return rows.stream()
                .map(TitleShortDto::fromRow)
                .collect(Collectors.toList());
    }
}
