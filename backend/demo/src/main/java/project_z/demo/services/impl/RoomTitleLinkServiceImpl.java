package project_z.demo.services.impl;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import project_z.demo.Mappers.Mapper;
import project_z.demo.common.Exceptions.ResourceNotFoundException;
import project_z.demo.common.Exceptions.RoomTitleLinkExceptions.RoomTitleLinkAlreadyExistsException;
import project_z.demo.dto.RoomTitleLinkDtos.RoomTitleLinkCreateDto;
import project_z.demo.dto.RoomTitleLinkDtos.RoomTitleLinkDetailsDto;
import project_z.demo.dto.RoomTitleLinkDtos.SuggestedTitleLinkDto;
import project_z.demo.entity.RoomTitleEntity;
import project_z.demo.entity.RoomTitleLinkEntity;
import project_z.demo.entity.TitleEntity;
import project_z.demo.enums.TitleStatus;
import project_z.demo.repositories.RoomTitleEntityRepository;
import project_z.demo.repositories.RoomTitleLinkRepository;
import project_z.demo.repositories.Specifications.RoomTitleSpecifications;
import project_z.demo.repositories.Specifications.TitleSpecifications;
import project_z.demo.repositories.TitleRepository;
import project_z.demo.services.RoomTitleLinkService;
import project_z.demo.services.TitleMatchingEngine;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RoomTitleLinkServiceImpl implements RoomTitleLinkService {

    private final RoomTitleLinkRepository repository;
    private final Mapper<RoomTitleLinkEntity, RoomTitleLinkDetailsDto> mapper;
    private final TitleRepository titleRepository;
    private final RoomTitleEntityRepository roomTitleRepository;
    private final TitleMatchingEngine titleMatchingEngine;

    @Override
    @Transactional
    public RoomTitleLinkDetailsDto createLink(RoomTitleLinkCreateDto dto) {
        if(repository.existsByUserTitleRecord_TitleIdAndRoomTitle_Id(dto.getTitleId(), dto.getRoomTitleId())){
            throw new RoomTitleLinkAlreadyExistsException("link between this title and room title adlready exists");
        }
        var userTitle = titleRepository.findById(dto.getTitleId())
                .orElseThrow(() -> new RuntimeException("Title record not found with id: " + dto.getTitleId()));

        var roomTitle = roomTitleRepository.findById(dto.getRoomTitleId())
                .orElseThrow(() -> new RuntimeException("Room title not found with id: " + dto.getRoomTitleId()));

        RoomTitleLinkEntity entity = new RoomTitleLinkEntity();
        entity.setUserTitleRecord(userTitle);
        entity.setRoomTitle(roomTitle);
        return mapper.mapTo(repository.save(entity));
    }

    @Override
    public List<RoomTitleLinkDetailsDto> findByRoomTitleId(UUID roomTitleId) {
        return repository.findByRoomTitle_Id(roomTitleId).stream()
                .map(mapper::mapTo)
                .collect(Collectors.toList());
    }

    @Override
    public List<RoomTitleLinkDetailsDto> findUserLinksInRoom(UUID userId, Long roomId) {
        return repository.findByUserTitleRecord_User_UserIdAndRoomTitle_Room_RoomId(userId, roomId).stream()
                .map(mapper::mapTo)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteLink(UUID roomTitleLinkId) {
        RoomTitleLinkEntity entity = repository.findById(roomTitleLinkId).orElseThrow(
            () -> new ResourceNotFoundException("Room title link not found")
        );
        repository.delete(entity);
    }

    @Override
    @Transactional
    public void deleteLinksByRoomTitle(UUID roomTitleId) {
        repository.deleteByRoomTitle_Id(roomTitleId);
    }

    @Override
    public List<SuggestedTitleLinkDto> suggestLinks(UUID userId, Long roomId) {
        Specification<RoomTitleEntity> roomTitleSpec = Specification
                .where(RoomTitleSpecifications.hasRoomId(roomId))
                .and(RoomTitleSpecifications.notLinkedByUser(roomId, userId));

        Specification<TitleEntity> watchlistSpec = Specification
                .where(TitleSpecifications.belongsToUser(userId))
                .and(TitleSpecifications.notLinkedToRoom(roomId, userId));

        List<RoomTitleEntity> roomTitles = roomTitleRepository.findAll(roomTitleSpec);
        List<TitleEntity> watchlistTitles = titleRepository.findAll(watchlistSpec);

        if (roomTitles.isEmpty() || watchlistTitles.isEmpty()) {
            return List.of();
        }

        return titleMatchingEngine.suggestLinks(roomTitles, watchlistTitles);
    }
}
