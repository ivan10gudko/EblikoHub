package project_z.demo.repositories;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import project_z.demo.entity.UserFavoriteTitleEntity;

public interface UserFavoriteTitleRepository extends JpaRepository<UserFavoriteTitleEntity, UUID> {
    Optional<UserFavoriteTitleEntity> findByUserUserIdAndTitleTitleId(UUID userId, Long titleId);

    boolean existsByUserUserIdAndTitleTitleId(UUID userId, Long titleId);

    void deleteByUserUserIdAndTitleTitleId(UUID userId, Long titleId);
    
    long countByUserUserId(UUID userId);
}
