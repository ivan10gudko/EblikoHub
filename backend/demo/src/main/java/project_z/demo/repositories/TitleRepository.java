package project_z.demo.repositories;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import project_z.demo.entity.TitleEntity;

@Repository
public interface  TitleRepository extends CrudRepository<TitleEntity, Long>{
 // @Query("SELECT t FROM TitleEntity t WHERE t.user.id = :userId")
   // List<TitleEntity> findByUserId(@Param("userId") UUID userId);
}
