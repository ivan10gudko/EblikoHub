package project_z.demo.Mappers.impl.PutMappers;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import project_z.demo.Mappers.Mapper;
import project_z.demo.dto.UserDtos.UserUpdateDto;
import project_z.demo.entity.UserEntity;

@Component
public class UserPutMapperImpl implements Mapper <UserEntity, UserUpdateDto> {
private final ModelMapper modelMapper;
    public UserPutMapperImpl(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
        this.modelMapper.getConfiguration()
                .setSkipNullEnabled(true); 
    }
@Override
public UserUpdateDto mapTo(UserEntity source) {
   return modelMapper.map(source, UserUpdateDto.class);
}

@Override 
public UserEntity mapFrom(UserUpdateDto source) {
   return modelMapper.map(source, UserEntity.class);
}
@Override
public void updateEntity(UserUpdateDto dto, UserEntity entity) {
    modelMapper.map(dto, entity);
}
}