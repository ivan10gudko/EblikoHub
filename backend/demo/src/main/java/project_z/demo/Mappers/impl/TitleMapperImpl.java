package project_z.demo.Mappers.impl;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import project_z.demo.Mappers.Mapper;
import project_z.demo.dto.TitleDtos.TitleDto;
import project_z.demo.dto.CharacterDtos.CharacterShortDto;
import project_z.demo.entity.TitleEntity;
import project_z.demo.entity.CharacterEntity;

@Component
public class TitleMapperImpl implements Mapper<TitleEntity, TitleDto> {
    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private Mapper<CharacterEntity, CharacterShortDto> characterMapper;

    @Override
    public TitleDto mapTo(TitleEntity title){
        TitleDto dto = modelMapper.map(title, TitleDto.class);
        if (title.getCharacter() != null) {
            dto.setCharacter(characterMapper.mapTo(title.getCharacter()));
        }
        return dto;
    }

    @Override 
    public TitleEntity mapFrom(TitleDto titleDto){
        TitleEntity entity = modelMapper.map(titleDto, TitleEntity.class);
        if (titleDto.getCharacter() != null) {
            entity.setCharacter(characterMapper.mapFrom(titleDto.getCharacter()));
        }
        return entity;
    }
}
