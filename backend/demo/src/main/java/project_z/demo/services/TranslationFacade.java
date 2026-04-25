package project_z.demo.services;

import org.springframework.stereotype.Service;

@Service
public interface TranslationFacade {
    String translateToEnglish(String rawTitle);
}
