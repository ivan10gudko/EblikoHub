package project_z.demo.repositories.wheelRepositories;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import project_z.demo.entity.wheelEntitys.WheelCurrentSettingsEntity;

public interface WheelCurrentSettingsRepository extends JpaRepository<WheelCurrentSettingsEntity, UUID> {
    @Query("SELECT wcse FROM WheelCurrentSettingsEntity wcse " +
            "LEFT JOIN FETCH wcse.currentTitles ct " +
            "LEFT JOIN FETCH ct.title t " +
            "WHERE wcse.user.userId = :userId " +
            "ORDER BY ct.createdAt ASC")
    Optional<WheelCurrentSettingsEntity> findByIdWithTitles(@Param("userId") UUID userId);
}
