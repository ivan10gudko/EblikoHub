package project_z.demo.Mappers.impl.TitleMappers;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import java.util.Map;

import project_z.demo.Mappers.Mapper;
import project_z.demo.dto.SeasonDtos.SeasonDto;
import project_z.demo.entity.SeasonEntity;
import project_z.demo.enums.TitleStatus;
import project_z.demo.enums.TitleType;
import project_z.demo.dto.TitleDtos.TitleStatsDto;

@Component
public class TitleStatsMapper {
    
    public TitleStatsDto mapToDto(Map<TitleStatus, Long> statusMap, Map<TitleType, Long> typeMap) {
        TitleStatsDto dto = new TitleStatsDto();
        dto.setStatusCount(statusMap);
        dto.setTypeCount(typeMap);
        return dto;
    }
}