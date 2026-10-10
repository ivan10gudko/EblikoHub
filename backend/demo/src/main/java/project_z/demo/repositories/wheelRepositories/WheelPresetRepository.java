package project_z.demo.repositories.wheelRepositories;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import project_z.demo.entity.wheelEntitys.WheelPresetEntity;

public interface WheelPresetRepository extends JpaRepository<WheelPresetEntity, UUID> {
    List<WheelPresetEntity> findAllByUser_UserId(UUID userId);

    boolean existsByUser_UserIdAndName(UUID userId, String name);

    @Query("SELECT DISTINCT wp FROM WheelPresetEntity wp " +
            "LEFT JOIN FETCH wp.presetTitles pt " +
            "LEFT JOIN FETCH pt.titleId t " +
            "WHERE wp.user.userId = :userId " +
            "ORDER BY wp.createdAt ASC, pt.createdAt ASC")

    List<WheelPresetEntity> findAllByUser_UserIdWithTitles(@Param("userId") UUID userId);

    @Query("SELECT DISTINCT wp FROM WheelPresetEntity wp " +
            "LEFT JOIN FETCH wp.presetTitles pt " +
            "LEFT JOIN FETCH pt.titleId t " +
            "WHERE wp.id = :presetId")
    Optional<WheelPresetEntity> findByIdWithTitles(@Param("presetId") UUID presetId);
}
