package project_z.demo.dto.TitleDtos;

import java.util.Map;

import lombok.Getter;
import lombok.Setter;
import project_z.demo.enums.TitleStatus;
import project_z.demo.enums.TitleType;
@Setter
@Getter
public class TitleStatsDto {
    private Map<TitleStatus, Long> statusCount;
    private Map<TitleType,Long> typeCount;
}
