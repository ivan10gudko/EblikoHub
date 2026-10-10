package project_z.demo.services.impl;

import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import lombok.RequiredArgsConstructor;
import project_z.demo.common.Exceptions.TranslationAiErrorException;
import project_z.demo.config.MyConfig;
import project_z.demo.enums.translation.TranslationTarget;
import project_z.demo.services.GoogleAiClient;
import project_z.demo.services.TranslationService;

@Service
@RequiredArgsConstructor
public class TranslationServiceImpl implements TranslationService {
    private static final String huggingFaceApiUrl = "https://router.huggingface.co/v1/chat/completions";
    private final RestTemplate restTemplate = new RestTemplate();
    private final MyConfig myConfig;
    private final GoogleAiClient googleAiClient;

    private static final Map<TranslationTarget, String> DEEPSEEK_PROMPTS = Map.of(
            TranslationTarget.ANIME_TITLE, """
                    IMPORTANT: RETURN ONLY THE OFFICIAL ENGLISH ANIME TITLE.
                    START YOUR ANSWER WITH "RESULT: " FOLLOWED BY THE TITLE.
                    DO NOT INCLUDE ANY EXPLANATIONS, REASONING, COMMENTS, OR <think> TAGS.
                    
                    You are a Japanese anime expert and translator.
                    The user will give you the title of an anime in any language, including Japanese, romaji, or kanji.
                    Your task is to return ONLY the official English title used internationally.
                    
                    Example:
                    Input: "ВанПіс"
                    RESULT: One Piece
                    """,
            TranslationTarget.CHARACTER_NAME, """
                    IMPORTANT: RETURN ONLY THE ENGLISH/ROMAJI NAME OF THE ANIME CHARACTER.
                    START YOUR ANSWER WITH "RESULT: " FOLLOWED BY THE NAME.
                    DO NOT INCLUDE ANY EXPLANATIONS, REASONING, COMMENTS, OR <think> TAGS.
                    
                    You are an anime character expert and translator.
                    The user will give you the name of an anime character in any language.
                    Your task is to return ONLY the standard English/Romaji name.
                    
                    Example:
                    Input: "Лелуш Ламперуж"
                    RESULT: Lelouch Lamperouge
                    """
    );

    private static final Map<TranslationTarget, String> GEMINI_PROMPTS = Map.of(
            TranslationTarget.ANIME_TITLE, """
                    IMPORTANT: RETURN ONLY THE OFFICIAL ENGLISH ANIME TITLE.
                    START YOUR ANSWER WITH "RESULT: " FOLLOWED BY THE TITLE.
                    DO NOT INCLUDE ANY EXPLANATIONS, REASONING, COMMENTS, OR <think> TAGS.
                    
                    You are a Japanese anime expert and translator.
                    The user will give you the title of an anime in any language.
                    Your task is to return ONLY the official English title.
                    """,
            TranslationTarget.CHARACTER_NAME, """
                    IMPORTANT: RETURN ONLY THE ENGLISH/ROMAJI NAME OF THE ANIME CHARACTER.
                    START YOUR ANSWER WITH "RESULT: " FOLLOWED BY THE NAME.
                    DO NOT INCLUDE ANY EXPLANATIONS, REASONING, COMMENTS, OR <think> TAGS.
                    
                    You are an anime character expert and translator.
                    The user will give you the name of an anime character in any language.
                    Your task is to return ONLY the standard English/Romaji name.
                    """
    );

    @Override
    public String translateToEnglishWithDeepSeek(String text) {
        return translateWithDeepSeek(text, TranslationTarget.ANIME_TITLE);
    }
    @Override
    public String translateCharacterWithDeepSeek(String text) {
        return translateWithDeepSeek(text, TranslationTarget.CHARACTER_NAME);
    }

    private String translateWithDeepSeek(String text, TranslationTarget target) {
        String systemPrompt = DEEPSEEK_PROMPTS.getOrDefault(target, DEEPSEEK_PROMPTS.get(TranslationTarget.ANIME_TITLE));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(myConfig.getHugfaceToken());

        Map<String, Object> body = Map.of(
                "model", "deepseek-ai/DeepSeek-R1",
                "messages", List.of(
                        Map.of("role", "system", "content", systemPrompt),
                        Map.of("role", "user", "content", text)));

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(huggingFaceApiUrl, request, Map.class);

            if (response.getBody() != null) {
                List<?> choices = (List<?>) response.getBody().get("choices");
                if (choices != null && !choices.isEmpty()) {
                    Map<?, ?> firstChoice = (Map<?, ?>) choices.get(0);
                    Map<?, ?> message = (Map<?, ?>) firstChoice.get("message");
                    String content = message.get("content").toString();

                    String cleanContent = content.replaceAll("(?s)<think>.*?</think>", "").trim();
                    System.out.println(cleanContent);
                    return parseResult(cleanContent, text);
                }
            }
        } catch (HttpClientErrorException e) {
            throw e;
        } catch (Exception e) {
            e.printStackTrace();
        }

        return text;
    }

    @Override
    public String translateToEnglistWithGoogleAI(String text) {
        return translateWithGoogleAI(text, TranslationTarget.ANIME_TITLE);
    }
    @Override
    public String translateCharacterWithGoogleAI(String text) {
        return translateWithGoogleAI(text, TranslationTarget.CHARACTER_NAME);
    }

    private String translateWithGoogleAI(String text, TranslationTarget target) {
        String systemPrompt = GEMINI_PROMPTS.getOrDefault(target, GEMINI_PROMPTS.get(TranslationTarget.ANIME_TITLE));

        try {
            String responseText = googleAiClient.generateContent(
                    myConfig.getGoogleApiKey(),
                    systemPrompt + "\nInput: " + text);

            System.out.println("AI Response: " + responseText);
            return parseResult(responseText, text);

        } catch (HttpClientErrorException.TooManyRequests e) {
            System.err.println("Google API Rate limit exceeded: " + e.getResponseBodyAsString());
            throw e;
        } catch (Exception e) {
            System.err.println("Google API Error: " + e.getMessage());
            throw new TranslationAiErrorException("Gemini is unavailable");
        }
    }

    private String parseResult(String responseContent, String fallbackText) {
        Pattern p = Pattern.compile("RESULT:\\s*(.*)", Pattern.CASE_INSENSITIVE);
        Matcher m = p.matcher(responseContent);

        if (m.find()) {
            return m.group(1).trim().replace("\"", "").replace("}", "");
        }

        return responseContent.replace("RESULT:", "").trim();
    }
}