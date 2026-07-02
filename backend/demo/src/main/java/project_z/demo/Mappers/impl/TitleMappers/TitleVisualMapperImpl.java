package project_z.demo.Mappers.impl.TitleMappers;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import project_z.demo.Mappers.Mapper;
import project_z.demo.dto.TitleDtos.TitleVisualDto;
import project_z.demo.entity.TitleEntity;

@Component
@RequiredArgsConstructor
public class TitleVisualMapperImpl implements Mapper<TitleEntity, TitleVisualDto> {
     private final ModelMapper modelMapper;

    @Override
    public TitleVisualDto mapTo(TitleEntity title) {
        return modelMapper.map(title, TitleVisualDto.class);
    }

    @Override
    public TitleEntity mapFrom(TitleVisualDto titleDto) {
        return modelMapper.map(titleDto, TitleEntity.class);
    }    
}
