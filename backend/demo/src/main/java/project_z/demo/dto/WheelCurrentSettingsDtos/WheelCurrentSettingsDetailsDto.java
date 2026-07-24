package project_z.demo.dto.WheelCurrentSettingsDtos;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import project_z.demo.dto.WheelCurrentSettingsTitleDtos.WheelCurrentSettingsTitleDetailsDto;
import project_z.demo.enums.WheelMode;

public record WheelCurrentSettingsDetailsDto(
        UUID userId,
        WheelMode mode,
        Integer spinDuration,
        LocalDateTime updatedAt,
        List<WheelCurrentSettingsTitleDetailsDto> titles) {
}