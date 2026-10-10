package project_z.demo.repositories.wheelRepositories;


import org.springframework.data.jpa.repository.JpaRepository;

import project_z.demo.entity.wheelEntitys.WheelCurrentTitleEntity;
import project_z.demo.entity.wheelEntitys.WheelCurrentTitleId;

public interface WheelCurrentTitleRepository extends JpaRepository<WheelCurrentTitleEntity, WheelCurrentTitleId> {
    
}