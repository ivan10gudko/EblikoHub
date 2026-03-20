package project_z.demo.dto.UserDtos;

import java.time.LocalDateTime;
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
public class UserUpdateDto {
    private String name;
    private String description;
}
