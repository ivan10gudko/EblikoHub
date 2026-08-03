package project_z.demo.services.WheelServices;

import java.util.UUID;

import project_z.demo.dto.WheelCurrentSettingsTitleDtos.WheelCurrentSettingsTitleCreateDto;

import java.util.List;

public interface WheelCurrentSettingsTitleService {
    void addTitlesToWheel(UUID userId, List<WheelCurrentSettingsTitleCreateDto> dtos);
    void removeTitlesFromWheel(UUID userId, List<Long> titleIds);
}