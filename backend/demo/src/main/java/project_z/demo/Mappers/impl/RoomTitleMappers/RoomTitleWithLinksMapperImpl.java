package project_z.demo.Mappers.impl.RoomTitleMappers;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import project_z.demo.Mappers.Mapper;
import project_z.demo.dto.RoomTitleDtos.RoomTitleDetailsDto;
import project_z.demo.dto.RoomTitleDtos.RoomTitleWithLinksDto;
import project_z.demo.dto.TitleDtos.TitleShortDto;
import project_z.demo.dto.TitleDtos.TitleWithOwnerShortDto;
import project_z.demo.dto.UserDtos.UserShortDto;
import project_z.demo.entity.RoomTitleEntity;
import project_z.demo.entity.TitleEntity;
import project_z.demo.entity.UserEntity;

@Component
@RequiredArgsConstructor
public class RoomTitleWithLinksMapperImpl implements Mapper<List<Object[]>, RoomTitleWithLinksDto> {
    private final ModelMapper modelMapper;
    private final Mapper<RoomTitleEntity, RoomTitleDetailsDto> roomTitleDetailsMapper;
    private final Mapper<TitleEntity, TitleShortDto> titleMapper;
    private final Mapper<UserEntity, UserShortDto> userShortMapper;

    @Override
    public RoomTitleWithLinksDto mapTo(List<Object[]> rows) {
        if (rows == null || rows.isEmpty()) {
            return null;
        }

        RoomTitleEntity roomTitleEntity = (RoomTitleEntity) rows.get(0)[0];
        RoomTitleDetailsDto roomTitleDto = roomTitleDetailsMapper.mapTo(roomTitleEntity);

        List<TitleWithOwnerShortDto> linkDtos = rows.stream()
                .filter(row -> row[1] != null)
                .map(row -> {
                    TitleEntity titleEntity = (TitleEntity) row[2];
                    UserEntity userEntity = (UserEntity) row[3];

                    TitleWithOwnerShortDto linkDto = new TitleWithOwnerShortDto();
                    linkDto.setTitle(titleMapper.mapTo(titleEntity));
                    linkDto.setOwner(userShortMapper.mapTo(userEntity));
                    return linkDto;
                })
                .collect(Collectors.toList());

        RoomTitleWithLinksDto result = new RoomTitleWithLinksDto();
        result.setRoomTitle(roomTitleDto);
        result.setLinks(linkDtos);

        return result;
    }

    @Override
    public List<Object[]> mapFrom(RoomTitleWithLinksDto dto) {
        throw new UnsupportedOperationException("Mapping from RoomTitleWithLinksDto to Object is not supported.");
    }

}
