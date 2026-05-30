package project_z.demo.repositories;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import jakarta.transaction.Transactional;
import project_z.demo.dto.TitleDtos.TargetTitleContext;
import project_z.demo.entity.TitleEntity;

@Repository
public interface TitleRepository extends JpaRepository<TitleEntity, Long>,
    JpaSpecificationExecutor<TitleEntity> {
  // @Query("SELECT t FROM TitleEntity t WHERE t.user.id = :userId")
  // List<TitleEntity> findByUserId(@Param("userId") UUID userId); mal
  @Query("SELECT t FROM TitleEntity t WHERE t.apiTitleId = :apiTitleId AND t.user.userId = :userId")
  Optional<TitleEntity> findByApiTitleIdAndUserId(Integer apiTitleId, UUID userId);

  @Query("SELECT t FROM TitleEntity t " +
      "JOIN t.user u " +
      "JOIN u.rooms r " +
      "WHERE t.apiTitleId = :apiTitleId " +
      "AND r.id IN (SELECT r2.id FROM UserEntity u2 JOIN u2.rooms r2 WHERE u2.id = :userId) " +
      "AND u.id != :userId")
  List<TitleEntity> findAllByApiTitleIdInUserRooms(Integer apiTitleId, UUID userId);

  @Query("SELECT t FROM TitleEntity t WHERE t.user.userId = :userId ORDER BY t.customOrder ASC")
  List<TitleEntity> findAllByUserId(UUID userId);

  List<TitleEntity> findAllByUser_UserIdOrderByCustomOrderAsc(UUID userId);

  @Modifying
  @Transactional
  @Query(value = "UPDATE titles SET custom_order = sub.new_order " +
      "FROM (SELECT title_id, ROW_NUMBER() OVER (ORDER BY custom_order ASC, title_id ASC) * 1000000 as new_order "
      +
      "      FROM titles WHERE user_id = :userId) as sub " +
      "WHERE titles.title_id = sub.title_id " +
      "AND titles.user_id = :userId", nativeQuery = true)
  void reindexNative(@Param("userId") UUID userId);

  @Query(value = """
          SELECT s.title_id, s.title_name, s.image_url, s.display_value
          FROM (
              SELECT
                  t.title_id,
                  t.title_name,
                  t.image_url,
                  CASE
                      WHEN t.title_id = :#{#context.currentId} THEN :#{#context.currentRating}
                      ELSE r.value
                  END as display_value
              FROM titles t
              JOIN title_ratings r ON t.title_id = r.title_id
              WHERE LOWER(r.name) = LOWER(:#{#context.category})
                AND t.user_id = :#{#context.userId}
                AND (
                    (:#{#context.titleType} = 'HENTAI' AND t.title_type = 'HENTAI')
                    OR
                    (:#{#context.titleType} != 'HENTAI' AND t.title_type != 'HENTAI')
                )
          ) s
          ORDER BY s.display_value DESC, s.title_name ASC
      """, nativeQuery = true)
  List<Object[]> findAllTitlesInLeaderboard(@Param("context") TargetTitleContext context);
}
