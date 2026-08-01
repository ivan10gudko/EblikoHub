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
public class TitleMatchingEngineImpl implements TitleMatchingEngine {

    private static final String TITLE_LINK_PROMPT = """
            You are an expert at matching anime/movie/TV titles across languages and variations.

            You receive two JSON arrays:
            - roomTitles: titles in a shared room (may include separate seasons, parts, or numbered entries like "Bleach 1", "Bleach 2")
            - watchlistTitles: titles from a user's personal watchlist

            Task: find pairs that refer to the SAME work or related seasons/parts. Names may differ by language (Japanese, English, Ukrainian, romaji, etc.) or formatting (e.g. "Bleach" vs "Bleach 1").

            Rules:
            - Return ONLY a valid JSON array, no markdown, no explanation
            - SMARTER MATCHING: Pay close attention to base names and numbers/seasons. If a watchlist has a general title (e.g. "Bleach") and the room has specific seasons/parts ("Bleach 1", "Bleach 2"), you CAN and SHOULD suggest links for multiple matching room titles to that single watchlist title if they correspond.
            - NO ID RESTRICTIONS: Do not restrict IDs. Any roomTitleId or titleId can appear multiple times in the output if it matches multiple entries.
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
    private final Mapper<TitleEntity, TitleShortDto> titleShortMapper;
    private final Mapper<RoomTitleEntity, RoomTitleShortDto> roomTitleShortMapper;

    @Override
    public List<SuggestedTitleLinkDto> suggestLinks(List<RoomTitleEntity> roomTitles, List<TitleEntity> watchlistTitles) {
        Map<UUID, RoomTitleEntity> roomTitleById = roomTitles.stream()
                .collect(Collectors.toMap(RoomTitleEntity::getId, rt -> rt));
        Map<Long, TitleEntity> watchlistById = watchlistTitles.stream()
                .collect(Collectors.toMap(TitleEntity::getTitleId, t -> t));

        List<SuggestedTitleLinkDto> preMatched = preMatchByApiTitleId(roomTitles, watchlistTitles);

        Set<UUID> usedRoomTitleIds = preMatched.stream().map(s -> s.getRoomTitle().getId()).collect(Collectors.toSet());
        Set<Long> usedTitleIds = preMatched.stream().map(s -> s.getTitle().getTitleId()).collect(Collectors.toSet());

        List<RoomTitleEntity> roomTitlesForAi = roomTitles.stream()
                .filter(rt -> !usedRoomTitleIds.contains(rt.getId()))
                .toList();
        List<TitleEntity> watchlistForAi = watchlistTitles.stream()
                .filter(t -> !usedTitleIds.contains(t.getTitleId()))
                .toList();

        List<SuggestedTitleLinkDto> aiSuggestions = (!roomTitlesForAi.isEmpty() && !watchlistForAi.isEmpty())
                ? fetchAiSuggestions(roomTitlesForAi, watchlistForAi, roomTitleById, watchlistById)
                : List.of();

        List<SuggestedTitleLinkDto> result = new ArrayList<>(preMatched);
        result.addAll(aiSuggestions);
        return result;
    }

    private List<SuggestedTitleLinkDto> preMatchByApiTitleId(List<RoomTitleEntity> roomTitles, List<TitleEntity> watchlistTitles) {
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
                matches.add(SuggestedTitleLinkDto.builder()
                        .roomTitle(roomTitleShortMapper.mapTo(roomTitle))
                        .title(titleShortMapper.mapTo(watchlistTitle))
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
            List<Map<String, Object>> roomPayload = roomTitles.stream().map(this::toPayload).toList();
            List<Map<String, Object>> watchlistPayload = watchlistTitles.stream().map(this::toPayload).toList();

            String userMessage = objectMapper.writeValueAsString(Map.of(
                    "roomTitles", roomPayload,
                    "watchlistTitles", watchlistPayload));

            String responseText = googleAiClient.generateContent(
                    myConfig.getGoogleTitleLinksApiKey(),
                    TITLE_LINK_PROMPT + "\n\nInput:\n" + userMessage);

            List<AiSuggestedPair> rawPairs = parseAiResponse(responseText);

            Set<UUID> usedRoomTitleIds = new HashSet<>();
            Set<Long> usedTitleIds = new HashSet<>();
            List<SuggestedTitleLinkDto> validated = new ArrayList<>();

            if (rawPairs != null) {
                for (AiSuggestedPair pair : rawPairs) {
                    if (pair.roomTitleId() == null || pair.titleId() == null ||
                            usedRoomTitleIds.contains(pair.roomTitleId()) || usedTitleIds.contains(pair.titleId())) {
                        continue;
                    }
                    RoomTitleEntity roomTitle = roomTitleById.get(pair.roomTitleId());
                    TitleEntity watchlistTitle = watchlistById.get(pair.titleId());
                    if (roomTitle == null || watchlistTitle == null) {
                        continue;
                    }

                    validated.add(SuggestedTitleLinkDto.builder()
                            .roomTitle(roomTitleShortMapper.mapTo(roomTitle))
                            .title(titleShortMapper.mapTo(watchlistTitle))
                            .confidence(pair.confidence() != null ? pair.confidence() : "medium")
                            .build());
                    usedRoomTitleIds.add(pair.roomTitleId());
                    usedTitleIds.add(pair.titleId());
                }
            }

            return validated;
        } catch (TitleLinkSuggestionAiErrorException e) {
            throw e;
        } catch (Exception e) {
            throw new TitleLinkSuggestionAiErrorException("Failed to get title link suggestions from AI: " + e.getMessage());
        }
    }

    private Map<String, Object> toPayload(Object title) {
        Map<String, Object> payload = new HashMap<>();
        if (title instanceof RoomTitleEntity rt) {
            payload.put("id", rt.getId().toString());
            payload.put("name", rt.getTitleName());
            payload.put("type", rt.getTitleType().name());
            if (rt.getApiTitleId() != null) payload.put("apiTitleId", rt.getApiTitleId());
        } else if (title instanceof TitleEntity t) {
            payload.put("id", t.getTitleId());
            payload.put("name", t.getTitleName());
            payload.put("type", t.getTitleType().name());
            if (t.getApiTitleId() != null) payload.put("apiTitleId", t.getApiTitleId());
        }
        return payload;
    }

    private List<AiSuggestedPair> parseAiResponse(String responseText) {
        String json = responseText
                .replaceAll("(?s)```json\\s*", "")
                .replaceAll("(?s)```\\s*", "")
                .trim();

        try {
            return objectMapper.readValue(json, new TypeReference<List<AiSuggestedPair>>() {});
        } catch (Exception e) {
            throw new TitleLinkSuggestionAiErrorException("Failed to parse AI response as JSON: " + e.getMessage());
        }
    }

    private record AiSuggestedPair(UUID roomTitleId, Long titleId, String confidence) {}
}