package project_z.demo.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import project_z.demo.entity.TitleRatingEntity;

import java.util.List;

public interface TitleRatingRepository extends JpaRepository<TitleRatingEntity, Long> {

    @Modifying
    @Query("DELETE FROM TitleRatingEntity r WHERE r.title.titleId = :titleId")
    void deleteByTitleId(@Param("titleId") Long titleId);

    List<TitleRatingEntity> findByTitle_TitleId(Long titleId);
}