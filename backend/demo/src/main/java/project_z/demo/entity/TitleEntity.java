package project_z.demo.entity;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
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
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import project_z.demo.enums.TitleStatus;
@EntityListeners(AuditingEntityListener.class)
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name="titles")
@JsonIgnoreProperties(ignoreUnknown=true)
public class TitleEntity { 

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long titleId;
    @Column(name = "api_title_id", nullable = true)
    private Integer apiTitleId;

    private String titleName;
    
    @ElementCollection
    @CollectionTable(
    name = "title_ratings",
    joinColumns = @JoinColumn(name = "title_id")
    )
    
    @MapKeyColumn(name = "name")
    @Column(name = "value")
    private Map<String, Float> rating;

    @Enumerated(EnumType.STRING)
    private TitleStatus status;
    
    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonBackReference
    private UserEntity user;

    @OneToMany(mappedBy= "title",cascade = CascadeType.ALL, orphanRemoval=true)
    @JsonManagedReference
    private List<SeasonEntity> seasons = new ArrayList<>();

    @Column(name = "custom_order")
    private Long customOrder;

    @Column(name = "image_url")
    private String imageUrl;

    @CreatedDate
    @Column(nullable=false, updatable=false)
    private LocalDateTime createdAt;
    @PrePersist
    protected void onCreate(){
        if(this.customOrder==null){
            this.customOrder = System.currentTimeMillis();
        }
    }

}

