package project_z.demo.services.impl;

import org.springframework.stereotype.Service;

import project_z.demo.services.TranslationFacade;
import project_z.demo.services.TranslationService;

@Service
public class TranslationFacadeImpl implements TranslationFacade {
    private final TranslationService translationService;

    public TranslationFacadeImpl(TranslationService translationService) {
        this.translationService = translationService;
    }

    @Override
    public String translateToEnglish(String rawTitle) {
        try {
            return translationService.translateToEnglishWithDeepSeek(rawTitle);
        } catch (Exception e) {
            System.out.println("DeepSeek failed, falling back to Gemini...");
            return translationService.translateToEnglistWithGoogleAI(rawTitle);
        }
    }

}
