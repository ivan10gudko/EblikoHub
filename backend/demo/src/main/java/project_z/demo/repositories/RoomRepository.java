package project_z.demo.repositories;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import project_z.demo.dto.RoomDtos.RoomSearchResultDto;
import project_z.demo.entity.RoomEntity;
import project_z.demo.entity.RoomRequestsEntity;

@Repository
public interface RoomRepository extends JpaRepository<RoomEntity, Long>, JpaSpecificationExecutor<RoomEntity> {

    @Query("""
                SELECT new project_z.demo.dto.RoomDtos.RoomSearchResultDto(
                    r.roomId,
                    r.roomName,
                    r.imageUrl,
                    SIZE(r.members),
                    EXISTS (SELECT m FROM RoomEntity r2 JOIN r2.members m WHERE r2.roomId = r.roomId AND m.user.id = :userId),
                    EXISTS (SELECT rm FROM RoomRequestsEntity rm WHERE rm.room.roomId = r.roomId AND rm.sender.id = :userId AND rm.status = 'PENDING')
                )
                FROM RoomEntity r
                WHERE LOWER(r.roomName) LIKE LOWER(CONCAT('%', :roomName, '%'))
            """)
    Page<RoomSearchResultDto> searchRoomsWithMembershipStatus(
            @Param("roomName") String roomName,
            @Param("userId") UUID userId,
            Pageable pageable);

    @Query("SELECT r FROM RoomEntity r " +
            "LEFT JOIN FETCH r.members m " +
            "LEFT JOIN FETCH m.user " +
            "WHERE r.id = :id " +
            "ORDER BY CASE WHEN m.role = 'OWNER' THEN 1 " +
            "              WHEN m.role = 'ADMIN' THEN 2 " +
            "              ELSE 3 END, " +
            "         m.user.name ASC")
    Optional<RoomEntity> findByIdWithMembers(@Param("id") Long id);
}
