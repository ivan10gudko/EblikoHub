package project_z.demo.config;
import org.springframework.stereotype.Component;

import lombok.Getter;

@Component
@Getter
public class MyConfig {

    @org.springframework.beans.factory.annotation.Value("${app.api.jwk-url}")
    private String jwkUrl;
    @org.springframework.beans.factory.annotation.Value("${app.api.hugface-token}")
    private String hugfaceToken;
}