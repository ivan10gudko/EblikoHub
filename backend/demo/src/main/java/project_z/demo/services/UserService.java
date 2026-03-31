package project_z.demo.services;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.web.multipart.MultipartFile;

import project_z.demo.entity.UserEntity;

public interface UserService {
    public UserEntity save(UserEntity user);
    Optional<UserEntity> findOne(UUID id);
    boolean isExists(UUID id);
    UserEntity partialUpdate(UUID id, UserEntity userEntity);
    void deleteById(UUID id);
    Optional<UserEntity> findByNameTag(String nameTag);
    String uploadAvatar(UserEntity userEntity, MultipartFile file);
    List<UserEntity> findByName(String name);
}