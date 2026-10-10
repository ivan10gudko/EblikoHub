package project_z.demo.dto.RoomTitleDtos;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.data.domain.Page;

import com.fasterxml.jackson.annotation.JsonUnwrapped;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import project_z.demo.dto.UserDtos.UserShortDto;
@Setter
@Getter
@AllArgsConstructor
public class RoomTitlesResponseDto {
    @JsonUnwrapped
    private Page<RoomTitleSummaryDto> content;
    private Map<UUID, UserShortDto> usersCache;
}
