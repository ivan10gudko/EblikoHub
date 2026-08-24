package project_z.demo.services.impl.WheelServicesImpl;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import project_z.demo.common.Exceptions.ResourceNotFoundException;
import project_z.demo.dto.WheelCurrentSettingsTitleDtos.WheelCurrentSettingsTitleCreateDto;
import project_z.demo.entity.wheelEntitys.WheelCurrentTitleEntity;
import project_z.demo.entity.wheelEntitys.WheelCurrentTitleId;
import project_z.demo.repositories.TitleRepository;
import project_z.demo.repositories.wheelRepositories.WheelCurrentSettingsRepository;
import project_z.demo.repositories.wheelRepositories.WheelCurrentTitleRepository;
import project_z.demo.services.WheelServices.WheelCurrentSettingsTitleService;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class WheelCurrentSettingsTitleServiceImpl implements WheelCurrentSettingsTitleService {

    private final WheelCurrentTitleRepository repository;
    private final WheelCurrentSettingsRepository settingsRepository;
    private final TitleRepository titleRepository;

    @Override
    @Transactional
    public void addTitlesToWheel(UUID userId, List<WheelCurrentSettingsTitleCreateDto> dtos) {
        var settings = settingsRepository.getReferenceById(userId);
        
        List<WheelCurrentTitleEntity> entities = dtos.stream().map(dto -> {
            var title = titleRepository.getReferenceById(dto.titleId());
            return WheelCurrentTitleEntity.builder()
                    .wheelSettings(settings)
                    .title(title)
                    .multiplier(dto.multiplier() != null ? dto.multiplier() : 1)
                    .build();
        }).toList();
        
        repository.saveAll(entities);
    }

    @Override
    @Transactional
    public void removeTitlesFromWheel(UUID userId, List<Long> titleIds) {
        List<WheelCurrentTitleId> ids = titleIds.stream()
                .map(titleId -> new WheelCurrentTitleId(userId, titleId))
                .toList();

        repository.deleteAllById(ids);
    }

}
