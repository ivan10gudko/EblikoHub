package project_z.demo.Mappers.impl.RoomTitleLinkMappers;

import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import project_z.demo.Mappers.Mapper;
import project_z.demo.dto.RoomTitleLinkDtos.RoomTitleLinkShortDto;
import project_z.demo.dto.TitleDtos.TitleShortDto;
import project_z.demo.dto.TitleDtos.TitleVisualDto;
import project_z.demo.entity.RoomTitleLinkEntity;
import project_z.demo.entity.TitleEntity;

@Component
@RequiredArgsConstructor
public class RoomTitleLinkShortMapperImpl implements Mapper<RoomTitleLinkEntity, RoomTitleLinkShortDto> {
    private final Mapper<TitleEntity, TitleVisualDto> titleVisualMapper;
    @Override 
    public RoomTitleLinkShortDto mapTo(RoomTitleLinkEntity entity){
        return new RoomTitleLinkShortDto().builder()
        .id(entity.getId())
        .title(titleVisualMapper.mapTo(entity.getUserTitleRecord()))
        .roomTitleId(entity.getRoomTitle().getId())
        .createdAt(entity.getCreatedAt()).build();
    }
    @Override
    public RoomTitleLinkEntity mapFrom(RoomTitleLinkShortDto b) {
        throw new UnsupportedOperationException("this mapping is not implemented");
    }
}
