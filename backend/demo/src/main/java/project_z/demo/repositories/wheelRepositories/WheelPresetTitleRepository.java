package project_z.demo.repositories.wheelRepositories;

import org.springframework.data.jpa.repository.JpaRepository;

import project_z.demo.entity.wheelEntitys.WheelPresetTitleEntity;
import project_z.demo.entity.wheelEntitys.WheelPresetTitleId;

public interface WheelPresetTitleRepository extends JpaRepository<WheelPresetTitleEntity, WheelPresetTitleId> {

}
