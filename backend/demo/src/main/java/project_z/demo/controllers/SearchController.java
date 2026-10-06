package project_z.demo.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import project_z.demo.common.pagination.externalApi.ExternalApiPageResponse;
import project_z.demo.dto.CharacterDtos.CharacterExternalApiDto;
import project_z.demo.services.SearchService;
import project_z.demo.services.TranslationFacade;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "/api/v1/search")
public class SearchController {

    private final TranslationFacade translationFacade;
    private final SearchService<String> titleSearchService;
    private final SearchService<ExternalApiPageResponse<CharacterExternalApiDto>> characterSearchService;

    @GetMapping
    public String Search(@RequestParam("q") String text, @RequestParam("page") int page) {
        String translatedService = translationFacade.translateAnimeTitle(text);
        String response = titleSearchService.search(translatedService, page);
        return response;
    }

    @GetMapping(path = "/characters")
    public ExternalApiPageResponse<CharacterExternalApiDto> searchCharacters(
            @RequestParam("q") String text,
            @RequestParam("page") int page
    ) {
        String translatedQuery = translationFacade.translateCharacterName(text);
        return characterSearchService.search(translatedQuery, page);
    }
}
