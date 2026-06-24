package project_z.demo.Mappers.impl.RoomTitleLinkMappers;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import project_z.demo.Mappers.Mapper;
import project_z.demo.dto.RoomTitleLinkDtos.RoomTitleLinkDetailsDto;
import project_z.demo.entity.RoomTitleLinkEntity;

@Component
public class RoomTitleLinkDetailsMapperImpl implements Mapper<RoomTitleLinkEntity, RoomTitleLinkDetailsDto> {
    @Autowired
    private ModelMapper modelMapper;

    @Override
    public RoomTitleLinkDetailsDto mapTo(RoomTitleLinkEntity friendshipEntity) {
        return modelMapper.map(friendshipEntity, RoomTitleLinkDetailsDto.class);
    }

    @Override
    public RoomTitleLinkEntity mapFrom(RoomTitleLinkDetailsDto friendshipDetailsDto) {
        return modelMapper.map(friendshipDetailsDto, RoomTitleLinkEntity.class);
    }
}
