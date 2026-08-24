package project_z.demo.Mappers.impl.RoomTitleLinkMappers;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import project_z.demo.Mappers.Mapper;
import project_z.demo.dto.RoomTitleDtos.RoomTitleShortDto;
import project_z.demo.dto.RoomTitleLinkDtos.RoomTitleLinkDetailsDto;
import project_z.demo.dto.TitleDtos.TitleDto;
import project_z.demo.dto.TitleDtos.TitleSameCriteriaDto;
import project_z.demo.dto.TitleDtos.TitleShortDto;
import project_z.demo.entity.RoomTitleEntity;
import project_z.demo.entity.RoomTitleLinkEntity;
import project_z.demo.entity.TitleEntity;

@Component
@RequiredArgsConstructor
public class RoomTitleLinkDetailsMapperImpl implements Mapper<RoomTitleLinkEntity, RoomTitleLinkDetailsDto> {

    private final ModelMapper modelMapper;
    private final Mapper<TitleEntity, TitleShortDto> titleMapper;
    private final Mapper<RoomTitleEntity, RoomTitleShortDto> roomTitleMapper;

    @Override
    public RoomTitleLinkDetailsDto mapTo(RoomTitleLinkEntity entity) {
        RoomTitleLinkDetailsDto dto = new RoomTitleLinkDetailsDto();
        dto.setId(entity.getId());
        dto.setCreatedAt(entity.getCreatedAt());

        dto.setTitle(titleMapper.mapTo(entity.getUserTitleRecord()));
        dto.setRoomTitle(roomTitleMapper.mapTo(entity.getRoomTitle()));

        return dto;
    }

    @Override
    public RoomTitleLinkEntity mapFrom(RoomTitleLinkDetailsDto friendshipDetailsDto) {
        return modelMapper.map(friendshipDetailsDto, RoomTitleLinkEntity.class);
    }
}
