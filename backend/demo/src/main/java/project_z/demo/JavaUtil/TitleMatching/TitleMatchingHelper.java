package project_z.demo.JavaUtil.TitleMatching;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import project_z.demo.common.Exceptions.TitleLinkSuggestionAiErrorException;
import project_z.demo.entity.RoomTitleEntity;
import project_z.demo.entity.TitleEntity;

public class TitleMatchingHelper {

    public static Map<String, Object> toPayload(Object title) {
        Map<String, Object> payload = new HashMap<>();
        if (title instanceof RoomTitleEntity rt) {
            payload.put("id", rt.getId().toString());
            payload.put("name", rt.getTitleName());
            payload.put("type", rt.getTitleType().name());
            if (rt.getApiTitleId() != null)
                payload.put("apiTitleId", rt.getApiTitleId());
        } else if (title instanceof TitleEntity t) {
            payload.put("id", t.getTitleId());
            payload.put("name", t.getTitleName());
            payload.put("type", t.getTitleType().name());
            if (t.getApiTitleId() != null)
                payload.put("apiTitleId", t.getApiTitleId());
        }
        return payload;
    }

    public static java.util.List<AiSuggestedPair> parseAiResponse(String responseText, ObjectMapper objectMapper) {
        String json = responseText
                .replaceAll("(?s)```json\\s*", "")
                .replaceAll("(?s)```\\s*", "")
                .trim();

        try {
            return objectMapper.readValue(json, new TypeReference<java.util.List<AiSuggestedPair>>() {
            });
        } catch (Exception e) {
            throw new TitleLinkSuggestionAiErrorException("Failed to parse AI response as JSON: " + e.getMessage());
        }
    }

    public record AiSuggestedPair(UUID roomTitleId, Long titleId, String confidence) {
    }
}