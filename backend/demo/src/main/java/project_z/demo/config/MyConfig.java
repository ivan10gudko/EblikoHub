package project_z.demo.config;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Value;
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
    @Value("${app.security.api-key.enabled}")
    private boolean isApiKeyEnabled;
    @Value("${app.security.api-key.value}")
    private String apiKeyValue;
}