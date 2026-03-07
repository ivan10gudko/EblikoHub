package project_z.demo.Mappers.impl.PostMappers;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import project_z.demo.Mappers.Mapper;
import project_z.demo.dto.UserDtos.UserPostDto;
import project_z.demo.entity.TitleEntity;
import project_z.demo.entity.UserEntity;

@Component
public class UserPostMapperImpl implements Mapper <UserEntity, UserPostDto> {
@Autowired
private ModelMapper modelMapper;
@Override
public UserPostDto mapTo(UserEntity source) {
   return modelMapper.map(source, UserPostDto.class);
}

@Override 
public UserEntity mapFrom(UserPostDto source) {
   return modelMapper.map(source, UserEntity.class);
}
}