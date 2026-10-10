package project_z.demo.repositories;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import project_z.demo.entity.RoomBanEntity;


public interface RoomBanRepository extends JpaRepository<RoomBanEntity, UUID> {
    boolean existsByRoomRoomIdAndUserUserId(long roomId, UUID userId);
    
    List<RoomBanEntity> findByRoomRoomId(long roomId);
    
    void deleteByRoomRoomIdAndUserUserId(long roomId, UUID userId);
}
