package project_z.demo.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final ApiKeyFilter apiKeyFilter;
    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter, ApiKeyFilter apiKeyFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.apiKeyFilter = apiKeyFilter;
    }
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception{
        http
            
            .authorizeHttpRequests(auth -> auth
            .requestMatchers("/error").permitAll()
            .requestMatchers(HttpMethod.GET, "/api/v1/search").permitAll()
            .requestMatchers("/swagger-ui.html", "/swagger-ui/**", "/v3/api-docs/**").permitAll()
            .requestMatchers("/api/v1/auth/**").permitAll()
            .requestMatchers("/api/v1/users/*/checkNameTag").permitAll()
            .requestMatchers(HttpMethod.POST, "/api/v1/users").permitAll()
            .requestMatchers("/openapi/*").permitAll()
            .anyRequest().authenticated() 
        ).csrf(csrf -> csrf.disable()) 
        .sessionManagement(session -> 
            session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .addFilterBefore(apiKeyFilter, UsernamePasswordAuthenticationFilter.class)
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
           
        return http.build();
    }
}