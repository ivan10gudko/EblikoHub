package project_z.demo.repositories;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import project_z.demo.entity.UserEntity;

@Repository
public interface UserRepository extends CrudRepository<UserEntity, UUID> {
    Optional<UserEntity> findByNameTag(String nameTag);

    boolean existsByNameTag(String nameTag);

    List<UserEntity> findByNameIgnoreCase(String name);

    Page<UserEntity> findByNameContainingIgnoreCase(String name, Pageable pageable);

    @Query(value = """
            SELECT u,
            (CASE
                WHEN m.id IS NOT NULL THEN 'MEMBER'
                WHEN r.id IS NULL THEN 'NONE'
                WHEN r.type = 'JOIN_REQUEST' THEN 'PENDING_IN'
                WHEN r.type = 'INVITE' THEN 'PENDING_OUT'
                ELSE 'NONE'
            END) as status,
            r
            FROM UserEntity u
            LEFT JOIN RoomMemberEntity m ON m.user.userId = u.userId AND m.room.id = :roomId
            LEFT JOIN RoomRequestsEntity r ON r.user.userId = u.userId AND r.room.id = :roomId AND r.status = 'PENDING'
            WHERE LOWER(u.name) LIKE LOWER(CONCAT('%', :name, '%'))
            """, countQuery = "SELECT count(u) FROM UserEntity u WHERE LOWER(u.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    Page<Object[]> findUsersWithRoomRelations(
            @Param("name") String name,
            @Param("roomId") Long roomId,
            Pageable pageable);

    @Query("SELECT u FROM UserEntity u WHERE LOWER(u.name) LIKE LOWER(CONCAT('%', :name, '%')) AND u.userId != :currentUserId")
    Page<UserEntity> findByNameContainingIgnoreCaseAndNotSelf(
            @Param("name") String name,
            @Param("currentUserId") UUID currentUserId,
            Pageable pageable);
}
