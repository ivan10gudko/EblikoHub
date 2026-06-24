package project_z.demo.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.data.annotation.CreatedDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "room_title_links", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_title_record_id", "room_title_id"})
})
@Getter @Setter
public class RoomTitleLinkEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_title_record_id", nullable = false)
    private TitleEntity userTitleRecord;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_title_id", nullable = false)
    private RoomTitleEntity roomTitle;
    
    @CreatedDate
    @Column(name = "created_at",nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}