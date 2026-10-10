package project_z.demo.Mappers.impl.RoomTitleMappers;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import project_z.demo.Mappers.Mapper;
import project_z.demo.dto.RoomTitleDtos.RoomTitleDetailsDto;
import project_z.demo.dto.UserDtos.UserShortDto;
import project_z.demo.entity.RoomTitleEntity;
import project_z.demo.entity.UserEntity;

@Component
@RequiredArgsConstructor
public class RoomTitleDetailsMapper implements Mapper<RoomTitleEntity, RoomTitleDetailsDto> {

    private final ModelMapper modelMapper;
    private final Mapper<UserEntity, UserShortDto> userShortMapper;

    @Override
    public RoomTitleDetailsDto mapTo(RoomTitleEntity entity) {
        RoomTitleDetailsDto dto = new RoomTitleDetailsDto();
        dto.setId(entity.getId());
        dto.setTitleName(entity.getTitleName());
        dto.setImageUrl(entity.getImageUrl());
        dto.setTitleType(entity.getTitleType());
        dto.setApiTitleId(entity.getApiTitleId());
        dto.setAddedByUser(userShortMapper.mapTo(entity.getAddedByUser()));
        dto.setCreatedAt(entity.getCreatedAt());
        return dto;
    }

    @Override
    public RoomTitleEntity mapFrom(RoomTitleDetailsDto friendshipDetailsDto) {
        return modelMapper.map(friendshipDetailsDto, RoomTitleEntity.class);
    }
}
