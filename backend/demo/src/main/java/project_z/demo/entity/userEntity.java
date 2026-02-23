package project_z.demo.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
@EntityListeners(AuditingEntityListener.class)
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "users")
@JsonIgnoreProperties(ignoreUnknown=true)
public class UserEntity {
    @Id
    private UUID userId;
    private String name;
    @Column(unique= true, nullable= false)
    private String nameTag;
    private String description;
    private String img;
    @ManyToMany(mappedBy = "members")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private List<RoomEntity> rooms = new ArrayList<>();
    @CreatedDate
    @Column(nullable=false, updatable=false)
    private LocalDateTime createdAt;
    @OneToMany(mappedBy= "user",cascade = CascadeType.ALL, orphanRemoval=true)
    @JsonManagedReference
    private List<TitleEntity> titleList;
    
}
