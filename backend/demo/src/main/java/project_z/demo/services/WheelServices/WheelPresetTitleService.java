package project_z.demo.services.WheelServices;

import java.util.UUID;

import project_z.demo.dto.WheelPresetTitleDtos.WheelPresetTitleCreateDto;

import java.util.List;

public interface WheelPresetTitleService {
    void addTitlesToPreset(UUID presetId, List<WheelPresetTitleCreateDto> dtos);
    void removeTitlesFromPreset(UUID presetId, List<Long> titleIds);
}
