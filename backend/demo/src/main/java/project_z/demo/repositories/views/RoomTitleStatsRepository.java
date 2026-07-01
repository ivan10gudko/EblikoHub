package project_z.demo.repositories.views;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import project_z.demo.entity.views.RoomTitleStatsView;

public interface RoomTitleStatsRepository
        extends JpaRepository<RoomTitleStatsView, UUID>, JpaSpecificationExecutor<RoomTitleStatsView> {
}