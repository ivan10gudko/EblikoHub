package project_z.demo.services.impl;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import lombok.RequiredArgsConstructor;
import project_z.demo.common.Exceptions.GoogleAiException;
import project_z.demo.config.MyConfig;
import project_z.demo.services.GoogleAiClient;

@Service
@RequiredArgsConstructor
public class GoogleAiClientImpl implements GoogleAiClient {

    private final MyConfig myConfig;
    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public String generateContent(String apiKey, String prompt) {
        String apiUrl = myConfig.getGoogleApiUrl();
        String urlWithKey = apiUrl + "?key=" + apiKey;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                        Map.of("parts", List.of(
                                Map.of("text", prompt)))));

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(urlWithKey, request, Map.class);
            if (response.getBody() == null) {
                throw new GoogleAiException("Empty response from Google AI");
            }

            List<?> candidates = (List<?>) response.getBody().get("candidates");
            if (candidates == null || candidates.isEmpty()) {
                throw new GoogleAiException("Empty or invalid response structure from Google AI");
            }

            Map<?, ?> firstCandidate = (Map<?, ?>) candidates.get(0);
            Map<?, ?> content = (Map<?, ?>) firstCandidate.get("content");
            List<?> parts = (List<?>) content.get("parts");
            Map<?, ?> firstPart = (Map<?, ?>) parts.get(0);

            return firstPart.get("text").toString().trim();
        } catch (HttpClientErrorException.TooManyRequests e) {
            throw e; // Bubble up for specific exception handling (e.g. rate limits)
        } catch (HttpClientErrorException e) {
            throw e; // Bubble up HTTP client errors
        } catch (Exception e) {
            throw new GoogleAiException("Google AI is unavailable: " + e.getMessage(), e);
        }
    }
}
