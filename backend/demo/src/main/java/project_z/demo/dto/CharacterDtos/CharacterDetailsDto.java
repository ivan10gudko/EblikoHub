package project_z.demo.dto.CharacterDtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CharacterDetailsDto {
    private UUID id;
    private Integer apiId;
    private String name;
    private String imageUrl;
    private LocalDateTime createdAt;
}
