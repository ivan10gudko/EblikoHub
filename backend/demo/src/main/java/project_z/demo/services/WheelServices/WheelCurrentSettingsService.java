package project_z.demo.services.WheelServices;

import java.util.UUID;

import project_z.demo.dto.WheelCurrentSettingsDtos.WheelCurrentSettingsCreateDto;
import project_z.demo.dto.WheelCurrentSettingsDtos.WheelCurrentSettingsDetailsDto;
import project_z.demo.dto.WheelCurrentSettingsDtos.WheelCurrentSettingsPatchDto;

public interface WheelCurrentSettingsService {
    WheelCurrentSettingsDetailsDto getSettings(UUID userId);

    WheelCurrentSettingsDetailsDto createSettings(UUID userId, WheelCurrentSettingsCreateDto dto);

    WheelCurrentSettingsDetailsDto partialUpdate(UUID userId, WheelCurrentSettingsPatchDto patchDto);
}
