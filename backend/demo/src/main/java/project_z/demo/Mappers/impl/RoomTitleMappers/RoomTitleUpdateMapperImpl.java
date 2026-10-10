package project_z.demo.Mappers.impl.RoomTitleMappers;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import project_z.demo.Mappers.Mapper;
import project_z.demo.dto.RoomTitleDtos.RoomTitleUpdateDto;
import project_z.demo.entity.RoomTitleEntity;

@Component
public class RoomTitleUpdateMapperImpl {
    @Autowired
    private ModelMapper modelMapper;

    public RoomTitleUpdateDto mapTo(RoomTitleEntity friendshipEntity) {
        return modelMapper.map(friendshipEntity, RoomTitleUpdateDto.class);
    }

    public RoomTitleEntity mapFrom(RoomTitleEntity entity, RoomTitleUpdateDto dto) {
        entity.setApiTitleId(dto.getApiTitleId());
        entity.setImageUrl(dto.getImageUrl());
        entity.setTitleName(dto.getTitleName());
        entity.setTitleType(dto.getTitleType());
        return entity;
    }
}
