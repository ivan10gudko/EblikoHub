package project_z.demo.Mappers.impl.WheelPresetMappers;

import java.util.ArrayList;

import org.springframework.stereotype.Component;

import project_z.demo.Mappers.Mapper;
import project_z.demo.dto.WheelPresetDtos.WheelPresetCreateDto;
import project_z.demo.entity.wheelEntitys.WheelPresetEntity;

    @Component
public class WheelPresetCreateMapperImpl implements Mapper<WheelPresetEntity, WheelPresetCreateDto> {
    
    @Override
    public WheelPresetEntity mapFrom(WheelPresetCreateDto dto) {
        return WheelPresetEntity.builder()
                .name(dto.name())
                .mode(dto.mode())
                .spinDuration(dto.spinDuration())
                .presetTitles(new ArrayList<>())
                .build();
    }

    @Override
    public WheelPresetCreateDto mapTo(WheelPresetEntity entity) {
        throw new UnsupportedOperationException("Mapping to CreateDto is not supported");
    }
}