package project_z.demo.Mappers.impl.ShortMappers;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import project_z.demo.Mappers.Mapper;
import project_z.demo.dto.UserDtos.UserShortDto;
import project_z.demo.entity.UserEntity;
@Component
public class UserShortDtoMapper implements Mapper<UserEntity, UserShortDto>{
    @Autowired
    private ModelMapper modelMapper;

    @Override
    public UserShortDto mapTo(UserEntity source) {
        return modelMapper.map(source, UserShortDto.class);
    }

    @Override
    public UserEntity mapFrom(UserShortDto source) {
        return modelMapper.map(source, UserEntity.class);
    }
}
