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
    public RoomTitleDetailsDto mapTo(RoomTitleEntity entity) {
        RoomTitleDetailsDto dto = new RoomTitleDetailsDto();
        dto.setId(entity.getId());
        dto.setTitleName(entity.getTitleName());
        dto.setImageUrl(entity.getImageUrl());
        dto.setTitleType(entity.getTitleType());
        dto.setApiTitleId(entity.getApiTitleId());
        dto.setAddedByUserId(entity.getAddedByUserId());
        dto.setCreatedAt(entity.getCreatedAt());
        return dto;
    }

    @Override
    public RoomTitleEntity mapFrom(RoomTitleDetailsDto friendshipDetailsDto) {
        return modelMapper.map(friendshipDetailsDto, RoomTitleEntity.class);
    }
}
