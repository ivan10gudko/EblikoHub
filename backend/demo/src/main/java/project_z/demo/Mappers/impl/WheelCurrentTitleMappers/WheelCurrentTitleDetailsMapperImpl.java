package project_z.demo.Mappers.impl.WheelCurrentTitleMappers;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import project_z.demo.Mappers.Mapper;
import project_z.demo.dto.TitleDtos.TitleShortDto;
import project_z.demo.dto.WheelCurrentSettingsTitleDtos.WheelCurrentSettingsTitleDetailsDto;
import project_z.demo.entity.TitleEntity;
import project_z.demo.entity.wheelEntitys.WheelCurrentTitleEntity;

@Component
@RequiredArgsConstructor
public class WheelCurrentTitleDetailsMapperImpl implements Mapper<WheelCurrentTitleEntity, WheelCurrentSettingsTitleDetailsDto> {

    private final ModelMapper modelMapper;
    private final Mapper<TitleEntity, TitleShortDto> titleMapper;

    @Override
    public WheelCurrentSettingsTitleDetailsDto mapTo(WheelCurrentTitleEntity entity) {
        return new WheelCurrentSettingsTitleDetailsDto(
            
            titleMapper.mapTo(entity.getTitle()),
            entity.getCreatedAt()
        );
    }

    @Override
    public WheelCurrentTitleEntity mapFrom(WheelCurrentSettingsTitleDetailsDto dto) {
        return modelMapper.map(dto, WheelCurrentTitleEntity.class);
    }
}