package project_z.demo.Mappers.impl;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;

import project_z.demo.Mappers.Mapper;
import project_z.demo.dto.FriendshipDtos.FriendshipDetailsDto;
import project_z.demo.entity.FriendshipEntity;
import org.springframework.stereotype.Component;

@Component
public class FriendshipMapperImpl implements Mapper<FriendshipEntity, FriendshipDetailsDto> {
    @Autowired
    private ModelMapper modelMapper;

    @Override
    public FriendshipDetailsDto mapTo(FriendshipEntity friendshipEntity) {
        return modelMapper.map(friendshipEntity, FriendshipDetailsDto.class);
    }

    @Override
    public FriendshipEntity mapFrom(FriendshipDetailsDto friendshipDetailsDto) {
        return modelMapper.map(friendshipDetailsDto, FriendshipEntity.class);
    }
}
