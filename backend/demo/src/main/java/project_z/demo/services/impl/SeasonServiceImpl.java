package project_z.demo.services.impl;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import lombok.RequiredArgsConstructor;
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
import project_z.demo.services.SeasonRatingService;
import project_z.demo.services.SeasonService;

@Service
@RequiredArgsConstructor
public class SeasonServiceImpl implements SeasonService {


    private final SeasonRepository seasonRepository;

    private final BeanUtilsHelper beanUtilsHelper;
    private final PatchHelper patchHelper;
    private final TitleRepository titleRepository;
    private final Mapper<SeasonEntity, SeasonDto> seasonMapper;
    private final SeasonRatingService seasonRatingService;

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
                    patchHelper.updateIfPresent(source.getRating(), ratingsMap ->
                            seasonRatingService.updateRatingsForSeason(target, ratingsMap)
                    );
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

        List<SeasonEntity> savedSeasons = new ArrayList<>();

        for (SeasonDto dto : dtos) {
            SeasonEntity entity;

            if (dto.getSeasonId() != null && currentById.containsKey(dto.getSeasonId())) {
                entity = currentById.get(dto.getSeasonId());

                SeasonEntity mappedUpdates = seasonMapper.mapFrom(dto);
                entity.setName(mappedUpdates.getName());
                entity.setStatus(mappedUpdates.getStatus());
                entity.setApiTitleId(mappedUpdates.getApiTitleId());
                entity.setDescription(mappedUpdates.getDescription());
                entity.setImageUrl(mappedUpdates.getImageUrl());
                entity.setType(mappedUpdates.getType());
            } else {
                entity = seasonMapper.mapFrom(dto);
                entity.setTitle(title);
            }

            SeasonEntity savedSeason = seasonRepository.save(entity);

            seasonRatingService.updateRatingsForSeason(savedSeason, dto.getRating());

            savedSeasons.add(savedSeason);
        }

        return savedSeasons.stream()
                .map(seasonMapper::mapTo)
                .toList();
    }
}
