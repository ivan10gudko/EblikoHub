package project_z.demo.services;

import org.springframework.stereotype.Service;
import project_z.demo.enums.translation.TranslationTarget;

@Service

    public interface TranslationService {
        String translateToEnglishWithDeepSeek(String text);

        String translateCharacterWithDeepSeek(String text);

        String translateToEnglistWithGoogleAI(String text);

        String translateCharacterWithGoogleAI(String text);
    }

