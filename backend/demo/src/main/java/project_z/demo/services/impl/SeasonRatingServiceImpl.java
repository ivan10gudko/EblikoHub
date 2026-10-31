package project_z.demo.services.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import project_z.demo.entity.SeasonEntity;
import project_z.demo.entity.SeasonRatingEntity;
import project_z.demo.repositories.SeasonRatingRepository;
import project_z.demo.services.SeasonRatingService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SeasonRatingServiceImpl implements SeasonRatingService {

    private final SeasonRatingRepository seasonRatingRepository;

    @Override
    @Transactional
    public void updateRatingsForSeason(SeasonEntity season, Map<String, Float> newRatings) {
        if (newRatings == null) {
            return;
        }

        List<SeasonRatingEntity> existingRatings = seasonRatingRepository.findBySeason_SeasonId(season.getSeasonId());
        Map<String, LocalDateTime> createdAtMap = existingRatings.stream()
                .collect(Collectors.toMap(SeasonRatingEntity::getName, SeasonRatingEntity::getCreatedAt, (v1, v2) -> v2));

        seasonRatingRepository.deleteBySeasonId(season.getSeasonId());
        seasonRatingRepository.flush();

        List<SeasonRatingEntity> ratingEntities = newRatings.entrySet().stream()
                .map(entry -> {
                    String name = entry.getKey();
                    Float value = entry.getValue();
                    LocalDateTime originalCreatedAt = createdAtMap.get(name);

                    return SeasonRatingEntity.builder()
                            .name(name)
                            .value(value)
                            .season(season)
                            .createdAt(originalCreatedAt != null ? originalCreatedAt : LocalDateTime.now())
                            .build();
                })
                .collect(Collectors.toList());


        seasonRatingRepository.saveAll(ratingEntities);
    }
}