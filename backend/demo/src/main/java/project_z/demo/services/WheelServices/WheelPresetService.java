package project_z.demo.services.WheelServices;

import java.util.List;
import java.util.UUID;

import project_z.demo.dto.WheelPresetDtos.WheelPresetCreateDto;
import project_z.demo.dto.WheelPresetDtos.WheelPresetDetailsDto;
import project_z.demo.dto.WheelPresetDtos.WheelPresetPatchDto;

public interface WheelPresetService {
    WheelPresetDetailsDto getPreset(UUID presetId);
    List<WheelPresetDetailsDto> getUserPresets(UUID userId);
    WheelPresetDetailsDto createPreset(UUID userId, WheelPresetCreateDto dto);
    WheelPresetDetailsDto updatePreset(UUID presetId, WheelPresetPatchDto patchDto);
    void deletePreset(UUID presetId);
}
