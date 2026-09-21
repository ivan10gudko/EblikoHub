package project_z.demo.Mappers.impl.RoomTitleMappers;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import project_z.demo.JavaUtil.TitleSortingUtils;
import project_z.demo.Mappers.Mapper;
import project_z.demo.dto.RoomTitleDtos.RoomTitleShortDto;
import project_z.demo.dto.RoomTitleDtos.RoomTitleSummaryDto;
import project_z.demo.dto.TitleDtos.TitleShortDto;
import project_z.demo.dto.TitleDtos.TitleUserParticipation;
import project_z.demo.entity.RoomTitleEntity;
import project_z.demo.entity.RoomTitleLinkEntity;
import project_z.demo.entity.TitleEntity;
import project_z.demo.enums.TitleStatus;

@Component
@RequiredArgsConstructor
public class RoomTitleSummaryMapper {
    private final Mapper<TitleEntity, TitleShortDto> titleShortMapper;
    private final Mapper<RoomTitleEntity, RoomTitleShortDto> roomTitleShortMapper;
    private final Mapper<TitleEntity, TitleShortDto> tilteShortMapper;

    public RoomTitleSummaryDto mapTo(
            RoomTitleEntity entity,
            Double avg,
            Map<UUID, List<RoomTitleLinkEntity>> linksByTitleId,
            UUID currentUserId,
            boolean isCurrentUserSelected,
            TitleStatus targetStatus) {

        List<RoomTitleLinkEntity> linksForTitle = linksByTitleId.getOrDefault(entity.getId(), List.of());

        List<TitleUserParticipation> participation = buildParticipationList(
                linksForTitle, currentUserId, isCurrentUserSelected, targetStatus);

        Optional<RoomTitleLinkEntity> myLink = findUserLink(linksForTitle, currentUserId);

        return new RoomTitleSummaryDto(
                entity.getId(),
                roomTitleShortMapper.mapTo(entity),
                avg,
                myLink.map(l -> l.getUserTitleRecord().getStatus()).orElse(null),
                myLink.map(l -> tilteShortMapper.mapTo(l.getUserTitleRecord())).orElse(null),
                participation);
    }

    private List<TitleUserParticipation> buildParticipationList(
            List<RoomTitleLinkEntity> links,
            UUID currentUserId,
            boolean isCurrentUserSelected,
            TitleStatus targetStatus) {

        return links.stream()
                .filter(link -> {
                    UUID linkUserId = link.getUserTitleRecord().getUser().getUserId();
                    boolean isCurrent = linkUserId.equals(currentUserId);

                    if (isCurrent && !isCurrentUserSelected) {
                        return false;
                    }
                    return true;
                })
                .sorted(createParticipationComparator(targetStatus))
                .map(this::mapToParticipation)
                .collect(Collectors.toList());
    }

    private Comparator<RoomTitleLinkEntity> createParticipationComparator(TitleStatus targetStatus) {
        return Comparator
                .comparing((RoomTitleLinkEntity l) -> {
                    TitleStatus currentStatus = l.getUserTitleRecord().getStatus();

                    if (targetStatus != null) {
                        return (currentStatus == targetStatus) ? "0" : "1";
                    }

                    return String.valueOf(TitleSortingUtils.STATUS_PRIORITY.getOrDefault(currentStatus, 99));
                })
                .thenComparing(l -> l.getUserTitleRecord().getUser().getName());
    }

    private TitleUserParticipation mapToParticipation(RoomTitleLinkEntity link) {
        var userRecord = link.getUserTitleRecord();
        return new TitleUserParticipation(
                userRecord.getUser().getUserId(),
                userRecord.getStatus(),
                userRecord.getRating().getOrDefault("overall", 0f),
                userRecord.getTitleType(),
                userRecord.getTitleId());
    }

    private Optional<RoomTitleLinkEntity> findUserLink(List<RoomTitleLinkEntity> links, UUID currentUserId) {
        if (currentUserId == null) {
            return Optional.empty();
        }
        return links.stream()
                .filter(link -> link.getUserTitleRecord().getUser().getUserId().equals(currentUserId))
                .findFirst();
    }
}