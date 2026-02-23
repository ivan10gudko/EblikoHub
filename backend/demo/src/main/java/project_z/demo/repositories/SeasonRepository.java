package project_z.demo.repositories;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import project_z.demo.entity.SeasonEntity;

@Repository
public interface  SeasonRepository extends CrudRepository<SeasonEntity, Long>{
    
}
