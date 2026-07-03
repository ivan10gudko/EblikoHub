package project_z.demo.services;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import project_z.demo.common.QueryParameters.QueryParameters;
import project_z.demo.common.QueryParameters.RoomTitlesQueryParameters.RoomTitlesQueryParameters;
import project_z.demo.common.QueryParameters.RoomTitlesQueryParameters.RoomTitlesWithSearchQueryParameters;
import project_z.demo.dto.RoomTitleDtos.RoomTitleCreateDto;
import project_z.demo.dto.RoomTitleDtos.RoomTitleDetailsDto;
import project_z.demo.dto.RoomTitleDtos.RoomTitleSummaryDto;
import project_z.demo.dto.RoomTitleDtos.RoomTitleUpdateDto;
import project_z.demo.dto.RoomTitleDtos.RoomTitleWithUserLinksDto;
import project_z.demo.dto.RoomTitleDtos.RoomTitlesResponseDto;

public interface RoomTitleService {
    RoomTitleDetailsDto create(RoomTitleCreateDto dto, Long roomId);

    RoomTitleDetailsDto findById(UUID id);

    List<RoomTitleDetailsDto> findAllByRoom(Long roomId);

    RoomTitleDetailsDto update(UUID id, RoomTitleUpdateDto dto);

    void delete(UUID id);

    Page<RoomTitleWithUserLinksDto> getRoomTitlesWithUserLinks(long roomId, UUID userId, RoomTitlesWithSearchQueryParameters queryParameters);

    Page<RoomTitleDetailsDto> getRoomTitlesWithoutLinks(Long roomId, QueryParameters params);

    RoomTitlesResponseDto getRoomTitles(Long roomId, UUID currentUserId, RoomTitlesQueryParameters params);
}