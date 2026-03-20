package project_z.demo.security;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    
    private final JwtService jwtService;
    
    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                  HttpServletResponse response,
                                  FilterChain filterChain) throws ServletException, IOException {
        
    String authHeader = request.getHeader("Authorization");

    if (authHeader == null || !authHeader.startsWith("Bearer ")) {
        filterChain.doFilter(request, response);
        return;
    }


    if (jwtService.validateToken(authHeader)) {
        UUID userId = jwtService.extractUsername(authHeader); 
        String roleFromToken = jwtService.extractRole(userId);

        UsernamePasswordAuthenticationToken auth = 
            new UsernamePasswordAuthenticationToken(userId, null, 
                List.of(new SimpleGrantedAuthority("ROLE_" + roleFromToken)));
            
        SecurityContextHolder.getContext().setAuthentication(auth);
    }

    filterChain.doFilter(request, response);
    }
}