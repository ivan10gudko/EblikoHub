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
import project_z.demo.dto.TitleDtos.TitleVisualDto;
import project_z.demo.entity.RoomTitleEntity;
import project_z.demo.entity.TitleEntity;
import project_z.demo.services.GoogleAiClient;
import project_z.demo.services.TitleMatchingEngine;

@Service
@RequiredArgsConstructor
public class UniqueTitleSuggestionEngineImpl implements TitleMatchingEngine<TitleVisualDto> {

    private static final String UNIQUE_TITLES_PROMPT = """
            You are an expert at comparing anime/movie/TV titles across languages and variations.
            
            You receive two JSON arrays of UNLINKED items:
            - roomTitles: titles already present in a shared room (not linked to this user)
            - watchlistTitles: user's personal watchlist titles
            
            Task: Identify and FILTER OUT any watchlist titles that have a matching counterpart (the same work, alternative spelling, translation, or related season/part) anywhere in the roomTitles list.
            Return ONLY the watchlist titles that DO NOT have any match or equivalent in the roomTitles.
            
            Rules:
            - Return ONLY a valid JSON array of numbers (the `titleId`s of the watchlist items that have NO matches in the room), no markdown, no explanation.
            - If a watchlist title matches or refers to the same work as any roomTitle, EXCLUDE it.
            - Keep only truly unique watchlist titles that have no equivalent in the room.
            
            Output format:
            [123, 456, 789]
            """;

    private final GoogleAiClient googleAiClient;
    private final MyConfig myConfig;
    private final ObjectMapper objectMapper;
    private final Mapper<TitleEntity, TitleVisualDto> titleVisualMapper;

    @Override
    public List<TitleVisualDto> suggest(List<RoomTitleEntity> unlinkedRoomTitles,
                                       List<TitleEntity> unlinkedWatchlistTitles) {

        Set<Long> matchedByApiIds = new HashSet<>();
        Map<Long, RoomTitleEntity> roomTitlesByApiId = new HashMap<>();

        for (RoomTitleEntity rt : unlinkedRoomTitles) {
            if (rt.getApiTitleId() != null) {
                roomTitlesByApiId.put(rt.getApiTitleId(), rt);
            }
        }

        List<TitleEntity> remainingWatchlist = new ArrayList<>();
        for (TitleEntity title : unlinkedWatchlistTitles) {
            if (title.getApiTitleId() != null && roomTitlesByApiId.containsKey(title.getApiTitleId().longValue())) {
                matchedByApiIds.add(title.getTitleId());
            } else {
                remainingWatchlist.add(title);
            }
        }

        List<TitleEntity> trulyUniqueTitles = new ArrayList<>();

        if (!unlinkedRoomTitles.isEmpty() && !remainingWatchlist.isEmpty()) {
            List<Long> aiFilteredIds = fetchAiFilteredIds(unlinkedRoomTitles, remainingWatchlist);
            Set<Long> allowedIds = new HashSet<>(aiFilteredIds);

            for (TitleEntity title : remainingWatchlist) {
                if (allowedIds.contains(title.getTitleId())) {
                    trulyUniqueTitles.add(title);
                }
            }
        } else {
            trulyUniqueTitles.addAll(remainingWatchlist);
        }

        return trulyUniqueTitles.stream()
                .map(titleVisualMapper::mapTo)
                .toList();
    }

    private List<Long> fetchAiFilteredIds(List<RoomTitleEntity> roomTitles, List<TitleEntity> watchlistTitles) {
        try {
            List<Map<String, Object>> roomPayload = roomTitles.stream().map(TitleMatchingHelper::toPayload).toList();
            List<Map<String, Object>> watchlistPayload = watchlistTitles.stream().map(TitleMatchingHelper::toPayload).toList();

            Map<String, Object> input = Map.of(
                    "roomTitles", roomPayload,
                    "watchlistTitles", watchlistPayload);

            String userMessage = objectMapper.writeValueAsString(input);
            String responseText = googleAiClient.generateContent(
                    myConfig.getGoogleTitleLinksApiKey(),
                    UNIQUE_TITLES_PROMPT + "\n\nInput:\n" + userMessage);

            String json = responseText
                    .replaceAll("(?s)```json\\s*", "")
                    .replaceAll("(?s)```\\s*", "")
                    .trim();

            return objectMapper.readValue(json, new com.fasterxml.jackson.core.type.TypeReference<List<Long>>() {
            });

        } catch (Exception e) {
            throw new TitleLinkSuggestionAiErrorException(
                    "Failed to get unique title suggestions from AI: " + e.getMessage());
        }
    }
}