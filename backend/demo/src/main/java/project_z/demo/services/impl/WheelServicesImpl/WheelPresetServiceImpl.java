package project_z.demo.services.impl.WheelServicesImpl;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import project_z.demo.JavaUtil.PatchHelper;
import project_z.demo.Mappers.Mapper;
import project_z.demo.common.Exceptions.ResourceNotFoundException;
import project_z.demo.common.Exceptions.WheelPresetExceptions.WheelPresetAlreadyExists;
import project_z.demo.dto.WheelPresetDtos.WheelPresetCreateDto;
import project_z.demo.dto.WheelPresetDtos.WheelPresetDetailsDto;
import project_z.demo.dto.WheelPresetDtos.WheelPresetPatchDto;
import project_z.demo.dto.WheelPresetTitleDtos.WheelPresetTitleCreateDto;
import project_z.demo.entity.TitleEntity;
import project_z.demo.entity.UserEntity;
import project_z.demo.entity.wheelEntitys.WheelPresetEntity;
import project_z.demo.entity.wheelEntitys.WheelPresetTitleEntity;
import project_z.demo.repositories.TitleRepository;
import project_z.demo.repositories.UserRepository;
import project_z.demo.repositories.wheelRepositories.WheelPresetRepository;
import project_z.demo.repositories.wheelRepositories.WheelPresetTitleRepository;
import project_z.demo.services.WheelServices.WheelPresetService;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class WheelPresetServiceImpl implements WheelPresetService {

    private final WheelPresetRepository presetRepository;
    private final WheelPresetTitleRepository presetTitleRepository;
    private final UserRepository userRepository;
    private final TitleRepository titleRepository;
    private final PatchHelper patchHelper;

    private final Mapper<WheelPresetEntity, WheelPresetCreateDto> createMapper;
    private final Mapper<WheelPresetEntity, WheelPresetDetailsDto> detailsMapper;
    private final Mapper<WheelPresetTitleEntity, WheelPresetTitleCreateDto> titleCreateMapper;

    @Override
    public WheelPresetDetailsDto getPreset(UUID presetId) {
        return presetRepository.findByIdWithTitles(presetId)
                .map(detailsMapper::mapTo)
                .orElseThrow(() -> new ResourceNotFoundException("Preset not found"));
    }

    @Override
    public List<WheelPresetDetailsDto> getUserPresets(UUID userId) {
        return presetRepository.findAllByUser_UserIdWithTitles(userId).stream()
                .map(detailsMapper::mapTo)
                .toList();
    }

    @Override
    @Transactional
    public WheelPresetDetailsDto createPreset(UUID userId, WheelPresetCreateDto dto) {

        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (presetRepository.existsByUser_UserIdAndName(userId, dto.name())) {
            throw new WheelPresetAlreadyExists("Preset with name '" + dto.name() + "' already exists for this user");
        }

        List<Long> requestedTitleIds = dto.titles().stream()
                .map(tDto -> tDto.titleId())
                .toList();

        List<TitleEntity> foundTitles = titleRepository.findAllByIdsAndUserId(userId, requestedTitleIds);

        if (foundTitles.size() != requestedTitleIds.size()) {
            throw new ResourceNotFoundException("Some titles not found or do not belong to this user");
        }

        WheelPresetEntity preset = createMapper.mapFrom(dto);
        preset.setUser(user);

        List<WheelPresetTitleEntity> titleEntities = foundTitles.stream()
                .map(title -> {
                    WheelPresetTitleEntity te = new WheelPresetTitleEntity();
                    te.setPresetId(preset);
                    te.setTitleId(title);
                    return te;
                })
                .toList();
        preset.setPresetTitles(titleEntities);

        WheelPresetEntity savedPreset = presetRepository.save(preset);

        return detailsMapper.mapTo(savedPreset);
    }

    @Override
    @Transactional
    public WheelPresetDetailsDto updatePreset(UUID presetId, WheelPresetPatchDto patchDto) {
        WheelPresetEntity preset = presetRepository.findById(presetId)
                .orElseThrow(() -> new ResourceNotFoundException("Preset not found"));

        patchHelper.updateIfPresent(patchDto.getName(), preset::setName);
        patchHelper.updateIfPresent(patchDto.getMode(), preset::setMode);
        patchHelper.updateIfPresent(patchDto.getSpinDuration(), preset::setSpinDuration);

        presetRepository.saveAndFlush(preset);
        return detailsMapper.mapTo(preset);
    }

    @Override
    @Transactional
    public void deletePreset(UUID presetId) {
        if (!presetRepository.existsById(presetId)) {
            throw new ResourceNotFoundException("Preset not found");
        }
        presetRepository.deleteById(presetId);
    }
}
