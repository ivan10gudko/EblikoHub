package project_z.demo.repositories;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import project_z.demo.entity.RoomTitleLinkEntity;
import project_z.demo.entity.UserEntity;

public interface RoomTitleLinkRepository extends JpaRepository<RoomTitleLinkEntity, UUID> {
  @Query("SELECT COUNT(l) > 0 FROM RoomTitleLinkEntity l " +
      "JOIN l.userTitleRecord t " +
      "WHERE l.roomTitle.id = :roomTitleId " +
      "AND t.user.userId = :userId")
  boolean existsByRoomTitleIdAndUserId(@Param("roomTitleId") UUID roomTitleId,
      @Param("userId") UUID userId);

  List<RoomTitleLinkEntity> findByRoomTitle_Id(UUID roomTitleId);

  List<RoomTitleLinkEntity> findByRoomTitle_IdInAndUserTitleRecord_User_UserId(List<UUID> roomTitleIds,
      UUID userId);

  @Query("SELECT l FROM RoomTitleLinkEntity l " +
      "WHERE l.roomTitle.room.id = :roomId " +
      "AND l.userTitleRecord.user.userId = :userId")
  List<RoomTitleLinkEntity> findLinksByRoomIdAndUserId(@Param("roomId") long roomId,
      @Param("userId") UUID userId);

  List<RoomTitleLinkEntity> findByUserTitleRecord_User_UserIdAndRoomTitle_Room_RoomId(UUID userId, Long roomId);

  void deleteByUserTitleRecord_TitleIdAndRoomTitle_Id(Long titleId, UUID roomTitleId);

  void deleteByRoomTitle_Id(UUID roomTitleId);

  @Query("SELECT l FROM RoomTitleLinkEntity l " +
      "JOIN FETCH l.userTitleRecord t " +
      "JOIN FETCH t.user " +
      "WHERE l.roomTitle.id IN :roomTitleIds " +
      "AND t.user.id IN :userIds")
  List<RoomTitleLinkEntity> findByRoomTitleIdInAndUserIdIn(
      @Param("roomTitleIds") List<UUID> roomTitleIds,
      @Param("userIds") List<UUID> userIds);

  @Query("SELECT DISTINCT t.user FROM RoomTitleLinkEntity l " +
      "JOIN l.userTitleRecord t " +
      "WHERE l.roomTitle.id IN :roomTitleIds " +
      "AND t.user.id IN :userIds")
  List<UserEntity> findUniqueUsersByLinks(@Param("roomTitleIds") List<UUID> roomTitleIds,
      @Param("userIds") List<UUID> userIds);

  @Modifying
  @Query(value = """
      INSERT INTO room_title_links (id, user_title_record_id, room_title_id, created_at)
      SELECT gen_random_uuid(), t.title_id, rt.id, CURRENT_TIMESTAMP
      FROM titles t
      JOIN room_titles rt ON t.api_title_id = rt.api_title_id
      WHERE t.user_id = :userId
        AND rt.room_id = :roomId
        AND NOT EXISTS (
            SELECT 1 FROM room_title_links rtl
            WHERE rtl.user_title_record_id = t.title_id
              AND rtl.room_title_id = rt.id
        )
      """, nativeQuery = true)
  void linkUserTitlesToRoom(@Param("userId") UUID userId, @Param("roomId") Long roomId);

  @Modifying
  @Query(value = """
      INSERT INTO room_title_links (id, user_title_record_id, room_title_id, created_at)
      SELECT gen_random_uuid(), t.title_id, rt.id, CURRENT_TIMESTAMP
      FROM room_titles rt
      JOIN room_members rm ON rm.room_id = rt.room_id
      JOIN titles t ON t.user_id = rm.user_id AND t.api_title_id = rt.api_title_id
      WHERE rt.id = :roomTitleId
        AND NOT EXISTS (
            SELECT 1 FROM room_title_links rtl
            WHERE rtl.user_title_record_id = t.title_id
              AND rtl.room_title_id = rt.id
        )
      """, nativeQuery = true)
  void linkExistingMembersToNewRoomTitle(@Param("roomTitleId") UUID roomTitleId);
}
