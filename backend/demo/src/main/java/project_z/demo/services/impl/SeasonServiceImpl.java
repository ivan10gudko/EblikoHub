package project_z.demo.services.impl;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
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
    public Optional<SeasonEntity> findById(long seasonId) {
        return seasonRepository.findById(seasonId);
    }

    @Override
    @Transactional
    public SeasonEntity partialUpdate(Long seasonId, SeasonPatchUpdateDto source) {
        return seasonRepository.findById(seasonId)
                .map(target -> {
                    patchHelper.updateIfPresent(source.getSeasonName(), target::setName);
                    patchHelper.updateIfPresent(source.getStatus(), target::setStatus);
                    patchHelper.updateIfPresent(source.getRating(), target::setRating);
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
        TitleEntity title = titleRepository.findById(titleId)
                .orElseThrow(() -> new ResourceNotFoundException("Title not found"));

        List<SeasonEntity> currentSeasons = seasonRepository.findByTitle_TitleId(titleId);

        Set<Long> dtoIds = dtos.stream()
                .map(SeasonDto::getSeasonId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        List<SeasonEntity> toRemove = currentSeasons.stream()
                .filter(s -> !dtoIds.contains(s.getSeasonId()))
                .toList();

        seasonRepository.deleteAll(toRemove); 

        List<SeasonEntity> entitiesToSave = dtos.stream().map(dto -> {
            SeasonEntity entity;
            if (dto.getSeasonId() != null) {
                entity = currentSeasons.stream()
                        .filter(s -> s.getSeasonId().equals(dto.getSeasonId()))
                        .findFirst()
                        .orElse(new SeasonEntity());
            } else {
                entity = seasonMapper.mapFrom(dto);
            }

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