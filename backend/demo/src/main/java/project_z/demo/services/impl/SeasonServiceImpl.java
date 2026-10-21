package project_z.demo.services.impl;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import project_z.demo.JavaUtil.BeanUtilsHelper;
import project_z.demo.JavaUtil.PatchHelper;
import project_z.demo.Mappers.Mapper;
import project_z.demo.common.Exceptions.ResourceNotFoundException;
import project_z.demo.dto.SeasonDtos.SeasonDto;
import project_z.demo.dto.SeasonDtos.SeasonPatchUpdateDto;
import project_z.demo.entity.SeasonEntity;
import project_z.demo.entity.TitleEntity;
import project_z.demo.repositories.SeasonRepository;
import project_z.demo.repositories.TitleRepository;
import project_z.demo.services.SeasonService;

@Service
public class SeasonServiceImpl implements SeasonService {

    @Autowired
    private SeasonRepository seasonRepository;
    @Autowired
    private BeanUtilsHelper beanUtilsHelper;
    @Autowired
    private PatchHelper patchHelper;
    @Autowired
    private TitleRepository titleRepository;
    @Autowired
    private Mapper<SeasonEntity, SeasonDto> seasonMapper;

    @Override
    public SeasonEntity save(SeasonEntity seasonEntity) {
        return seasonRepository.save(seasonEntity);
    }

    @Override
    public List<SeasonDto> findAll(Long titleId) {
        return seasonRepository.findByTitle_TitleIdOrderByCreatedAtAsc(titleId).stream().map(seasonMapper::mapTo).toList();
    }

    @Override
    public boolean isExists(long titleId) {
        return seasonRepository.existsById(titleId);
    }

    @Override
    public SeasonDto findById(long seasonId) {
        var res = seasonRepository.findById(seasonId).orElseThrow(
                () -> new ResourceNotFoundException("season not found")
        );
        return seasonMapper.mapTo(res);
    }

    @Override
    @Transactional
    public SeasonEntity partialUpdate(Long seasonId, SeasonPatchUpdateDto source) {
        return seasonRepository.findById(seasonId)
                .map(target -> {
                    patchHelper.updateIfPresent(source.getName(), target::setName);
                    patchHelper.updateIfPresent(source.getStatus(), target::setStatus);
                    patchHelper.updateIfPresent(source.getRating(), target::setRating);
                    patchHelper.updateIfPresent(source.getApiTitleId(), target::setApiTitleId);
                    patchHelper.updateIfPresent(source.getDescription(), target::setDescription);
                    patchHelper.updateIfPresent(source.getImageUrl(), target::setImageUrl);
                    patchHelper.updateIfPresent(source.getType(), target::setType);
                    return seasonRepository.save(target);
                })
                .orElseThrow(() -> new ResourceNotFoundException("Season not found"));
    }

    @Override
    public void deleteById(long seasonId) {
        seasonRepository.deleteById(seasonId);
    }

    @Override
    @Transactional
    public List<SeasonDto> batchUpdate(Long titleId, List<SeasonDto> dtos) {
        if (!titleRepository.existsById(titleId)) {
            throw new ResourceNotFoundException("Title not found");
        }
        TitleEntity title = titleRepository.getReferenceById(titleId);

        Map<Long, SeasonEntity> currentById = seasonRepository.findByTitle_TitleId(titleId).stream()
                .collect(Collectors.toMap(SeasonEntity::getSeasonId, Function.identity()));

        Set<Long> dtoIds = dtos.stream()
                .map(SeasonDto::getSeasonId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        List<SeasonEntity> toRemove = currentById.values().stream()
                .filter(s -> !dtoIds.contains(s.getSeasonId()))
                .toList();
        seasonRepository.deleteAll(toRemove);
        seasonRepository.flush();

        List<SeasonEntity> entitiesToSave = dtos.stream().map(dto -> {
            SeasonEntity entity = dto.getSeasonId() != null
                    ? currentById.getOrDefault(dto.getSeasonId(), new SeasonEntity())
                    : seasonMapper.mapFrom(dto);

            entity.setName(dto.getName());
            entity.setRating(dto.getRating());
            entity.setStatus(dto.getStatus());
            entity.setTitle(title);
            return entity;
        }).toList();

        return StreamSupport.stream(seasonRepository.saveAll(entitiesToSave).spliterator(), false)
                .map(seasonMapper::mapTo)
                .toList();
    }
}