package project_z.demo.services;

import org.springframework.stereotype.Service;

@Service
public interface TranslationFacade {
    String translateAnimeTitle(String rawTitle);

    String translateCharacterName(String rawName);
}
