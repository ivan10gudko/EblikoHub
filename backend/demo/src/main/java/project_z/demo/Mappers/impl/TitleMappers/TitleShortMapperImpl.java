package project_z.demo.Mappers.impl.TitleMappers;

import org.modelmapper.ModelMapper;

import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import project_z.demo.Mappers.Mapper;

import project_z.demo.dto.TitleDtos.TitleSameCriteriaDto;
import project_z.demo.dto.TitleDtos.TitleShortDto;
import project_z.demo.entity.TitleEntity;
import project_z.demo.entity.TitleRatingEntity;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class TitleShortMapperImpl implements Mapper<TitleEntity, TitleShortDto> {

    private final ModelMapper modelMapper;

    @Override
    public TitleShortDto mapTo(TitleEntity title) {
        TitleShortDto dto = modelMapper.map(title, TitleShortDto.class);

        if (title.getRatings() != null) {
            Map<String, Float> ratingMap = title.getRatings().stream()
                    .collect(Collectors.toMap(
                            TitleRatingEntity::getName,
                            TitleRatingEntity::getValue,
                            (v1, v2) -> v2
                    ));
            dto.setRating(ratingMap);
        }

        return dto;
    }

    @Override
    public TitleEntity mapFrom(TitleShortDto titleDto) {
        TitleEntity entity = modelMapper.map(titleDto, TitleEntity.class);

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