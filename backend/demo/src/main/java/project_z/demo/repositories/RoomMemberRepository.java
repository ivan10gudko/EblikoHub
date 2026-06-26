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

public interface RoomMemberRepository 
        extends JpaRepository<RoomMemberEntity, UUID>, JpaSpecificationExecutor<RoomMemberEntity> {

    boolean existsByRoom_RoomIdAndUser_UserId(Long roomId, UUID userId);

    List<RoomMemberEntity> findByUser_UserId(UUID userId);

    Optional<RoomMemberEntity> findOneByRoom_RoomIdAndUser_UserId(Long roomId, UUID userId);

    List<RoomMemberEntity> findByRoom_RoomIdInAndUser_UserId(List<Long> roomIds, UUID userId);

    @Modifying
    @Transactional
    @Query("""
            UPDATE RoomMemberEntity rm
            SET rm.isPinned = false
            WHERE rm.user.id = :userId
            AND rm.isPinned = true
            """)
    void unpinAllForUser(@Param("userId") UUID userId);

    List<RoomMemberEntity> findByRoom_RoomId(Long roomId);
}