package project_z.demo.services.impl.WheelServicesImpl;

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
    public void addTitleToWheel(UUID userId, WheelCurrentSettingsTitleCreateDto dto) {
        var settings = settingsRepository.getReferenceById(userId);
        var title = titleRepository.getReferenceById(dto.titleId());
        WheelCurrentTitleEntity entity = WheelCurrentTitleEntity.builder()
                .wheelSettings(settings)
                .title(title)
                .build();
        repository.save(entity);
    }

    @Override
    @Transactional
    public void removeTitleFromWheel(UUID userId, Long titleId) {
        WheelCurrentTitleId id = new WheelCurrentTitleId(userId, titleId);

        if (repository.existsById(id)) {
            repository.deleteById(id);
        } else {
            throw new ResourceNotFoundException("Title not found in this wheel");
        }
    }

}
