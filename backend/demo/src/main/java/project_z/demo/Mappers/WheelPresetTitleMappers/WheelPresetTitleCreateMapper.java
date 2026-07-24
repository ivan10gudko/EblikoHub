package project_z.demo.Mappers.WheelPresetTitleMappers;

import org.springframework.stereotype.Component;

import project_z.demo.Mappers.Mapper;
import project_z.demo.dto.WheelPresetTitleDtos.WheelPresetTitleCreateDto;
import project_z.demo.entity.wheelEntitys.WheelPresetTitleEntity;

@Component
public class WheelPresetTitleCreateMapper implements Mapper<WheelPresetTitleEntity, WheelPresetTitleCreateDto> {

    @Override
    public WheelPresetTitleCreateDto mapTo(WheelPresetTitleEntity entity) {
        return new WheelPresetTitleCreateDto(
                entity.getTitleId().getTitleId()
        );
    }

    @Override
    public WheelPresetTitleEntity mapFrom(WheelPresetTitleCreateDto dto) {
        return WheelPresetTitleEntity.builder()
                .build();
    }
}