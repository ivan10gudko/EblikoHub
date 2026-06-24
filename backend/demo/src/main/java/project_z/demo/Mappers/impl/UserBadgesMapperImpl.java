package project_z.demo.Mappers.impl;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import project_z.demo.Mappers.Mapper;
import project_z.demo.dto.RoomDtos.RoomDto;
import project_z.demo.dto.UserBadgesDtos.UserBadgesDetailsDto;
import project_z.demo.entity.RoomEntity;
import project_z.demo.entity.UserBadgesEntity;

@Component

public class UserBadgesMapperImpl implements Mapper<UserBadgesEntity, UserBadgesDetailsDto> {

    @Autowired
    private ModelMapper modelMapper;

    public UserBadgesDetailsDto mapTo(UserBadgesEntity entity) {
        if (entity == null) {
            return null;
        }
        return modelMapper.map(entity, UserBadgesDetailsDto.class);
    }

    @Override
    public UserBadgesEntity mapFrom(UserBadgesDetailsDto roomDto) {
        throw new UnsupportedOperationException("Mapping back from UserBadgesDetailsDto is not implemented");
    }
}
