package project_z.demo.repositories;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

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
            SELECT u.* FROM users u
            WHERE u.user_id IN (
                SELECT f.receiver_id FROM friendships f WHERE f.sender_id = :userId AND f.status = 'ACCEPTED'
                UNION
                SELECT f.sender_id FROM friendships f WHERE f.receiver_id = :userId AND f.status = 'ACCEPTED'
            )
            """, nativeQuery = true)
    List<UserEntity> findFriendsByUserId(@Param("userId") UUID userId, Sort sort);

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

}
