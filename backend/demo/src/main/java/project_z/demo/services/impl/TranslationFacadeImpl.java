package project_z.demo.services.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import project_z.demo.services.TranslationFacade;
import project_z.demo.services.TranslationService;

@Service
@RequiredArgsConstructor
public class TranslationFacadeImpl implements TranslationFacade {
    private final TranslationService translationService;

    @Override
    public String translateAnimeTitle(String rawTitle) {
        try {
            return translationService.translateToEnglistWithGoogleAI(rawTitle);
        } catch (Exception e) {
            System.out.println("Gemini failed, falling back to DeepSeek...");
            return translationService.translateToEnglishWithDeepSeek(rawTitle);
        }
    }

    @Override
    public String translateCharacterName(String rawName) {
        try {
            return translationService.translateCharacterWithGoogleAI(rawName);
        } catch (Exception e) {
            System.out.println("Gemini failed for character, falling back to DeepSeek...");
            return translationService.translateCharacterWithDeepSeek(rawName);
        }
    }
}
