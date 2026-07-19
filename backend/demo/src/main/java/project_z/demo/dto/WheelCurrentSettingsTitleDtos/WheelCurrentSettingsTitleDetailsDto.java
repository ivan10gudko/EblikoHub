package project_z.demo.dto.WheelCurrentSettingsTitleDtos;

import java.time.LocalDateTime;

import project_z.demo.dto.TitleDtos.TitleShortDto;

public record WheelCurrentSettingsTitleDetailsDto(
    TitleShortDto title,
    LocalDateTime createdAt
) {}

