package project_z.demo.Mappers.impl;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import project_z.demo.Mappers.Mapper;
import project_z.demo.dto.RoomDtos.RoomDto;
import project_z.demo.entity.RoomEntity;

@Component
public class RoomMapperImpl implements Mapper<RoomEntity, RoomDto> {
    @Autowired
    private ModelMapper modelMapper;
    @Override
    public RoomDto mapTo(RoomEntity roomEntity){
        return modelMapper.map(roomEntity, RoomDto.class);
}

@Override 
    public RoomEntity mapFrom(RoomDto roomDto){
        return modelMapper.map(roomDto, RoomEntity.class);
}
}
