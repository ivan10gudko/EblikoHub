package project_z.demo.Mappers.impl.PatchMappers;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import project_z.demo.Mappers.Mapper;
import project_z.demo.dto.TitleDtos.TitlePatchUpdateDto;
import project_z.demo.entity.TitleEntity;

@Component
public class TitlePatchMapper implements Mapper <TitleEntity, TitlePatchUpdateDto> {
@Autowired
private ModelMapper modelMapper;
@Override
public TitlePatchUpdateDto mapTo(TitleEntity source) {
   return modelMapper.map(source, TitlePatchUpdateDto.class);
}

@Override 
public TitleEntity mapFrom(TitlePatchUpdateDto source) {
   return modelMapper.map(source, TitleEntity.class);
}
}