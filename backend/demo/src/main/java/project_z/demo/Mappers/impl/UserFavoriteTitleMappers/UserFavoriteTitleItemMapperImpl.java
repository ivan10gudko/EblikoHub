package project_z.demo.Mappers.impl.UserFavoriteTitleMappers;


import org.springframework.stereotype.Component;

import lombok.AllArgsConstructor;
import project_z.demo.Mappers.Mapper;
import project_z.demo.dto.TitleDtos.TitleShortDto;
import project_z.demo.dto.UserFavoriteTitlesDtos.UserFavoriteTitleItemDto;
import project_z.demo.entity.TitleEntity;
import project_z.demo.entity.UserFavoriteTitleEntity;

@Component
@AllArgsConstructor
public class UserFavoriteTitleItemMapperImpl implements Mapper<UserFavoriteTitleEntity, UserFavoriteTitleItemDto> {

    private final Mapper<TitleEntity, TitleShortDto> titleShortMapper;

    @Override
    public UserFavoriteTitleItemDto mapTo(UserFavoriteTitleEntity entity) {
        if (entity == null) {
            return null;
        }

        return UserFavoriteTitleItemDto.builder()
                .id(entity.getId())
                .title(titleShortMapper.mapTo(entity.getTitle()))
                .build();
    }

    @Override
    public UserFavoriteTitleEntity mapFrom(UserFavoriteTitleItemDto dto) {
        throw new UnsupportedOperationException("this mapping is not implemented");
    }
}