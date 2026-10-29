package project_z.demo.Mappers.impl.TitleMappers;

import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import project_z.demo.Mappers.Mapper;
import project_z.demo.dto.TitleDtos.TitleSameCriteriaDto;
import project_z.demo.dto.TitleDtos.TitleShortWithLinksToRoomTitleDto;
import project_z.demo.entity.TitleEntity;
import project_z.demo.entity.TitleRatingEntity;

@Component
@RequiredArgsConstructor
public class TitleShortWithLinksToRoomTitleMapper {

    private final ModelMapper modelMapper;

    public TitleShortWithLinksToRoomTitleDto mapTo(TitleEntity entity, Set<Long> linkedTitleIds) {
        TitleShortWithLinksToRoomTitleDto dto = modelMapper.map(entity, TitleShortWithLinksToRoomTitleDto.class);
        dto.setIsAlreadyLinked(linkedTitleIds.contains(entity.getTitleId()));

        if (entity.getRatings() != null) {
            Map<String, Float> ratingMap = entity.getRatings().stream()
                    .collect(Collectors.toMap(
                            TitleRatingEntity::getName,
                            TitleRatingEntity::getValue,
                            (v1, v2) -> v2
                    ));
            dto.setRating(ratingMap);
        }

        return dto;
    }
}