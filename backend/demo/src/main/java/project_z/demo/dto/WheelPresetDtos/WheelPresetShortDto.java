package project_z.demo.dto.WheelPresetDtos;

import java.time.LocalDateTime;
import java.util.UUID;

import project_z.demo.enums.WheelMode;

public record WheelPresetShortDto(
    UUID id,
    String name,
    WheelMode mode,
    int titlesCount,
    LocalDateTime createdAt
) {}
