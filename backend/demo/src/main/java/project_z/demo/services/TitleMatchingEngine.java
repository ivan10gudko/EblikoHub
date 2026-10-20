package project_z.demo.services;

import java.util.List;

import project_z.demo.entity.RoomTitleEntity;
import project_z.demo.entity.TitleEntity;

public interface TitleMatchingEngine<T> {
    List<T> suggest(List<RoomTitleEntity> roomTitles, List<TitleEntity> watchlistTitles);
}
