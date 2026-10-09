package project_z.demo.entity;

import java.time.LocalDateTime;
import java.util.Map;

import org.hibernate.annotations.ColumnDefault;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapKeyColumn;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import project_z.demo.enums.TitleStatus;
import project_z.demo.enums.seasons.SeasonType;

@EntityListeners(AuditingEntityListener.class)
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "seasons")
@JsonIgnoreProperties(ignoreUnknown = true)
@Getter
public class SeasonEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long seasonId;
    private String name;
    @ElementCollection
    @CollectionTable(name = "season_ratings", joinColumns = @JoinColumn(name = "season_id"))
    @MapKeyColumn(name = "name")
    @Column(name = "value")
    private Map<String, Float> rating;

    @Column(name = "image_url", nullable = true)
    private String imageUrl;

    @Column(nullable = true)
    private String description;

    @Column(name = "api_title_id", nullable = true)
    private Integer apiTitleId;

    @Enumerated(EnumType.STRING)
    @Column(name = "season_type", nullable = false)
    @ColumnDefault("'TV'")
    @Builder.Default
    private SeasonType type = SeasonType.TV;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @ColumnDefault("'INPROGRESS'")
    @Builder.Default
    private TitleStatus status = TitleStatus.INPROGRESS;


    @ManyToOne
    @JoinColumn(name = "title_id")
    @JsonBackReference
    private TitleEntity title;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
}

//package project_z.demo.entity;
//
//import java.time.LocalDateTime;
//import java.util.Map;
//
//import org.springframework.data.annotation.CreatedDate;
//import org.springframework.data.jpa.domain.support.AuditingEntityListener;
//
//import com.fasterxml.jackson.annotation.JsonBackReference;
//import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
//
//import jakarta.persistence.CollectionTable;
//import jakarta.persistence.Column;
//import jakarta.persistence.ElementCollection;
//import jakarta.persistence.Entity;
//import jakarta.persistence.EntityListeners;
//import jakarta.persistence.EnumType;
//import jakarta.persistence.Enumerated;
//import jakarta.persistence.GeneratedValue;
//import jakarta.persistence.GenerationType;
//import jakarta.persistence.Id;
//import jakarta.persistence.JoinColumn;
//import jakarta.persistence.ManyToOne;
//import jakarta.persistence.MapKeyColumn;
//import jakarta.persistence.Table;
//import lombok.AllArgsConstructor;
//import lombok.Builder;
//import lombok.Data;
//import lombok.Getter;
//import lombok.NoArgsConstructor;
//import project_z.demo.enums.TitleStatus;
//
//@EntityListeners(AuditingEntityListener.class)
//@Data
//@AllArgsConstructor
//@NoArgsConstructor
//@Builder
//@Entity
//@Table(name = "seasons")
//@JsonIgnoreProperties(ignoreUnknown = true)
//@Getter
//public class SeasonEntity {
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long seasonId;
//    private String name;
//    @ElementCollection
//    @CollectionTable(name = "season_ratings", joinColumns = @JoinColumn(name = "season_id"))
//    @MapKeyColumn(name = "name")
//    @Column(name = "value")
//    private Map<String, Float> rating;
//    @Enumerated(EnumType.STRING)
//    private TitleStatus status;
//    @ManyToOne
//    @JoinColumn(name = "title_id")
//    @JsonBackReference
//    private TitleEntity title;
//
//    @CreatedDate
//    @Column(nullable = false, updatable = false)
//    private LocalDateTime createdAt;
//}ось як сезон зараз виглядає