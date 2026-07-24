package project_z.demo.dto.WheelCurrentSettingsDtos;

import java.util.List;

import project_z.demo.dto.WheelCurrentSettingsTitleDtos.WheelCurrentSettingsTitleCreateDto;
import project_z.demo.enums.WheelMode;

public record WheelCurrentSettingsCreateDto(
    WheelMode mode,
    Integer spinDuration,
    List<WheelCurrentSettingsTitleCreateDto> titles
) {}