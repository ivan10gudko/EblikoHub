package project_z.demo.dto.WheelPresetDtos;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import project_z.demo.dto.WheelPresetTitleDtos.WheelPresetTitleDetailsDto;
import project_z.demo.enums.WheelMode;

public record WheelPresetDetailsDto(
    UUID id,
    String name,
    WheelMode mode,
    Integer spinDuration,
    LocalDateTime createdAt,
    LocalDateTime updatedAt,
    List<WheelPresetTitleDetailsDto> titles
) {}