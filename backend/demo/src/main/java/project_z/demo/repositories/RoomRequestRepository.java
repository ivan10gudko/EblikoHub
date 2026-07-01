package project_z.demo.repositories;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import project_z.demo.dto.RoomRequestsDtos.RoomRequestCountsDto;
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

    @Query("SELECT new project_z.demo.dto.RoomRequestsDtos.RoomRequestCountsDto(" +
            "COUNT(DISTINCT CASE WHEN (r.type = 'INVITE' AND r.user.userId = :userId) " +
            "                     OR (r.type = 'JOIN_REQUEST' AND r.room.owner.userId = :userId AND r.sender.userId <> :userId) THEN r.id ELSE NULL END), "
            +

            "COUNT(DISTINCT CASE WHEN r.sender.userId = :userId AND (r.type = 'INVITE' OR (r.type = 'JOIN_REQUEST' AND r.room.owner.userId <> :userId)) THEN r.id ELSE NULL END)) "
            +
            "FROM RoomRequestsEntity r " +
            "WHERE r.status = 'PENDING' " +
            "AND (r.user.userId = :userId OR r.sender.userId = :userId OR r.room.owner.userId = :userId)")
    RoomRequestCountsDto getRoomRequestCounts(@Param("userId") UUID userId);

}