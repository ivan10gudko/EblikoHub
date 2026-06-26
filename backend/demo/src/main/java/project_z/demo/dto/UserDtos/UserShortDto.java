package project_z.demo.dto.UserDtos;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor

public class UserShortDto {
    private UUID userId;
    private String name;
    private String nameTag;
    private String img;
}
