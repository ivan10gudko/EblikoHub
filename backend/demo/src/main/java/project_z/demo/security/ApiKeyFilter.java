package project_z.demo.security;

import java.io.IOException;

import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import project_z.demo.config.MyConfig;
@Component
public class ApiKeyFilter extends OncePerRequestFilter{

    private MyConfig myConfig;
    public ApiKeyFilter(MyConfig myConfig){
        this.myConfig = myConfig;
    }
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        String path = request.getRequestURI();

        if (path.contains("/v3/api-docs") || 
            path.contains("/swagger-ui") || 
            path.contains("/openapi.json")) {
        
                filterChain.doFilter(request, response);
            return;
        }

        boolean isEnabled = myConfig.isApiKeyEnabled();

        if (!isEnabled) {
            filterChain.doFilter(request, response);
            return;
        }
        
        String apiKeyValue = myConfig.getApiKeyValue();
        String requestKey = request.getHeader("X-API-KEY");

        if (apiKeyValue.equals(requestKey)) {
            filterChain.doFilter(request, response);
        } else {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Invalid or missing API Key");
        }
    }
}
