package project_z.demo.Mappers.WheelPresetTitleMappers;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import project_z.demo.Mappers.Mapper;
import project_z.demo.dto.TitleDtos.TitleShortDto;
import project_z.demo.dto.WheelPresetTitleDtos.WheelPresetTitleDetailsDto;
import project_z.demo.entity.TitleEntity;
import project_z.demo.entity.wheelEntitys.WheelPresetTitleEntity;

@Component
@RequiredArgsConstructor
public class WheelPresetTitleDetailsMapper implements Mapper<WheelPresetTitleEntity, WheelPresetTitleDetailsDto> {

    private final ModelMapper modelMapper;
    private final Mapper<TitleEntity, TitleShortDto> titleMapper;

    @Override
    public WheelPresetTitleDetailsDto mapTo(WheelPresetTitleEntity entity) {
        return new WheelPresetTitleDetailsDto(
                titleMapper.mapTo(entity.getTitleId()),
            entity.getCreatedAt());
    }

    @Override
    public WheelPresetTitleEntity mapFrom(WheelPresetTitleDetailsDto dto) {
        return modelMapper.map(dto, WheelPresetTitleEntity.class);
    }
}
