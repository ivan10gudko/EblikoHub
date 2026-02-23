package project_z.demo.repositories;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import project_z.demo.entity.UserEntity;

@Repository
public interface UserRepository extends CrudRepository<UserEntity, UUID> {
    Optional<UserEntity> findByNameTag(String nameTag);
    boolean existsByNameTag(String nameTag);
    List<UserEntity> findByNameIgnoreCase(String name);
}
