package project_z.demo.services.impl.WheelServicesImpl;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import project_z.demo.JavaUtil.PatchHelper;
import project_z.demo.Mappers.Mapper;
import project_z.demo.common.Exceptions.ResourceNotFoundException;
import project_z.demo.dto.WheelCurrentSettingsDtos.WheelCurrentSettingsCreateDto;
import project_z.demo.dto.WheelCurrentSettingsDtos.WheelCurrentSettingsDetailsDto;
import project_z.demo.dto.WheelCurrentSettingsDtos.WheelCurrentSettingsPatchDto;
import project_z.demo.dto.WheelCurrentSettingsTitleDtos.WheelCurrentSettingsTitleCreateDto;
import project_z.demo.entity.TitleEntity;
import project_z.demo.entity.UserEntity;
import project_z.demo.entity.wheelEntitys.WheelCurrentSettingsEntity;
import project_z.demo.entity.wheelEntitys.WheelCurrentTitleEntity;
import project_z.demo.repositories.TitleRepository;
import project_z.demo.repositories.UserRepository;
import project_z.demo.repositories.wheelRepositories.WheelCurrentSettingsRepository;
import project_z.demo.repositories.wheelRepositories.WheelCurrentTitleRepository;
import project_z.demo.services.WheelServices.WheelCurrentSettingsService;

@Service
@RequiredArgsConstructor
public class WheelCurrentSettingsServiceImp implements WheelCurrentSettingsService {

    private final WheelCurrentSettingsRepository repository;
    private final WheelCurrentTitleRepository titleRepositoryInWheel;
    private final UserRepository userRepository;
    private final TitleRepository titleRepository;
    private final PatchHelper patchHelper;
    private final Mapper<WheelCurrentSettingsEntity, WheelCurrentSettingsCreateDto> settingsCreateMapper;
    private final Mapper<WheelCurrentSettingsEntity, WheelCurrentSettingsDetailsDto> settingsDetailsMapper;
    private final Mapper<WheelCurrentTitleEntity, WheelCurrentSettingsTitleCreateDto> titleCreateMapper;

    @Override
    public WheelCurrentSettingsDetailsDto getSettings(UUID userId) {
        WheelCurrentSettingsEntity settings = repository.findByIdWithTitles(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Settings not found for user: " + userId));
        return settingsDetailsMapper.mapTo(settings);
    }

    @Override
    @Transactional
    public WheelCurrentSettingsDetailsDto createSettings(UUID userId, WheelCurrentSettingsCreateDto dto) {
        if (repository.existsById(userId)) {
            throw new IllegalStateException("Settings already exist for this user");
        }

        UserEntity user = userRepository.findById(userId).orElseThrow(
                () -> new ResourceNotFoundException("user not found"));

        List<Long> requestedTitleIds = dto.titles().stream().map(t -> t.titleId()).toList();
        List<TitleEntity> foundTitles = titleRepository.findAllByIdsAndUserId(userId, requestedTitleIds);

        if (foundTitles.size() != requestedTitleIds.size()) {
            throw new ResourceNotFoundException("Some titles not found or do not belong to this user");
        }

        WheelCurrentSettingsEntity settings = settingsCreateMapper.mapFrom(dto);
        settings.setUser(user);
        settings.setUserId(userId);

        List<WheelCurrentTitleEntity> titleEntities = foundTitles.stream()
                .map(title -> {
                    WheelCurrentTitleEntity te = new WheelCurrentTitleEntity();
                    te.setWheelSettings(settings);
                    te.setTitle(title);
                    return te;
                })
                .toList();

        settings.setCurrentTitles(titleEntities);

        WheelCurrentSettingsEntity res = repository.save(settings);

        return settingsDetailsMapper.mapTo(res);
    }

    @Override
    @Transactional
    public WheelCurrentSettingsDetailsDto partialUpdate(UUID userId, WheelCurrentSettingsPatchDto patchDto) {
        WheelCurrentSettingsEntity settings = repository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Settings not found"));

        patchHelper.updateIfPresent(patchDto.getMode(), settings::setMode);
        patchHelper.updateIfPresent(patchDto.getSpinDuration(), settings::setSpinDuration);

        repository.saveAndFlush(settings);
        return settingsDetailsMapper.mapTo(settings);
    }
}
