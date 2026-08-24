package project_z.demo.services.WheelServices;

import java.util.List;
import java.util.UUID;
import project_z.demo.dto.WheelCurrentSettingsTitleDtos.WheelCurrentSettingsTitleCreateDto;

public interface WheelCurrentSettingsTitleService {
    void addTitlesToWheel(UUID userId, List<WheelCurrentSettingsTitleCreateDto> dtos);
    void removeTitlesFromWheel(UUID userId, List<Long> titleIds);
}