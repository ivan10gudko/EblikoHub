package project_z.demo.services;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import project_z.demo.common.QueryParameters.UserQueryParameters;
import project_z.demo.dto.UserDtos.UserDto;
import project_z.demo.dto.UserDtos.UserWithRelationsToRoomDto;
import project_z.demo.entity.UserEntity;

public interface UserService {
    public UserEntity save(UserEntity user);

    UserEntity findOne(UUID id);

    boolean isExists(UUID id);

    UserEntity partialUpdate(UUID id, UserEntity userEntity);

    void deleteById(UUID id);

    UserDto findByNameTag(String nameTag);

    String uploadAvatar(UserEntity userEntity, MultipartFile file);

    Page<UserEntity> findByName(String name, UserQueryParameters userQueryParameters, UUID currentUserId);

    Page<UserWithRelationsToRoomDto> searchUsersForRoom(String name, Long roomId,
            UserQueryParameters queryParameters);
}