package project_z.demo.Mappers.impl.WheelCurrentTitleMappers;

import org.springframework.stereotype.Component;

import project_z.demo.Mappers.Mapper;
import project_z.demo.dto.WheelCurrentSettingsTitleDtos.WheelCurrentSettingsTitleCreateDto;
import project_z.demo.entity.wheelEntitys.WheelCurrentTitleEntity;
@Component
public class WheelCurrentTitleCreateDtoMapperImpl implements Mapper<WheelCurrentTitleEntity, WheelCurrentSettingsTitleCreateDto> {
    @Override
    public WheelCurrentSettingsTitleCreateDto mapTo(WheelCurrentTitleEntity entity) {
        return new WheelCurrentSettingsTitleCreateDto(
                entity.getTitle().getTitleId()
        );
    }

    @Override
    public WheelCurrentTitleEntity mapFrom(WheelCurrentSettingsTitleCreateDto dto) {
        return  WheelCurrentTitleEntity.builder()
        .build();
    }
}
