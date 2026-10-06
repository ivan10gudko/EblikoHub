package project_z.demo.repositories;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import project_z.demo.entity.UserFavoriteCharacterEntity;

public interface UserFavoriteCharacterRepository extends JpaRepository<UserFavoriteCharacterEntity, UUID> {
    Optional<UserFavoriteCharacterEntity> findByUserUserIdAndCharacterId(UUID userId, UUID characterId);

    boolean existsByUserUserIdAndCharacterId(UUID userId, UUID characterId);

    void deleteByUserUserIdAndCharacterId(UUID userId, UUID characterId);
    
    boolean existsByUserUserIdAndPosition(UUID userId, Integer position);

    long countByUserUserId(UUID userId);
}
