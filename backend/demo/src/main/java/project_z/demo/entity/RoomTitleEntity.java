package project_z.demo.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import org.hibernate.annotations.ColumnDefault;
import org.springframework.data.annotation.CreatedDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import project_z.demo.enums.TitleType;

@Entity
@Table(name = "room_titles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomTitleEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", nullable = false)
    private RoomEntity room;

    @Column(nullable = false)
    private String titleName;

    private String imageUrl;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "title_type", nullable = false)
    @ColumnDefault("'ANIME'") 
    @Builder.Default
    private TitleType titleType = TitleType.ANIME;

    private Long apiTitleId;

    private UUID addedByUserId;

    @CreatedDate
    @Column(name = "created_at",nullable = false, updatable = false)
    private LocalDateTime createdAt;
}