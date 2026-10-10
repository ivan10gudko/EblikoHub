package project_z.demo.config;

import org.openapitools.jackson.nullable.JsonNullableModule;
import org.springframework.boot.autoconfigure.jackson.Jackson2ObjectMapperBuilderCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.PropertyAccessor;
import com.fasterxml.jackson.databind.Module;

@Configuration
public class JacksonConfig {
    @Bean
    public Module jsonNullableModule() {
        return new JsonNullableModule();
    }

    // @Bean
    // public Jackson2ObjectMapperBuilderCustomizer jsonCustomizer() {
    //     return builder -> {
    //         builder.failOnUnknownProperties(false);
    //         builder.visibility(PropertyAccessor.FIELD, JsonAutoDetect.Visibility.ANY);
    //         builder.visibility(PropertyAccessor.GETTER, JsonAutoDetect.Visibility.NONE);
    //         builder.visibility(PropertyAccessor.IS_GETTER, JsonAutoDetect.Visibility.NONE);
    //         builder.visibility(PropertyAccessor.SETTER, JsonAutoDetect.Visibility.NONE);
    //     };
    // }
}