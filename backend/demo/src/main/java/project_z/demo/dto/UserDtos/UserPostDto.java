package project_z.demo.dto.UserDtos;

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
public class UserPostDto {
    private UUID userId;
    private String name;
    private String nameTag;
}
