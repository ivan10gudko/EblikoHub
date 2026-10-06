package project_z.demo.services.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import project_z.demo.Mappers.Mapper;
import project_z.demo.common.pagination.externalApi.ExternalApiPageResponse;
import project_z.demo.common.pagination.externalRawApi.ExternalApiRawResponse;
import project_z.demo.config.MyConfig;
import project_z.demo.dto.CharacterDtos.CharacterExternalApiDto;
import project_z.demo.dto.CharacterDtos.externalApiRaw.ExternalApiCharacterRawDto;
import project_z.demo.services.SearchService;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Service
@RequiredArgsConstructor
public class CharacterSearchServiceImpl implements SearchService<ExternalApiPageResponse<CharacterExternalApiDto>> {

    private final MyConfig myConfig;
    private final RestTemplate restTemplate = new RestTemplate();
    private final Mapper<ExternalApiRawResponse<ExternalApiCharacterRawDto>, ExternalApiPageResponse<CharacterExternalApiDto>> characterMapper;

    @Override
    public ExternalApiPageResponse<CharacterExternalApiDto> search(String text, int page) {
        String apiBaseUrl = myConfig.getAnimeApiBaseUrl();

        String encodedText = URLEncoder.encode(text, StandardCharsets.UTF_8);
        String url = apiBaseUrl + "/characters?q=" + encodedText + "&limit=24&page=" + page;

        ResponseEntity<ExternalApiRawResponse<ExternalApiCharacterRawDto>> responseEntity =
                restTemplate.exchange(
                        url,
                        HttpMethod.GET,
                        null,
                        new ParameterizedTypeReference<>() {
                        }
                );

        ExternalApiRawResponse<ExternalApiCharacterRawDto> rawResponse = responseEntity.getBody();

        return characterMapper.mapTo(rawResponse);
    }
}