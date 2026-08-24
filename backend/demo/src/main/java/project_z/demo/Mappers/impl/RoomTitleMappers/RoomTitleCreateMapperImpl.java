package project_z.demo.Mappers.impl.RoomTitleMappers;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import project_z.demo.Mappers.Mapper;
import project_z.demo.dto.RoomTitleDtos.RoomTitleCreateDto;
import project_z.demo.entity.RoomTitleEntity;

@Component
public class RoomTitleCreateMapperImpl implements Mapper<RoomTitleEntity, RoomTitleCreateDto> {
    @Autowired
    private ModelMapper modelMapper;

    @Override
    public RoomTitleCreateDto mapTo(RoomTitleEntity friendshipEntity) {
        return modelMapper.map(friendshipEntity, RoomTitleCreateDto.class);
    }

    @Override
    public RoomTitleEntity mapFrom(RoomTitleCreateDto dto) {
        return new RoomTitleEntity().builder().apiTitleId(dto.getApiTitleId())
                .imageUrl(dto.getImageUrl())
                .titleName(dto.getTitleName())
                .titleType(dto.getTitleType())
                .build();
    }
}
