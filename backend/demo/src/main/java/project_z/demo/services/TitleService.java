package project_z.demo.services;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;

import project_z.demo.common.QueryParameters.TitleQueryParameters;
import project_z.demo.dto.TitleDtos.TitlePatchUpdateDto;
import project_z.demo.entity.SeasonEntity;
import project_z.demo.entity.TitleEntity;

public interface TitleService {
    TitleEntity createTitle(TitleEntity title );
    List<TitleEntity> findAll();
    Optional<TitleEntity> findOne(Long titleId);
    boolean isExists (Long titleId);
    TitleEntity partialUpdate(Long titleId, TitlePatchUpdateDto titleEntity);
    void deleteById(Long id);
    TitleEntity addTitle(TitleEntity titleEntity, String token);
    List<TitleEntity> getWatchedList(UUID userid);
    List<TitleEntity> getWatchList(UUID userid);
    TitleEntity addSeason(SeasonEntity seasonEntity, TitleEntity titleEntity);
    TitleEntity findUserTitleByMalId(Integer titleMalId, String token);
    List<TitleEntity> findAllByMalIdInUserRooms(Integer titleMalId, String token);
    Page<TitleEntity> findAllByUserId(TitleQueryParameters parameters, UUID userId);
    void titlePositionUpdate(Double newPosition, Long titleId);
    void reindexCustomOrder(UUID userId);
}
