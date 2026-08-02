package project_z.demo.Mappers.impl.UserMappers;

import java.util.Collections;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import lombok.AllArgsConstructor;
import project_z.demo.Mappers.Mapper;
import project_z.demo.dto.TitleDtos.TitleDto;
import project_z.demo.dto.TitleDtos.TitleShortDto;
import project_z.demo.dto.UserDtos.UserDto;
import project_z.demo.dto.UserDtos.UserProfileDto;
import project_z.demo.dto.UserFavoriteTitlesDtos.UserFavoriteTitleItemDto;
import project_z.demo.entity.TitleEntity;
import project_z.demo.entity.UserEntity;
import project_z.demo.entity.UserFavoriteTitleEntity;

@Component
@AllArgsConstructor
public class UserProfileMapperImpl implements Mapper<UserEntity, UserProfileDto> {

    private final ModelMapper modelMapper;
    private final Mapper<UserFavoriteTitleEntity, UserFavoriteTitleItemDto> favoriteTitleItemMapper;

    @Override
    public UserProfileDto mapTo(UserEntity userEntity) {
        if (userEntity == null) {
            return null;
        }

        return UserProfileDto.builder()
                .userId(userEntity.getUserId())
                .name(userEntity.getName())
                .nameTag(userEntity.getNameTag())
                .description(userEntity.getDescription())
                .img(userEntity.getImg())
                .createdAt(userEntity.getCreatedAt())
                .favoriteTitles(
                        userEntity.getFavoriteTitles() != null
                                ? userEntity.getFavoriteTitles().stream()
                                        .map(favoriteTitleItemMapper::mapTo)
                                        .collect(Collectors.toList())
                                : Collections.emptyList())
                .build();
    }

    @Override
    public UserEntity mapFrom(UserProfileDto userDto) {
        return modelMapper.map(userDto, UserEntity.class);
    }
}