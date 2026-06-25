package project_z.demo.config;

import java.util.Collection;

import org.modelmapper.Converter;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import project_z.demo.dto.RoomDtos.RoomShortDto;
import project_z.demo.dto.UserDtos.UserDtoWithFriendshipStatus;
import project_z.demo.entity.RoomEntity;
import project_z.demo.entity.UserEntity;
import project_z.demo.enums.RequestStatus;

@Configuration
public class MapperConfig {

    @Bean
    public ModelMapper modelMapper() {
        ModelMapper mapper = new ModelMapper();


        mapper.typeMap(RoomEntity.class, RoomShortDto.class).addMappings(m -> {
            m.map(RoomEntity::getMemberCount, RoomShortDto::setUsersCount);
            m.skip(RoomShortDto::setOwner);
        });

        return mapper;
    }
}