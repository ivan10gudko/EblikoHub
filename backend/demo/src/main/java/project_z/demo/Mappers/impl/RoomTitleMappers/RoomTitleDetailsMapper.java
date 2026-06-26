package project_z.demo.Mappers.impl.RoomTitleMappers;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;

import project_z.demo.Mappers.Mapper;
import project_z.demo.dto.RoomTitleDtos.RoomTitleDetailsDto;
import project_z.demo.entity.RoomTitleEntity;

import org.springframework.stereotype.Component;

@Component
public class RoomTitleDetailsMapper implements Mapper<RoomTitleEntity, RoomTitleDetailsDto> {
    @Autowired
    private ModelMapper modelMapper;

    @Override
    public RoomTitleDetailsDto mapTo(RoomTitleEntity friendshipEntity) {
        return modelMapper.map(friendshipEntity, RoomTitleDetailsDto.class);
    }

    @Override
    public RoomTitleEntity mapFrom(RoomTitleDetailsDto friendshipDetailsDto) {
        return modelMapper.map(friendshipDetailsDto, RoomTitleEntity.class);
    }
}
