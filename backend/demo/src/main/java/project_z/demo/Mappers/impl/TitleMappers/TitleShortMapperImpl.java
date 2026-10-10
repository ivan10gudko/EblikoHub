package project_z.demo.Mappers.impl.TitleMappers;

import org.modelmapper.ModelMapper;

import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import project_z.demo.Mappers.Mapper;

import project_z.demo.dto.TitleDtos.TitleSameCriteriaDto;
import project_z.demo.dto.TitleDtos.TitleShortDto;
import project_z.demo.entity.TitleEntity;

@Component
@RequiredArgsConstructor
public class TitleShortMapperImpl implements Mapper<TitleEntity, TitleShortDto> {

    private final ModelMapper modelMapper;

    @Override
    public TitleShortDto mapTo(TitleEntity title) {
        return modelMapper.map(title, TitleShortDto.class);
    }

    @Override
    public TitleEntity mapFrom(TitleShortDto titleDto) {
        return modelMapper.map(titleDto, TitleEntity.class);
    }
}
