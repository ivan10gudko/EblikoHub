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
import org.springframework.web.client.RestTemplate;

import project_z.demo.services.TranslationService;

@Service
public class TranslationServiceImpl implements TranslationService {
    private static final String huggingFaceApiUrl =  "https://router.huggingface.co/v1/chat/completions";
    private final RestTemplate restTemplate = new RestTemplate();
    private static String huggingFaceApiAccesToken =System.getenv("HUGFACE_TOKEN");
    @Override
    
    public String translateToEnglish(String text){
        
         String systemPrompt = """
       IMPORTANT: RETURN ONLY THE OFFICIAL ENGLISH ANIME TITLE. 
START YOUR ANSWER WITH "RESULT: " FOLLOWED BY THE TITLE. 
DO NOT INCLUDE ANY EXPLANATIONS, REASONING, COMMENTS, OR <think> TAGS.

You are a Japanese anime expert and translator.
The user will give you the title of an anime in any language, including Japanese, romaji, or kanji.
Your task is to return ONLY the official English title used internationally.

Example:
Input: "ВанПіс"
    """;

    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    headers.setBearerAuth(huggingFaceApiAccesToken);

    Map<String, Object> body = Map.of(
        "model", "deepseek-ai/DeepSeek-R1",
        "messages", List.of(
            Map.of("role", "system", "content", systemPrompt),
            Map.of("role", "user", "content", text)
        )
    );

    HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

    try {
        ResponseEntity<Map> response =
            restTemplate.postForEntity(huggingFaceApiUrl, request, Map.class);
        System.out.println(response);
        if (response.getBody() != null) {
            List<?> choices = (List<?>) response.getBody().get("choices");
            if (choices != null && !choices.isEmpty()) {
                Map<?, ?> firstChoice = (Map<?, ?>) choices.get(0);
                Map<?, ?> message = (Map<?, ?>) firstChoice.get("message");
                String content = message.get("content").toString();

                Pattern p = Pattern.compile("RESULT:\\s*(.*)");
                Matcher m = p.matcher(content);
                if (m.find()) {
                    String animeTitle = m.group(1).trim(); 
                    return animeTitle;
}
            }
        }

    } catch (Exception e) {
        e.printStackTrace();
    }

    return text;
}
}
        /*String apiKey = "5539d20c91424a044d5f";
        String url  = "http://localhost:5000/translate";
               Map<String, String> requestBody  =  Map.of(
                 "q", text,
                 "source", "auto",
                 "target", "en",
                 "format", "text"
            );
         
        try {
            Map response = restTemplate.postForObject(url, requestBody, Map.class);
            if(response != null && response.containsKey("translatedText")){
                System.out.println(response.get("translatedText"));
                return (String) response.get("translatedText");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        System.out.println("xuy");
        return text;
    }*/
        

    

