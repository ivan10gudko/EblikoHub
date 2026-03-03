package project_z.demo.repositories;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import project_z.demo.entity.TitleEntity;

@Repository
public interface  TitleRepository extends CrudRepository<TitleEntity, Long>{
 // @Query("SELECT t FROM TitleEntity t WHERE t.user.id = :userId")
   // List<TitleEntity> findByUserId(@Param("userId") UUID userId); mal
   @Query("SELECT t FROM TitleEntity t WHERE t.apiTitleId = :apiTitleId AND t.user.userId = :userId")
   Optional<TitleEntity> findByApiTitleIdAndUserId(Long apiTitleId, UUID userId);
   @Query("SELECT t FROM TitleEntity t " +
           "JOIN t.user u " +
           "JOIN u.rooms r " +
           "WHERE t.apiTitleId = :apiTitleId " +
           "AND r.id IN (SELECT r2.id FROM UserEntity u2 JOIN u2.rooms r2 WHERE u2.id = :userId) " +
           "AND u.id != :userId")
    List<TitleEntity> findAllByApiTitleIdInUserRooms(Long apiTitleId,UUID userId);
}
