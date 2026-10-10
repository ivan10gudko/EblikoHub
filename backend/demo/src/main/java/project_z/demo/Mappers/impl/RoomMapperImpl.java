package project_z.demo.Mappers.impl;

import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import project_z.demo.Mappers.Mapper;
import project_z.demo.dto.RoomDtos.RoomDto;
import project_z.demo.dto.RoomMemberDtos.RoomMemberDto;
import project_z.demo.entity.RoomEntity;
import project_z.demo.entity.RoomMemberEntity;

@Component
@RequiredArgsConstructor
public class RoomMapperImpl implements Mapper<RoomEntity, RoomDto> {
    private final Mapper<RoomMemberEntity, RoomMemberDto> roomMemberMapper;
    @Autowired
    private ModelMapper modelMapper;

    @Override
    public RoomDto mapTo(RoomEntity roomEntity) {
        RoomDto dto = new RoomDto();
        dto.setRoomId(roomEntity.getRoomId());
        dto.setRoomName(roomEntity.getRoomName());
        dto.setOwner(roomEntity.getOwner() != null ? roomEntity.getOwner().getUserId() : null);
        dto.setDescription(roomEntity.getDescription());
        dto.setImageUrl(roomEntity.getImageUrl());
        dto.setCreatedAt(roomEntity.getCreatedAt());

        if (roomEntity.getMembers() != null) {
            dto.setMembers(roomEntity.getMembers().stream()
                    .map(roomMemberMapper::mapTo)
                    .collect(Collectors.toList()));
        }
        return dto;
    }

    @Override
    public RoomEntity mapFrom(RoomDto roomDto) {
        return modelMapper.map(roomDto, RoomEntity.class);
    }
}
