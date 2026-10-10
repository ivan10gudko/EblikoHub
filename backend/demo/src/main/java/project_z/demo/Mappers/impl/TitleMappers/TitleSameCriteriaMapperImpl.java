package project_z.demo.Mappers.impl.TitleMappers;

import org.modelmapper.ModelMapper;

import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import project_z.demo.Mappers.Mapper;

import project_z.demo.dto.TitleDtos.TitleSameCriteriaDto;
import project_z.demo.entity.TitleEntity;

@Component
@RequiredArgsConstructor
public class TitleSameCriteriaMapperImpl implements Mapper<TitleEntity, TitleSameCriteriaDto> {

    private final ModelMapper modelMapper;

    @Override
    public TitleSameCriteriaDto mapTo(TitleEntity title) {
        return modelMapper.map(title, TitleSameCriteriaDto.class);
    }

    @Override
    public TitleEntity mapFrom(TitleSameCriteriaDto titleDto) {
        return modelMapper.map(titleDto, TitleEntity.class);
    }
}
