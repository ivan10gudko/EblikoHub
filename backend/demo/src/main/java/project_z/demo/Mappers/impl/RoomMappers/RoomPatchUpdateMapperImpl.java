package project_z.demo.Mappers.impl.RoomMappers;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import project_z.demo.Mappers.Mapper;
import project_z.demo.dto.RoomDtos.RoomShortDto;
import project_z.demo.dto.RoomDtos.RoomPatchUpdateDto;
import project_z.demo.entity.RoomEntity;

@Component

public class RoomPatchUpdateMapperImpl implements Mapper<RoomEntity, RoomPatchUpdateDto> {
    @Autowired
    private ModelMapper modelMapper;

    @Override
    public RoomPatchUpdateDto mapTo(RoomEntity source) {
        return modelMapper.map(source, RoomPatchUpdateDto.class);
    }

    @Override
    public RoomEntity mapFrom(RoomPatchUpdateDto source) {
        return modelMapper.map(source, RoomEntity.class);
    }
}

