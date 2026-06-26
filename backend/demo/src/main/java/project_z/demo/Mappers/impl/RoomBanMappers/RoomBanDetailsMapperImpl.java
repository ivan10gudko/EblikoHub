package project_z.demo.Mappers.impl.RoomBanMappers;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import project_z.demo.Mappers.Mapper;
import project_z.demo.dto.RoomBanDtos.RoomBanDetailsDto;
import project_z.demo.entity.RoomBanEntity;

@Component
public class RoomBanDetailsMapperImpl implements Mapper<RoomBanEntity, RoomBanDetailsDto> {
    @Autowired
    private ModelMapper modelMapper;

    @Override
    public RoomBanDetailsDto mapTo(RoomBanEntity friendshipEntity) {
        return modelMapper.map(friendshipEntity, RoomBanDetailsDto.class);
    }

    @Override
    public RoomBanEntity mapFrom(RoomBanDetailsDto friendshipDetailsDto) {
        return modelMapper.map(friendshipDetailsDto, RoomBanEntity.class);
    }
}
