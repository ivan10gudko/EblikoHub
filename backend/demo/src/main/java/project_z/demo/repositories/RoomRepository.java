package project_z.demo.repositories;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import jakarta.transaction.Transactional;
import project_z.demo.entity.RoomEntity;

@Repository
public interface RoomRepository extends JpaRepository<RoomEntity, Long>, JpaSpecificationExecutor<RoomEntity> {
        List<RoomEntity> findAllByMembers_UserId(UUID userId);

        @Query(value = "SELECT r.* FROM rooms r " +
                        "JOIN room_members rm ON r.room_id = rm.room_id " +
                        "WHERE r.room_id IN (SELECT room_id FROM room_members WHERE user_id = :userId) " +
                        "GROUP BY r.room_id " +
                        "ORDER BY COUNT(rm.user_id) DESC", countQuery = "SELECT COUNT(DISTINCT room_id) FROM room_members WHERE user_id = :userId", nativeQuery = true)
        Page<RoomEntity> findAllByMemberCountDesc(@Param("userId") UUID userId, Pageable pageable);

        @Query(value = "SELECT r.* FROM rooms r " +
                        "JOIN room_members rm ON r.room_id = rm.room_id " +
                        "WHERE r.room_id IN (SELECT room_id FROM room_members WHERE user_id = :userId) " +
                        "GROUP BY r.room_id " +
                        "ORDER BY COUNT(rm.user_id) ASC", countQuery = "SELECT COUNT(DISTINCT room_id) FROM room_members WHERE user_id = :userId", nativeQuery = true)
        Page<RoomEntity> findAllByMemberCountAsc(@Param("userId") UUID userId, Pageable pageable);

        @Modifying
        @Transactional
        @Query(value = """
                         UPDATE rooms r
                         SET r.is_pinned = CASE
                             WHEN r.room_id = :roomId THEN true
                             WHEN r.room_id = :oldroomId THEN false
                             ELSE r.is_pinned
                         END
                         WHERE t.room_id IN (:roomId, :oldRoomId)
                        """, nativeQuery = true)
        int pinTitle(Long roomId, Long oldRoomId);

        @Modifying
        @Transactional
        @Query(value = "UPDATE rooms SET is_pinned = false WHERE user_id = :userId AND is_pinned = true", nativeQuery = true)
        void unpinAllTitlesForUser(UUID userId);
}
