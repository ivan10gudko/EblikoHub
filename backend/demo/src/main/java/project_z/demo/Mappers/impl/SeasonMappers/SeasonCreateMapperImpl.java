package project_z.demo.Mappers.impl.SeasonMappers;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import project_z.demo.Mappers.Mapper;
import project_z.demo.dto.SeasonDtos.SeasonCreateDto;
import project_z.demo.entity.SeasonEntity;

@Component
public class SeasonCreateMapperImpl implements Mapper<SeasonEntity, SeasonCreateDto> {
    @Autowired
    private ModelMapper modelMapper;

    @Override
    public SeasonCreateDto mapTo(SeasonEntity seasonEntity) {
        return modelMapper.map(seasonEntity, SeasonCreateDto.class);
    }

    @Override
    public SeasonEntity mapFrom(SeasonCreateDto seasonDto) {
        return modelMapper.map(seasonDto, SeasonEntity.class);
    }
}
