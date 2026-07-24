package project_z.demo.services.WheelServices;

import java.util.UUID;

import project_z.demo.dto.WheelPresetTitleDtos.WheelPresetTitleCreateDto;

public interface WheelPresetTitleService {
    void addTitleToPreset(UUID presetId, WheelPresetTitleCreateDto dto);
    void removeTitleFromPreset(UUID presetId, Long titleId);
}
