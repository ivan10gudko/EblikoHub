package project_z.demo.dto.UserDtos;


import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Setter
public class UserDto {
    private UUID userId;
    private String name;
    private String nameTag;
    private String description;
    private String img;
    private LocalDateTime createdAt;
}
