package project_z.demo.Mappers.impl;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import project_z.demo.Mappers.Mapper;
import project_z.demo.dto.TitleDtos.TitleDto;
import project_z.demo.dto.CharacterDtos.CharacterShortDto;
import project_z.demo.entity.TitleEntity;
import project_z.demo.entity.CharacterEntity;
import project_z.demo.entity.TitleRatingEntity;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class TitleMapperImpl implements Mapper<TitleEntity, TitleDto> {
    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private Mapper<CharacterEntity, CharacterShortDto> characterMapper;

    @Override
    public TitleDto mapTo(TitleEntity title) {
        TitleDto dto = modelMapper.map(title, TitleDto.class);

        if (title.getCharacter() != null) {
            dto.setCharacter(characterMapper.mapTo(title.getCharacter()));
        }

        if (title.getUser() != null) {
            dto.setUserId(title.getUser().getUserId());
        }

        if (title.getRatings() != null) {
            Map<String, Float> ratingMap = title.getRatings().stream()
                    .collect(Collectors.toMap(
                            TitleRatingEntity::getName,
                            TitleRatingEntity::getValue,
                            (v1, v2) -> v2
                    ));
            dto.setRating(ratingMap);
        } else {
            dto.setRating(Collections.emptyMap());
        }

        return dto;
    }

    @Override
    public TitleEntity mapFrom(TitleDto titleDto) {
        TitleEntity entity = modelMapper.map(titleDto, TitleEntity.class);

        if (titleDto.getCharacter() != null) {
            entity.setCharacter(characterMapper.mapFrom(titleDto.getCharacter()));
        }
        if (titleDto.getRating() != null) {
            List<TitleRatingEntity> ratingEntities = titleDto.getRating().entrySet().stream()
                    .map(entry -> TitleRatingEntity.builder()
                            .name(entry.getKey())
                            .value(entry.getValue())
                            .title(entity)
                            .build())
                    .collect(Collectors.toList());
            entity.setRatings(ratingEntities);
        }

        return entity;
    }
}