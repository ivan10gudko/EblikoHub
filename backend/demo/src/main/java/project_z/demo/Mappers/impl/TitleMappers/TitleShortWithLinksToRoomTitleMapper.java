package project_z.demo.Mappers.impl.TitleMappers;

import java.util.Set;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import project_z.demo.Mappers.Mapper;
import project_z.demo.dto.TitleDtos.TitleSameCriteriaDto;
import project_z.demo.dto.TitleDtos.TitleShortWithLinksToRoomTitleDto;
import project_z.demo.entity.TitleEntity;

@Component
@RequiredArgsConstructor
public class TitleShortWithLinksToRoomTitleMapper {

    private final ModelMapper modelMapper;

    public TitleShortWithLinksToRoomTitleDto mapTo(TitleEntity entity, Set<Long> linkedTitleIds) {
        TitleShortWithLinksToRoomTitleDto dto = modelMapper.map(entity, TitleShortWithLinksToRoomTitleDto.class);
        dto.setIsAlreadyLinked(linkedTitleIds.contains(entity.getTitleId()));

        return dto;
    }
}
