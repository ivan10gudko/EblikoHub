package project_z.demo.Mappers.impl.WheelCurrentSettingsMappers;

import java.util.ArrayList;

import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import project_z.demo.Mappers.Mapper;
import project_z.demo.dto.WheelCurrentSettingsDtos.WheelCurrentSettingsCreateDto;
import project_z.demo.entity.wheelEntitys.WheelCurrentSettingsEntity;

@Component
@RequiredArgsConstructor
public class WheelCurrentSettingsCreateMapperImpl implements Mapper<WheelCurrentSettingsEntity, WheelCurrentSettingsCreateDto> {
    @Override
    public WheelCurrentSettingsEntity mapFrom(WheelCurrentSettingsCreateDto dto) {
        WheelCurrentSettingsEntity settings = WheelCurrentSettingsEntity.builder()
                .mode(dto.mode())
                .spinDuration(dto.spinDuration())
                .currentTitles(new ArrayList<>())
                .build();

        return settings;
    }

    @Override
    public WheelCurrentSettingsCreateDto mapTo(WheelCurrentSettingsEntity dto) {
        throw new UnsupportedOperationException("this mapping is not implemented");
    }
}