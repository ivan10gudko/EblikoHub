package project_z.demo.services;

import org.springframework.stereotype.Service;

@Service
public interface TranslationService {
String translateToEnglishWithDeepSeek (String text);
String translateToEnglistWithGoogleAI(String text);
}
