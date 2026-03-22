package project_z.demo.config;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import lombok.Getter;

@Component
@Getter
public class MyConfig {

    @Value("${app.api.jwk-url}")
    private String jwkUrl;
    @Value("${app.api.hugface-token}")
    private String hugfaceToken;
    @Value("${app.api.supabase-service-role}")
    private String supabaseServiceRole;
}