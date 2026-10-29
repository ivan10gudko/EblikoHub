package project_z.demo.services;

import project_z.demo.entity.SeasonEntity;

import java.util.Map;

public interface SeasonRatingService {

    void updateRatingsForSeason(SeasonEntity season, Map<String, Float> newRatings);
}
