package project_z.demo.services.WheelServices;

import java.util.UUID;

import project_z.demo.dto.WheelCurrentSettingsTitleDtos.WheelCurrentSettingsTitleCreateDto;

public interface WheelCurrentSettingsTitleService {
    void addTitleToWheel(UUID userId, WheelCurrentSettingsTitleCreateDto dto);
    void removeTitleFromWheel(UUID userId, Long titleId);
}