package project_z.demo.Mappers.impl.RoomTitleMappers;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import project_z.demo.Mappers.Mapper;
import project_z.demo.dto.RoomTitleDtos.RoomTitleUpdateDto;
import project_z.demo.entity.RoomTitleEntity;

@Component
public class RoomTitleUpdateMapperImpl implements Mapper<RoomTitleEntity, RoomTitleUpdateDto> {
    @Autowired
    private ModelMapper modelMapper;

    @Override
    public RoomTitleUpdateDto mapTo(RoomTitleEntity friendshipEntity) {
        return modelMapper.map(friendshipEntity, RoomTitleUpdateDto.class);
    }

    @Override
    public RoomTitleEntity mapFrom(RoomTitleUpdateDto friendshipDetailsDto) {
        return modelMapper.map(friendshipDetailsDto, RoomTitleEntity.class);
    }
}
