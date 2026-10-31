package project_z.demo.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import project_z.demo.entity.SeasonRatingEntity;

import java.util.List;

public interface SeasonRatingRepository extends JpaRepository<SeasonRatingEntity, Long> {

    @Modifying
    @Query("DELETE FROM SeasonRatingEntity r WHERE r.season.seasonId = :seasonId")
    void deleteBySeasonId(@Param("seasonId") Long seasonId);

    List<SeasonRatingEntity> findBySeason_SeasonId(Long seasonId);
}