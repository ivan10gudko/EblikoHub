package project_z.demo.Mappers.impl;

import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import project_z.demo.Mappers.Mapper;
import project_z.demo.dto.RoomMemberDtos.RoomMemberDto;
import project_z.demo.dto.UserDtos.UserShortDto;
import project_z.demo.entity.RoomMemberEntity;
import project_z.demo.entity.UserEntity;

@Component
@RequiredArgsConstructor
public class RoomMemberMapperImpl implements Mapper<RoomMemberEntity, RoomMemberDto> {

    private final Mapper<UserEntity, UserShortDto> userMapper;

    @Override
    public RoomMemberDto mapTo(RoomMemberEntity entity) {
        RoomMemberDto dto = new RoomMemberDto();
        dto.setId(entity.getId());
        dto.setRole(entity.getRole());
        dto.setUser(userMapper.mapTo(entity.getUser()));
        dto.setCreatedAt(entity.getCreatedAt());
        return dto;
    }

    @Override
    public RoomMemberEntity mapFrom(RoomMemberDto dto) {
        throw new UnsupportedOperationException("Mapping back from RoomMemberDto is not implemented");
    }
}