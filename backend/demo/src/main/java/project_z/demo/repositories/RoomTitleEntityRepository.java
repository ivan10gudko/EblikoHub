package project_z.demo.repositories;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import project_z.demo.entity.RoomTitleEntity;

public interface RoomTitleEntityRepository extends JpaRepository<RoomTitleEntity, UUID> {
    List<RoomTitleEntity> findByRoom_RoomId(Long roomId);

    boolean existsByRoom_RoomIdAndApiTitleId(Long roomId, Long apiTitleId);

    void deleteByIdAndRoom_RoomId(UUID id, Long roomId);
}
