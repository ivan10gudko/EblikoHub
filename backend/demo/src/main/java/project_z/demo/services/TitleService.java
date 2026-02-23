package project_z.demo.services;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import project_z.demo.entity.SeasonEntity;
import project_z.demo.entity.TitleEntity;

public interface  TitleService {
    TitleEntity createTitle(TitleEntity title );
    List<TitleEntity> findAll();
    Optional<TitleEntity> findOne(Long titleId);
    boolean isExists (Long titleId);
    TitleEntity partialUpdate(Long titleId, TitleEntity titleEntity);
    void deleteById(Long id);
    List<TitleEntity> addTitle(TitleEntity titleEntity,  UUID userId);
    List<TitleEntity> getWatchedList(UUID userid);
    List<TitleEntity> getWatchList(UUID userid);
    TitleEntity addSeason(SeasonEntity seasonEntity, TitleEntity titleEntity);
}
