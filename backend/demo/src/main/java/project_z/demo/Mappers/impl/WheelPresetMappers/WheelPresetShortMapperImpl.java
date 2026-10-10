package project_z.demo.Mappers.impl.WheelPresetMappers;

import org.springframework.stereotype.Component;

import project_z.demo.Mappers.Mapper;
import project_z.demo.dto.WheelPresetDtos.WheelPresetShortDto;
import project_z.demo.entity.wheelEntitys.WheelPresetEntity;

@Component
public class WheelPresetShortMapperImpl implements Mapper<WheelPresetEntity, WheelPresetShortDto> {

    @Override
    public WheelPresetShortDto mapTo(WheelPresetEntity entity) {
        int titlesCount = (entity.getPresetTitles() != null) ? entity.getPresetTitles().size() : 0;

        return new WheelPresetShortDto(
                entity.getId(),
                entity.getName(),
                entity.getMode(),
                titlesCount,
                entity.getCreatedAt());
    }

    @Override
    public WheelPresetEntity mapFrom(WheelPresetShortDto dto) {
        throw new UnsupportedOperationException("Mapping from ShortDto is not supported");
    }
}
