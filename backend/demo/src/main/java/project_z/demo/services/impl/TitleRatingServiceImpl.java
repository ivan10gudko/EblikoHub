package project_z.demo.services.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import project_z.demo.entity.TitleEntity;
import project_z.demo.entity.TitleRatingEntity;
import project_z.demo.repositories.TitleRatingRepository;
import project_z.demo.services.TitleRatingService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TitleRatingServiceImpl implements TitleRatingService {

    private final TitleRatingRepository titleRatingRepository;

    @Override
    @Transactional
    public void updateRatingsForTitle(TitleEntity title, Map<String, Float> newRatings) {
        if (newRatings == null) {
            return;
        }

        List<TitleRatingEntity> existingRatings = titleRatingRepository.findByTitle_TitleId(title.getTitleId());
        Map<String, LocalDateTime> createdAtMap = existingRatings.stream()
                .collect(Collectors.toMap(TitleRatingEntity::getName, TitleRatingEntity::getCreatedAt, (v1, v2) -> v2));

        titleRatingRepository.deleteByTitleId(title.getTitleId());
        titleRatingRepository.flush();

        List<TitleRatingEntity> ratingEntities = newRatings.entrySet().stream()
                .map(entry -> {
                    String name = entry.getKey();
                    Float value = entry.getValue();
                    LocalDateTime originalCreatedAt = createdAtMap.get(name);

                    return TitleRatingEntity.builder()
                            .name(name)
                            .value(value)
                            .title(title)
                            .createdAt(originalCreatedAt != null ? originalCreatedAt : LocalDateTime.now())
                            .build();
                })
                .collect(Collectors.toList());

        titleRatingRepository.saveAll(ratingEntities);
    }
}