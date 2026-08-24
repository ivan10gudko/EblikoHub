package project_z.demo.services.WheelServices;

import java.util.List;
import java.util.UUID;
import project_z.demo.dto.WheelPresetTitleDtos.WheelPresetTitleCreateDto;

public interface WheelPresetTitleService {
    void addTitlesToPreset(UUID presetId, List<WheelPresetTitleCreateDto> dtos);
    void removeTitlesFromPreset(UUID presetId, List<Long> titleIds);
}
