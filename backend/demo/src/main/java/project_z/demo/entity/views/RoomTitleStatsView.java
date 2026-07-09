package project_z.demo.entity.views;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PostLoad;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;
import net.jcip.annotations.Immutable;

@Entity
@Table(name = "v_room_title_stats")
@Data
@NoArgsConstructor
@Immutable
public class RoomTitleStatsView {
    @Id
    @Column(name = "id")
    private UUID id;

    @Column(name = "room_id")
    private Long roomId;

    @Column(name = "avg_rating")
    private Double avgRating;

    @Column(name = "title_name")
    private String titleName;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PostLoad
    private void checkData() {
        System.out.println("DEBUG: Entity loaded with ID: " + this.id);
    }
}