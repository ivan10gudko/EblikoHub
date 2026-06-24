package project_z.demo.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.data.annotation.CreatedDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Data;

@Entity
@Table(name = "room_bans", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "room_id", "user_id" })
})
@Data
public class RoomBanEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "room_id")
    private RoomEntity room;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserEntity user;

    private String reason;

    @CreatedDate
    @Column(name = "created_at",nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}