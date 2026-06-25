package project_z.demo.repositories;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import project_z.demo.entity.UserEntity;

@Repository
public interface UserRepository extends CrudRepository<UserEntity, UUID> {
    Optional<UserEntity> findByNameTag(String nameTag);

    boolean existsByNameTag(String nameTag);

    List<UserEntity> findByNameIgnoreCase(String name);

    Page<UserEntity> findByNameContainingIgnoreCase(String name, Pageable pageable);

    @Query("SELECT u FROM UserEntity u WHERE LOWER(u.name) LIKE LOWER(CONCAT('%', :name, '%')) AND u.userId != :currentUserId")
    Page<UserEntity> findByNameContainingIgnoreCaseAndNotSelf(
            @Param("name") String name,
            @Param("currentUserId") UUID currentUserId,
            Pageable pageable);
}
