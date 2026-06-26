package project_z.demo.repositories;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import project_z.demo.entity.FriendshipEntity;
import project_z.demo.entity.UserEntity;
import project_z.demo.enums.RequestStatus;

@Repository
public interface FriendshipRepository extends JpaRepository<FriendshipEntity, UUID> {
        @Query(value = """
                        SELECT u.user_id, u.name, u.name_tag, u.img, f.friendship_id
                        FROM users u
                        JOIN friendships f ON (f.receiver_id = u.user_id AND f.sender_id = :userId AND f.status = 'ACCEPTED')
                                         OR (f.sender_id = u.user_id AND f.receiver_id = :userId AND f.status = 'ACCEPTED')
                        """, nativeQuery = true)
        List<Object[]> findFriendsWithIds(@Param("userId") UUID userId);

        Optional<FriendshipEntity> findBySenderUserIdAndReceiverUserIdAndStatus(
                        UUID senderId, UUID receiverId, RequestStatus status);

        boolean existsBySenderUserIdAndReceiverUserIdAndStatus(UUID senderId, UUID receiverId, RequestStatus status);

        Optional<FriendshipEntity> findBySenderUserIdAndReceiverUserId(UUID senderId, UUID receiverId);

        @Query("""
                            SELECT f FROM FriendshipEntity f
                            WHERE (f.sender.userId = :userId OR f.receiver.userId = :userId)
                            AND f.status = :status
                        """)
        List<FriendshipEntity> findAllByUserIdAndStatus(@Param("userId") UUID userId,
                        @Param("status") RequestStatus status);

        List<FriendshipEntity> findByReceiverUserIdAndStatus(UUID receiverId, RequestStatus status);

        List<FriendshipEntity> findBySenderUserIdAndStatus(UUID senderId, RequestStatus status);

        @Query("""
                            SELECT COUNT(f) > 0 FROM FriendshipEntity f
                            WHERE f.id = :friendshipId
                            AND (f.sender.userId = :userId OR f.receiver.userId = :userId)
                        """)
        boolean isUserMemberOfFriendship(@Param("friendshipId") UUID friendshipId, @Param("userId") UUID userId);

        long countBySenderUserIdAndStatusOrReceiverUserIdAndStatus(
                        UUID senderId, RequestStatus status1, UUID receiverId, RequestStatus status2);

        long countByReceiverUserIdAndStatus(UUID receiverId, RequestStatus status);

        long countBySenderUserIdAndStatus(UUID senderId, RequestStatus status);

        @Query(value = """
                        SELECT u, COALESCE(f.status, project_z.demo.enums.RequestStatus.NONE), f.friendshipId
                        FROM UserEntity u
                        LEFT JOIN FriendshipEntity f ON (f.sender.userId = :currentUserId AND f.receiver = u)
                                                     OR (f.receiver.userId = :currentUserId AND f.sender = u)
                        WHERE LOWER(u.name) LIKE LOWER(CONCAT('%', :name, '%'))
                        AND u.userId != :currentUserId
                        """, countQuery = "SELECT count(u) FROM UserEntity u WHERE LOWER(u.name) LIKE LOWER(CONCAT('%', :name, '%')) AND u.userId != :currentUserId")
        Page<Object[]> findUsersWithStatus(@Param("name") String name, @Param("currentUserId") UUID currentUserId,
                        Pageable pageable);

}
