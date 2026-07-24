package project_z.demo.Mappers.impl.WheelCurrentSettingsMappers;

import java.util.List;

import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import project_z.demo.Mappers.Mapper;
import project_z.demo.dto.WheelCurrentSettingsDtos.WheelCurrentSettingsDetailsDto;
import project_z.demo.dto.WheelCurrentSettingsTitleDtos.WheelCurrentSettingsTitleDetailsDto;
import project_z.demo.entity.wheelEntitys.WheelCurrentSettingsEntity;
import project_z.demo.entity.wheelEntitys.WheelCurrentTitleEntity;

@Component
@RequiredArgsConstructor
public class WheelCurrentSettingsDetailsMapperImpl implements Mapper<WheelCurrentSettingsEntity, WheelCurrentSettingsDetailsDto> {

    private final Mapper<WheelCurrentTitleEntity, WheelCurrentSettingsTitleDetailsDto> titleMapper;

    @Override
    public WheelCurrentSettingsDetailsDto mapTo(WheelCurrentSettingsEntity entity) {
        List<WheelCurrentSettingsTitleDetailsDto> titleDtos = entity.getCurrentTitles().stream()
                .map(titleMapper::mapTo)
                .toList();

        return new WheelCurrentSettingsDetailsDto(
                entity.getUserId(),
                entity.getMode(),
                entity.getSpinDuration(),
                entity.getUpdatedAt(),
                titleDtos
        );
    }

    @Override
    public WheelCurrentSettingsEntity mapFrom(WheelCurrentSettingsDetailsDto dto) {
        throw new UnsupportedOperationException("this mapping is not implemented");
    }
}