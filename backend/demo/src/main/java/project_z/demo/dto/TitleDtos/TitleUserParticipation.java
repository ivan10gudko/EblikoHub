package project_z.demo.dto.TitleDtos;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import project_z.demo.enums.TitleStatus;
import project_z.demo.enums.TitleType;
@Setter
@Getter
@AllArgsConstructor
public class TitleUserParticipation {
    private UUID userId;
    private TitleStatus status;
    private Float overallRating;
    private TitleType type;
}
