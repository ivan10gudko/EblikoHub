package project_z.demo.repositories;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import project_z.demo.entity.RoomActivityLogEntity;
import project_z.demo.enums.RoomAction;

@Repository
public interface RoomActivityLogRepository extends JpaRepository<RoomActivityLogEntity, UUID> {

    List<RoomActivityLogEntity> findByRoom_RoomIdOrderByCreatedAtDesc(Long roomId);

    Page<RoomActivityLogEntity> findByRoom_RoomId(Long roomId, Pageable pageable);

    List<RoomActivityLogEntity> findByRoom_RoomIdAndUser_UserId(Long roomId, UUID userId);

    List<RoomActivityLogEntity> findByAction(RoomAction action);
}