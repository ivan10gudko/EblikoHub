package project_z.demo.repositories;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import jakarta.transaction.Transactional;
import project_z.demo.entity.RoomMemberEntity;
import project_z.demo.enums.RequestStatus;
import project_z.demo.enums.RequestType;

public interface RoomMemberRepository
        extends JpaRepository<RoomMemberEntity, UUID>, JpaSpecificationExecutor<RoomMemberEntity> {
    boolean existsByRoomRoomIdAndReceiverUserId(Long roomId, UUID receiverId);

    Optional<RoomMemberEntity> findByRoomRoomIdAndReceiverUserId(Long roomId, UUID receiverId);

    List<RoomMemberEntity> findByReceiverUserIdAndStatus(UUID userId, RequestStatus status);

    List<RoomMemberEntity> findByRoomRoomIdAndStatus(Long roomId, RequestStatus status);

    List<RoomMemberEntity> findByRoomRoomIdAndTypeAndStatus(Long roomId, RequestType type, RequestStatus status);

    List<RoomMemberEntity> findByReceiverUserIdAndTypeAndStatus(UUID userId, RequestType type, RequestStatus status);

    List<RoomMemberEntity> findByReceiver_UserId(UUID receiverId);
    
    List<RoomMemberEntity> findByRoomRoomIdInAndReceiverUserId(List<Long> roomIds, UUID userId);

    @Modifying
    @Transactional
    @Query("""
            UPDATE RoomMemberEntity rm
            SET rm.isPinned = false
            WHERE rm.receiver.userId = :userId
            AND rm.isPinned = true
            """)
    void unpinAllForUser(@Param("userId") UUID userId);
}
