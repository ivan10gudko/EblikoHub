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
            "COUNT(DISTINCT r.id) FILTER (WHERE r.user.userId = :userId AND r.status = 'PENDING'), " +
            "COUNT(DISTINCT r.id) FILTER (WHERE r.sender.userId = :userId AND r.type = 'JOIN_REQUEST' AND r.status = 'PENDING')) "
            +
            "FROM RoomRequestsEntity r " +
            "WHERE (r.user.userId = :userId OR r.sender.userId = :userId) " +
            "AND r.status = 'PENDING'")
    RoomRequestCountsDto getRoomRequestCounts(@Param("userId") UUID userId);

    @Query("SELECT r FROM RoomRequestsEntity r WHERE " +
            "r.status = :status " +
            "AND r.type = :type " +
            "AND (r.user.userId = :userId)")
    List<RoomRequestsEntity> findIncomingRequests(
            @Param("userId") UUID userId,
            @Param("status") RequestStatus status,
            @Param("type") RequestType type);

    @Query("SELECT r FROM RoomRequestsEntity r WHERE " +
            "r.status = :status " +
            "AND (:type IS NULL OR r.type = :type) " +
            "AND r.sender.userId = :userId")
    List<RoomRequestsEntity> findOutgoingRequests(
            @Param("userId") UUID userId,
            @Param("status") RequestStatus status,
            @Param("type") RequestType type);

}