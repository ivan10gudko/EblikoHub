package project_z.demo.repositories;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import project_z.demo.entity.UserBadgesEntity;
import project_z.demo.enums.UserAboutType;

@Repository
public interface UserBadgesRepository extends JpaRepository <UserBadgesEntity, UUID> {
    List<UserBadgesEntity> findByType(UserAboutType type);
}
