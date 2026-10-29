package project_z.demo.services;

import project_z.demo.entity.TitleEntity;

import java.util.Map;

public interface TitleRatingService {

    void updateRatingsForTitle(TitleEntity title, Map<String, Float> newRatings);
}
