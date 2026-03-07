package project_z.demo.Mappers.impl;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import project_z.demo.Mappers.Mapper;
import project_z.demo.dto.TitleDtos.TitleDto;
import project_z.demo.entity.TitleEntity;
@Component
public class TitleMapperImpl implements Mapper<TitleEntity, TitleDto> {
    @Autowired
    private ModelMapper modelMapper;
@Override
public TitleDto mapTo(TitleEntity title){
    return modelMapper.map(title, TitleDto.class);
}

@Override 
public TitleEntity mapFrom(TitleDto titleDto){
    return modelMapper.map(titleDto, TitleEntity.class);
}
}
