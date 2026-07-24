package project_z.demo.dto.WheelPresetTitleDtos;

import java.time.LocalDateTime;

import project_z.demo.dto.TitleDtos.TitleShortDto;

public record WheelPresetTitleDetailsDto(
    TitleShortDto title,
    LocalDateTime createdAt
) {}