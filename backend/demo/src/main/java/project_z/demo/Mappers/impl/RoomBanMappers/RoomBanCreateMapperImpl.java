package project_z.demo.Mappers.impl.RoomBanMappers;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import project_z.demo.Mappers.Mapper;
import project_z.demo.dto.RoomBanDtos.RoomBanCreateDto;
import project_z.demo.entity.RoomBanEntity;

@Component
public class RoomBanCreateMapperImpl implements Mapper<RoomBanEntity, RoomBanCreateDto> {
    @Autowired
    private ModelMapper modelMapper;

    @Override
    public RoomBanCreateDto mapTo(RoomBanEntity friendshipEntity) {
        return modelMapper.map(friendshipEntity, RoomBanCreateDto.class);
    }

    @Override
    public RoomBanEntity mapFrom(RoomBanCreateDto friendshipDetailsDto) {
        return modelMapper.map(friendshipDetailsDto, RoomBanEntity.class);
    }
}
