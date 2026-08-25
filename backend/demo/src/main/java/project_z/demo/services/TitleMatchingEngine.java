package project_z.demo.services;

import java.util.List;

import project_z.demo.dto.RoomTitleLinkDtos.SuggestedTitleLinkDto;
import project_z.demo.entity.RoomTitleEntity;
import project_z.demo.entity.TitleEntity;

public interface TitleMatchingEngine {
    List<SuggestedTitleLinkDto> suggestLinks(List<RoomTitleEntity> roomTitles, List<TitleEntity> watchlistTitles);
}
