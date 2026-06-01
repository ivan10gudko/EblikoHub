package project_z.demo.repositories;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import project_z.demo.entity.FriendshipEntity;
import project_z.demo.entity.UserEntity;
import project_z.demo.enums.FriendshipStatus;

@Repository
public interface FriendshipRepository extends JpaRepository<FriendshipEntity, UUID> {
    @Query("""
                SELECT f.receiver FROM FriendshipEntity f WHERE f.sender.userId = :userId AND f.status = 'ACCEPTED'
                UNION
                SELECT f.sender FROM FriendshipEntity f WHERE f.receiver.userId = :userId AND f.status = 'ACCEPTED'
            """)
    List<UserEntity> findFriendsByUserId(@Param("userId") UUID userId);

    Optional<FriendshipEntity> findBySenderUserIdAndReceiverUserIdAndStatus(
            UUID senderId, UUID receiverId, FriendshipStatus status);
            
    boolean existsBySenderUserIdAndReceiverUserIdAndStatus(UUID senderId, UUID receiverId, FriendshipStatus status);

    Optional<FriendshipEntity> findBySenderUserIdAndReceiverUserId(UUID senderId, UUID receiverId);
}
