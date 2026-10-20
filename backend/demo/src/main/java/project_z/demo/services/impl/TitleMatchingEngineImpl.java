package project_z.demo.services.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import project_z.demo.JavaUtil.TitleMatching.TitleMatchingHelper;
import project_z.demo.Mappers.Mapper;
import project_z.demo.common.Exceptions.TitleLinkSuggestionAiErrorException;
import project_z.demo.config.MyConfig;
import project_z.demo.dto.RoomTitleDtos.RoomTitleShortDto;
import project_z.demo.dto.RoomTitleLinkDtos.SuggestedTitleLinkDto;
import project_z.demo.dto.TitleDtos.TitleShortDto;
import project_z.demo.entity.RoomTitleEntity;
import project_z.demo.entity.TitleEntity;
import project_z.demo.services.GoogleAiClient;
import project_z.demo.services.TitleMatchingEngine;

@Service
@RequiredArgsConstructor
public class TitleMatchingEngineImpl implements TitleMatchingEngine<SuggestedTitleLinkDto> {

    private static final String SMART_TITLE_LINK_PROMPT = """
            You are an expert at matching anime/movie/TV titles across languages and variations.
            
            You receive two JSON arrays of UNLINKED items:
            - roomTitles: titles in a shared room that are not yet linked to this user
            - watchlistTitles: user's personal watchlist titles that are not yet linked in this room
            
            Task: find pairs that refer to the SAME work or related seasons/parts.
            
            Rules:
            - Return ONLY a valid JSON array, no markdown, no explanation
            - STRICT 1-TO-1 MAPPING PER ROOM TITLE: Each `roomTitleId` can be mapped to AT MOST ONE `titleId`.
            - If apiTitleId matches and is non-null on both sides, that is a certain match.
            - Do not invent IDs.
            - Never return null. If no match, completely omit it.
            
            Output format:
            [
              {"roomTitleId":"<uuid>","titleId":<long>,"confidence":"high"|"medium"|"low"}
            ]
            """;

    private final GoogleAiClient googleAiClient;
    private final MyConfig myConfig;
    private final ObjectMapper objectMapper;
    private final Mapper<TitleEntity, TitleShortDto> titleShortMapper;
    private final Mapper<RoomTitleEntity, RoomTitleShortDto> roomTitleShortMapper;

    @Override
    public List<SuggestedTitleLinkDto> suggest(List<RoomTitleEntity> unlinkedRoomTitles,
                                               List<TitleEntity> unlinkedWatchlistTitles) {

        Map<UUID, RoomTitleEntity> roomTitleById = unlinkedRoomTitles.stream()
                .collect(Collectors.toMap(RoomTitleEntity::getId, rt -> rt));
        Map<Long, TitleEntity> watchlistById = unlinkedWatchlistTitles.stream()
                .collect(Collectors.toMap(TitleEntity::getTitleId, t -> t));

        List<SuggestedTitleLinkDto> preMatched = preMatchByApiTitleId(unlinkedRoomTitles, unlinkedWatchlistTitles);

        Set<UUID> usedRoomTitleIds = preMatched.stream().map(s -> s.getRoomTitle().getId()).collect(Collectors.toSet());
        Set<Long> usedTitleIds = preMatched.stream().map(s -> s.getTitle().getTitleId()).collect(Collectors.toSet());

        List<RoomTitleEntity> roomTitlesForAi = unlinkedRoomTitles.stream()
                .filter(rt -> !usedRoomTitleIds.contains(rt.getId()))
                .toList();
        List<TitleEntity> watchlistForAi = unlinkedWatchlistTitles.stream()
                .filter(t -> !usedTitleIds.contains(t.getTitleId()))
                .toList();

        List<SuggestedTitleLinkDto> aiSuggestions = (!roomTitlesForAi.isEmpty() && !watchlistForAi.isEmpty())
                ? fetchAiSuggestions(roomTitlesForAi, watchlistForAi, roomTitleById, watchlistById)
                : List.of();

        List<SuggestedTitleLinkDto> result = new ArrayList<>(preMatched);
        result.addAll(aiSuggestions);
        return result;
    }

    private List<SuggestedTitleLinkDto> preMatchByApiTitleId(List<RoomTitleEntity> roomTitles,
                                                             List<TitleEntity> watchlistTitles) {
        Map<Long, List<RoomTitleEntity>> roomTitlesByApiId = new HashMap<>();
        for (RoomTitleEntity roomTitle : roomTitles) {
            if (roomTitle.getApiTitleId() != null) {
                roomTitlesByApiId.computeIfAbsent(roomTitle.getApiTitleId(), id -> new ArrayList<>()).add(roomTitle);
            }
        }

        Set<UUID> usedRoomTitleIds = new HashSet<>();
        Set<Long> usedTitleIds = new HashSet<>();
        List<SuggestedTitleLinkDto> matches = new ArrayList<>();

        for (TitleEntity watchlistTitle : watchlistTitles) {
            if (watchlistTitle.getApiTitleId() == null || usedTitleIds.contains(watchlistTitle.getTitleId())) {
                continue;
            }
            List<RoomTitleEntity> candidates = roomTitlesByApiId.get(watchlistTitle.getApiTitleId().longValue());
            if (candidates == null) {
                continue;
            }
            for (RoomTitleEntity roomTitle : candidates) {
                if (usedRoomTitleIds.contains(roomTitle.getId())) {
                    continue;
                }
                matches.add(createDto(roomTitle, watchlistTitle, "high"));
                usedRoomTitleIds.add(roomTitle.getId());
                usedTitleIds.add(watchlistTitle.getTitleId());
                break;
            }
        }
        return matches;
    }

    private List<SuggestedTitleLinkDto> fetchAiSuggestions(
            List<RoomTitleEntity> roomTitles,
            List<TitleEntity> watchlistTitles,
            Map<UUID, RoomTitleEntity> roomTitleById,
            Map<Long, TitleEntity> watchlistById) {
        try {
            List<Map<String, Object>> roomPayload = roomTitles.stream().map(TitleMatchingHelper::toPayload).toList();
            List<Map<String, Object>> watchlistPayload = watchlistTitles.stream().map(TitleMatchingHelper::toPayload).toList();

            Map<String, Object> input = Map.of(
                    "roomTitles", roomPayload,
                    "watchlistTitles", watchlistPayload);

            String userMessage = objectMapper.writeValueAsString(input);

            String responseText = googleAiClient.generateContent(
                    myConfig.getGoogleTitleLinksApiKey(),
                    SMART_TITLE_LINK_PROMPT + "\n\nInput:\n" + userMessage);

            List<TitleMatchingHelper.AiSuggestedPair> rawPairs = TitleMatchingHelper.parseAiResponse(responseText, objectMapper);
            List<SuggestedTitleLinkDto> validated = new ArrayList<>();

            if (rawPairs != null) {
                for (TitleMatchingHelper.AiSuggestedPair pair : rawPairs) {
                    if (pair.roomTitleId() == null || pair.titleId() == null) {
                        continue;
                    }
                    RoomTitleEntity roomTitle = roomTitleById.get(pair.roomTitleId());
                    TitleEntity watchlistTitle = watchlistById.get(pair.titleId());
                    if (roomTitle == null || watchlistTitle == null) {
                        continue;
                    }

                    validated.add(createDto(
                            roomTitle,
                            watchlistTitle,
                            pair.confidence() != null ? pair.confidence() : "medium"
                    ));
                }
            }
            return validated;
        } catch (TitleLinkSuggestionAiErrorException e) {
            throw e;
        } catch (Exception e) {
            throw new TitleLinkSuggestionAiErrorException(
                    "Failed to get smart title link suggestions from AI: " + e.getMessage());
        }
    }

    private SuggestedTitleLinkDto createDto(RoomTitleEntity roomTitle, TitleEntity title, String confidence) {
        return SuggestedTitleLinkDto.builder()
                .roomTitle(roomTitleShortMapper.mapTo(roomTitle))
                .title(titleShortMapper.mapTo(title))
                .confidence(confidence)
                .build();
    }
}