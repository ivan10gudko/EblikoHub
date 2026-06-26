package project_z.demo.Mappers.impl.RoomTitleMappers;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import project_z.demo.Mappers.Mapper;
import project_z.demo.dto.RoomTitleDtos.RoomTitleShortDto;
import project_z.demo.entity.RoomTitleEntity;

@Component
@RequiredArgsConstructor
public class RoomTitleShortMapperImpl implements Mapper<RoomTitleEntity, RoomTitleShortDto> {

    private final ModelMapper modelMapper;

    @Override
    public RoomTitleShortDto mapTo(RoomTitleEntity friendshipEntity) {
        return modelMapper.map(friendshipEntity, RoomTitleShortDto.class);
    }

    @Override
    public RoomTitleEntity mapFrom(RoomTitleShortDto friendshipDetailsDto) {
        return modelMapper.map(friendshipDetailsDto, RoomTitleEntity.class);
    }
}
