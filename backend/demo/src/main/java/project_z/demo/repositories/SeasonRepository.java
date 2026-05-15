package project_z.demo.repositories;

import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import project_z.demo.entity.SeasonEntity;

@Repository
public interface  SeasonRepository extends CrudRepository<SeasonEntity, Long>{
    List<SeasonEntity>findByTitle_TitleId(Long titleId);
    List<SeasonEntity> findByTitle_TitleIdOrderByCreatedAtAsc(Long titleId);
}
