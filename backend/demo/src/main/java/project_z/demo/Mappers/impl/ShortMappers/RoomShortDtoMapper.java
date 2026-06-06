package project_z.demo.Mappers.impl.ShortMappers;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import project_z.demo.Mappers.Mapper;
import project_z.demo.dto.RoomDtos.RoomShortDto;
import project_z.demo.entity.RoomEntity;

@Component

public class RoomShortDtoMapper implements Mapper<RoomEntity, RoomShortDto> {
    @Autowired
    private ModelMapper modelMapper;

    @Override
    public RoomShortDto mapTo(RoomEntity source) {
        return modelMapper.map(source, RoomShortDto.class);
    }

    @Override
    public RoomEntity mapFrom(RoomShortDto source) {
        return modelMapper.map(source, RoomEntity.class);
    }
}
