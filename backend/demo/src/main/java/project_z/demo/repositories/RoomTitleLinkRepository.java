package project_z.demo.repositories;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import project_z.demo.entity.RoomTitleLinkEntity;

public interface RoomTitleLinkRepository extends JpaRepository<RoomTitleLinkEntity, UUID> {
    boolean existsByUserTitleRecord_TitleIdAndRoomTitle_Id(Long titleId, UUID roomTitleId);

    List<RoomTitleLinkEntity> findByRoomTitle_Id(UUID roomTitleId);

    List<RoomTitleLinkEntity> findByUserTitleRecord_User_UserIdAndRoomTitle_Room_RoomId(UUID userId, Long roomId);

    void deleteByUserTitleRecord_TitleIdAndRoomTitle_Id(Long titleId, UUID roomTitleId);

    void deleteByRoomTitle_Id(UUID roomTitleId);

}
