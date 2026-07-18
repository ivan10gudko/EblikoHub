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

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import project_z.demo.common.Exceptions.TitleLinkSuggestionAiErrorException;
import project_z.demo.config.MyConfig;
import project_z.demo.dto.RoomTitleLinkDtos.SuggestedTitleLinkDto;
import project_z.demo.entity.RoomTitleEntity;
import project_z.demo.entity.TitleEntity;
import project_z.demo.services.GoogleAiClient;
import project_z.demo.services.TitleMatchingEngine;

@Service
@RequiredArgsConstructor
public class TitleMatchingEngineImpl implements TitleMatchingEngine {

    private static final String TITLE_LINK_PROMPT = """
            You are an expert at matching anime/movie/TV titles across languages.

            You receive two JSON arrays:
            - roomTitles: titles in a shared room
            - watchlistTitles: titles from a user's personal watchlist

            Task: find pairs that refer to the SAME work. Names may differ by language (Japanese, English, Ukrainian, romaji, etc.).

            Rules:
            - Return ONLY a valid JSON array, no markdown, no explanation
            - Each roomTitleId and titleId may appear at most once
            - If apiTitleId matches and is non-null on both sides, that is a certain match
            - Only include pairs you are reasonably confident about
            - Do not invent IDs — use only IDs from the input
            - IMPORTANT: Consider ALL titles regardless of their status (watched, dropped, planned, etc.).
              A title marked as 'dropped' in the watchlist should be matched just as rigorously as any other status.

            Output format:
            [
              {"roomTitleId":"<uuid>","titleId":<long>,"confidence":"high"|"medium"}
            ]
            """;

    private final GoogleAiClient googleAiClient;
    private final MyConfig myConfig;
    private final ObjectMapper objectMapper;

    @Override
    public List<SuggestedTitleLinkDto> suggestLinks(List<RoomTitleEntity> roomTitles,
            List<TitleEntity> watchlistTitles) {
        // 1. Дебаг входу
        System.out.println("DEBUG: suggestLinks started");
        System.out.println("DEBUG: roomTitles size: " + (roomTitles != null ? roomTitles.size() : "null"));
        System.out
                .println("DEBUG: watchlistTitles size: " + (watchlistTitles != null ? watchlistTitles.size() : "null"));

        Map<UUID, RoomTitleEntity> roomTitleById = roomTitles.stream()
                .collect(Collectors.toMap(RoomTitleEntity::getId, rt -> rt));
        Map<Long, TitleEntity> watchlistById = watchlistTitles.stream()
                .collect(Collectors.toMap(TitleEntity::getTitleId, t -> t));

        List<SuggestedTitleLinkDto> preMatched = preMatchByApiTitleId(roomTitles, watchlistTitles);
        System.out.println("DEBUG: preMatched size: " + preMatched.size());

        Set<UUID> usedRoomTitleIds = preMatched.stream()
                .map(SuggestedTitleLinkDto::getRoomTitleId)
                .collect(Collectors.toSet());
        Set<Long> usedTitleIds = preMatched.stream()
                .map(SuggestedTitleLinkDto::getTitleId)
                .collect(Collectors.toSet());

        List<RoomTitleEntity> roomTitlesForAi = roomTitles.stream()
                .filter(rt -> !usedRoomTitleIds.contains(rt.getId()))
                .toList();
        List<TitleEntity> watchlistForAi = watchlistTitles.stream()
                .filter(t -> !usedTitleIds.contains(t.getTitleId()))
                .toList();

        System.out.println("DEBUG: roomTitlesForAi count: " + roomTitlesForAi.size());
        System.out.println("DEBUG: watchlistForAi count: " + watchlistForAi.size());

        List<SuggestedTitleLinkDto> aiSuggestions = List.of();
        if (!roomTitlesForAi.isEmpty() && !watchlistForAi.isEmpty()) {
            System.out.println("DEBUG: Calling fetchAiSuggestions...");
            // ТУТ ВАЖЛИВО: перевір, чи немає всередині fetchAiSuggestions виклику цього ж
            // методу suggestLinks
            aiSuggestions = fetchAiSuggestions(roomTitlesForAi, watchlistForAi, roomTitleById, watchlistById);
            System.out.println("DEBUG: fetchAiSuggestions returned size: " + aiSuggestions.size());
        }

        List<SuggestedTitleLinkDto> result = new ArrayList<>(preMatched);
        result.addAll(aiSuggestions);
        System.out.println("DEBUG: suggestLinks finished, total result size: " + result.size());
        return result;
    }

    private List<SuggestedTitleLinkDto> preMatchByApiTitleId(
            List<RoomTitleEntity> roomTitles,
            List<TitleEntity> watchlistTitles) {
        Map<Long, List<RoomTitleEntity>> roomTitlesByApiId = new HashMap<>();
        for (RoomTitleEntity roomTitle : roomTitles) {
            if (roomTitle.getApiTitleId() != null) {
                roomTitlesByApiId
                        .computeIfAbsent(roomTitle.getApiTitleId(), id -> new ArrayList<>())
                        .add(roomTitle);
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
                matches.add(SuggestedTitleLinkDto.builder()
                        .roomTitleId(roomTitle.getId())
                        .roomTitleName(roomTitle.getTitleName())
                        .titleId(watchlistTitle.getTitleId())
                        .titleName(watchlistTitle.getTitleName())
                        .confidence("high")
                        .build());
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
            List<Map<String, Object>> roomPayload = roomTitles.stream()
                    .map(this::toRoomTitlePayload)
                    .toList();
            List<Map<String, Object>> watchlistPayload = watchlistTitles.stream()
                    .map(this::toWatchlistTitlePayload)
                    .toList();

            Map<String, Object> input = Map.of(
                    "roomTitles", roomPayload,
                    "watchlistTitles", watchlistPayload);

            String userMessage = objectMapper.writeValueAsString(input);
            String responseText = googleAiClient.generateContent(
                    myConfig.getGoogleTitleLinksApiKey(),
                    TITLE_LINK_PROMPT + "\n\nInput:\n" + userMessage);

            List<AiSuggestedPair> rawPairs = parseAiResponse(responseText);

            Set<UUID> usedRoomTitleIds = new HashSet<>();
            Set<Long> usedTitleIds = new HashSet<>();
            List<SuggestedTitleLinkDto> validated = new ArrayList<>();

            for (AiSuggestedPair pair : rawPairs) {
                if (pair.roomTitleId() == null || pair.titleId() == null) {
                    continue;
                }
                if (usedRoomTitleIds.contains(pair.roomTitleId()) || usedTitleIds.contains(pair.titleId())) {
                    continue;
                }
                RoomTitleEntity roomTitle = roomTitleById.get(pair.roomTitleId());
                TitleEntity watchlistTitle = watchlistById.get(pair.titleId());
                if (roomTitle == null || watchlistTitle == null) {
                    continue;
                }

                validated.add(SuggestedTitleLinkDto.builder()
                        .roomTitleId(roomTitle.getId())
                        .roomTitleName(roomTitle.getTitleName())
                        .titleId(watchlistTitle.getTitleId())
                        .titleName(watchlistTitle.getTitleName())
                        .confidence(pair.confidence() != null ? pair.confidence() : "medium")
                        .build());
                usedRoomTitleIds.add(pair.roomTitleId());
                usedTitleIds.add(pair.titleId());
            }

            return validated;
        } catch (TitleLinkSuggestionAiErrorException e) {
            throw e;
        } catch (Exception e) {
            throw new TitleLinkSuggestionAiErrorException(
                    "Failed to get title link suggestions from AI: " + e.getMessage());
        }
    }

    private Map<String, Object> toRoomTitlePayload(RoomTitleEntity roomTitle) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("id", roomTitle.getId().toString());
        payload.put("name", roomTitle.getTitleName());
        payload.put("type", roomTitle.getTitleType().name());
        if (roomTitle.getApiTitleId() != null) {
            payload.put("apiTitleId", roomTitle.getApiTitleId());
        }
        return payload;
    }

    private Map<String, Object> toWatchlistTitlePayload(TitleEntity title) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("id", title.getTitleId());
        payload.put("name", title.getTitleName());
        payload.put("type", title.getTitleType().name());
        if (title.getApiTitleId() != null) {
            payload.put("apiTitleId", title.getApiTitleId());
        }
        return payload;
    }

    private List<AiSuggestedPair> parseAiResponse(String responseText) {
        String json = responseText
                .replaceAll("(?s)```json\\s*", "")
                .replaceAll("(?s)```\\s*", "")
                .trim();

        try {
            return objectMapper.readValue(json, new TypeReference<List<AiSuggestedPair>>() {
            });
        } catch (Exception e) {
            throw new TitleLinkSuggestionAiErrorException("Failed to parse AI response as JSON: " + e.getMessage());
        }
    }

    private record AiSuggestedPair(UUID roomTitleId, Long titleId, String confidence) {
    }
}
