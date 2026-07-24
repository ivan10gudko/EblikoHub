package project_z.demo.services.impl.WheelServicesImpl;

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
    public void addTitleToPreset(UUID presetId, WheelPresetTitleCreateDto dto) {
        var preset = presetRepository.getReferenceById(presetId);
        var title = titleRepository.getReferenceById(dto.titleId());

        WheelPresetTitleEntity entity = WheelPresetTitleEntity.builder()
                .presetId(preset)
                .titleId(title)
                .build();

        repository.save(entity);
    }

    @Override
    @Transactional
    public void removeTitleFromPreset(UUID presetId, Long titleId) {
        WheelPresetTitleId id = new WheelPresetTitleId(presetId, titleId);

        if (repository.existsById(id)) {
            repository.deleteById(id);
        } else {
            throw new ResourceNotFoundException("Title not found in this preset");
        }
    }

}
