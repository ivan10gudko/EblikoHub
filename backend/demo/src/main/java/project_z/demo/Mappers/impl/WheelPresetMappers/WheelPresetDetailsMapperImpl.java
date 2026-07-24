package project_z.demo.Mappers.impl.WheelPresetMappers;

import java.util.List;

import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import project_z.demo.Mappers.Mapper;
import project_z.demo.dto.WheelPresetDtos.WheelPresetDetailsDto;
import project_z.demo.dto.WheelPresetTitleDtos.WheelPresetTitleDetailsDto;
import project_z.demo.entity.wheelEntitys.WheelPresetEntity;
import project_z.demo.entity.wheelEntitys.WheelPresetTitleEntity;

@Component
@RequiredArgsConstructor
public class WheelPresetDetailsMapperImpl implements Mapper<WheelPresetEntity, WheelPresetDetailsDto> {

    private final Mapper<WheelPresetTitleEntity, WheelPresetTitleDetailsDto> presetTitleMapper;

    @Override
    public WheelPresetDetailsDto mapTo(WheelPresetEntity entity) {
        List<WheelPresetTitleDetailsDto> titleDtos = entity.getPresetTitles().stream()
                .map(presetTitleMapper::mapTo)
                .toList();

        return new WheelPresetDetailsDto(
                entity.getId(),
                entity.getName(),
                entity.getMode(),
                entity.getSpinDuration(),
                entity.getCreatedAt(),
                entity.getUpdatedAt(),
                titleDtos);
    }

    @Override
    public WheelPresetEntity mapFrom(WheelPresetDetailsDto dto) {
        throw new UnsupportedOperationException("Mapping from DetailsDto is not supported");
    }
}