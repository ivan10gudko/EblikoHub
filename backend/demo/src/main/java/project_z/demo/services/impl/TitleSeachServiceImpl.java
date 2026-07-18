package project_z.demo.services.impl;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import lombok.RequiredArgsConstructor;
import project_z.demo.config.MyConfig;
import project_z.demo.services.TitleSearchService;

@Service
@RequiredArgsConstructor
public class TitleSeachServiceImpl implements TitleSearchService {
  private final MyConfig myConfig;
  private final RestTemplate restTemplate = new RestTemplate();

  @Override
  public String searchTitle(String text, int page){
    String apiBaseUrl = myConfig.getAnimeApiBaseUrl();

    String encodedText = URLEncoder.encode(text, StandardCharsets.UTF_8);
    String url = apiBaseUrl + "/anime?q=" + encodedText + "&limit=24" + "&page=" + page;

    return restTemplate.getForObject(url, String.class);
  }
}
