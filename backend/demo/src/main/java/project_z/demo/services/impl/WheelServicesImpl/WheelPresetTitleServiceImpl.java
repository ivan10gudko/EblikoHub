package project_z.demo.services.impl.WheelServicesImpl;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import project_z.demo.Mappers.Mapper;
import project_z.demo.common.Exceptions.ResourceNotFoundException;
import project_z.demo.dto.WheelPresetTitleDtos.WheelPresetTitleCreateDto;
import project_z.demo.dto.WheelPresetTitleDtos.WheelPresetTitleDetailsDto;
import project_z.demo.entity.wheelEntitys.WheelPresetTitleEntity;
import project_z.demo.entity.wheelEntitys.WheelPresetTitleId;
import project_z.demo.repositories.TitleRepository;
import project_z.demo.repositories.wheelRepositories.WheelPresetRepository;
import project_z.demo.repositories.wheelRepositories.WheelPresetTitleRepository;
import project_z.demo.services.WheelServices.WheelPresetTitleService;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class WheelPresetTitleServiceImpl implements WheelPresetTitleService {

    private final WheelPresetTitleRepository repository;
    private final WheelPresetRepository presetRepository;
    private final TitleRepository titleRepository;
    private final Mapper<WheelPresetTitleEntity, WheelPresetTitleDetailsDto> detailsMapper;

    @Override
    @Transactional
    public void addTitlesToPreset(UUID presetId, List<WheelPresetTitleCreateDto> dtos) {
        var preset = presetRepository.getReferenceById(presetId);

        List<WheelPresetTitleEntity> entities = dtos.stream().map(dto -> {
            var title = titleRepository.getReferenceById(dto.titleId());
            return WheelPresetTitleEntity.builder()
                    .presetId(preset)
                    .titleId(title)
                    .multiplier(dto.multiplier() != null ? dto.multiplier() : 1)
                    .build();
        }).toList();

        repository.saveAll(entities);
    }

    @Override
    @Transactional
    public void removeTitlesFromPreset(UUID presetId, List<Long> titleIds) {
        List<WheelPresetTitleId> ids = titleIds.stream()
                .map(titleId -> new WheelPresetTitleId(presetId, titleId))
                .toList();

        repository.deleteAllById(ids);
    }

}
