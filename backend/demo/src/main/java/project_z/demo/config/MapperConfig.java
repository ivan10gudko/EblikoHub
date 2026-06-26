package project_z.demo.config;

import java.util.Collection;

import org.modelmapper.Converter;
import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import project_z.demo.dto.RoomBanDtos.RoomBanCreateDto;
import project_z.demo.dto.RoomDtos.RoomDto;
import project_z.demo.dto.RoomDtos.RoomShortDto;
import project_z.demo.dto.RoomTitleLinkDtos.RoomTitleLinkDetailsDto;
import project_z.demo.entity.RoomBanEntity;
import project_z.demo.entity.RoomEntity;
import project_z.demo.entity.RoomTitleLinkEntity;

@Configuration
public class MapperConfig {

    @Bean
    public ModelMapper modelMapper() {
        ModelMapper mapper = new ModelMapper();

        mapper.typeMap(RoomEntity.class, RoomShortDto.class).addMappings(m -> {
            m.map(RoomEntity::getMemberCount, RoomShortDto::setUsersCount);
            m.skip(RoomShortDto::setOwner);
        });
        mapper.createTypeMap(RoomEntity.class, RoomDto.class)
                .addMappings(m -> {
                    m.map(src -> src.getOwner().getUserId(), RoomDto::setOwner);
                });
        return mapper;
    }
}