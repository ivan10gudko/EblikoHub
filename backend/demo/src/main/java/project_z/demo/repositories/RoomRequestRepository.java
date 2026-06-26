package project_z.demo.repositories;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import project_z.demo.entity.RoomRequestsEntity;
import project_z.demo.enums.RequestStatus;
import project_z.demo.enums.RequestType;

@Repository
public interface RoomRequestRepository extends JpaRepository<RoomRequestsEntity, UUID> {

    Optional<RoomRequestsEntity> findByRoom_RoomIdAndUser_UserId(Long roomId, UUID userId);

    List<RoomRequestsEntity> findByRoom_RoomIdAndStatus(Long roomId, RequestStatus status);

    List<RoomRequestsEntity> findByUser_UserId(UUID userId);

    List<RoomRequestsEntity> findBySender_UserId(UUID senderId);

    boolean existsByRoom_RoomIdAndUser_UserId(Long roomId, UUID userId);
    
    List<RoomRequestsEntity> findByUser_UserIdAndStatusAndType(UUID userId, RequestStatus status, RequestType type);
}