package project_z.demo.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import project_z.demo.services.TitleSearchService;
import project_z.demo.services.TranslationService;

@RestController
@RequiredArgsConstructor
public class SearchController {
    
    private final TranslationService translationService;
    private final TitleSearchService titleSearchService;

  /*   @GetMapping(path = "/Search")
    public String TestTransaltion (@RequestParam("q") String text) {
        String translatedService = translationService.translateToEnglish(text);
        return translatedService;
    }
        */
    @GetMapping(path = "/api/v1/search")
    public String Search(@RequestParam("q") String text, @RequestParam("page") int page) {
            String translatedService = translationService.translateToEnglish(text);
            String response = titleSearchService.searchTitle(translatedService, page);
            return response;
    }
}
