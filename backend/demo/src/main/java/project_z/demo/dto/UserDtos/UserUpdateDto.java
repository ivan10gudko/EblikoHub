package project_z.demo.dto.UserDtos;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
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
    @NotBlank(message = "Name cannot be blank")
    @Size(min = 1, max = 16, message = "Name must be between 1 and 16 characters")
    private String name;
    private String description;
}
