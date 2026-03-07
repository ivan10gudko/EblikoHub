package project_z.demo.Mappers.impl;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import project_z.demo.Mappers.Mapper;
import project_z.demo.dto.UserDtos.UserDto;
import project_z.demo.entity.UserEntity;
@Component
public class UserMapperImpl implements Mapper <UserEntity, UserDto> {
    private ModelMapper modelMapper;
    public UserMapperImpl(ModelMapper modelMapper){
        this.modelMapper = modelMapper;
    }
@Override
public UserDto mapTo(UserEntity userEntity){
    return  modelMapper.map(userEntity, UserDto.class);
}
@Override
public UserEntity mapFrom(UserDto userDto){
    return modelMapper.map(userDto, UserEntity.class);
}
}
