package project_z.demo.Mappers.impl;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import project_z.demo.Mappers.Mapper;
import project_z.demo.dto.SeasonDto;
import project_z.demo.entity.SeasonEntity;
@Component
public class SeasonMapperImpl implements Mapper<SeasonEntity, SeasonDto> {
@Autowired
    private ModelMapper modelMapper;
@Override
public SeasonDto mapTo(SeasonEntity seasonEntity){
    return modelMapper.map(seasonEntity, SeasonDto.class);
}

@Override
public SeasonEntity mapFrom(SeasonDto seasonDto){
    return modelMapper.map(seasonDto, SeasonEntity.class);
}
}
