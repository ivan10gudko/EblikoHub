package project_z.demo.Mappers.impl.RoomTitleMappers;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import project_z.demo.Mappers.Mapper;
import project_z.demo.dto.RoomDtos.RoomShortDto;
import project_z.demo.entity.RoomTitleEntity;

@Component
public class RoomTitleShortMapperImpl implements Mapper<RoomTitleEntity, RoomShortDto> {
    @Autowired
    private ModelMapper modelMapper;

    @Override
    public RoomShortDto mapTo(RoomTitleEntity friendshipEntity) {
        return modelMapper.map(friendshipEntity, RoomShortDto.class);
    }

    @Override
    public RoomTitleEntity mapFrom(RoomShortDto friendshipDetailsDto) {
        return modelMapper.map(friendshipDetailsDto, RoomTitleEntity.class);
    }
}
