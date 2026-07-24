package project_z.demo.dto.WheelPresetDtos;

import java.util.List;

import project_z.demo.dto.WheelPresetTitleDtos.WheelPresetTitleCreateDto;
import project_z.demo.enums.WheelMode;

public record WheelPresetCreateDto(
    String name,
    WheelMode mode,
    Integer spinDuration,
    List<WheelPresetTitleCreateDto> titles
) {}