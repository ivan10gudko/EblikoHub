package project_z.demo.security;

import java.security.Key;
import java.util.UUID;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
public interface  JwtService {
    String generateToken(UserDetails user);
    boolean validateToken(String token);
    UUID extractUsername(String token);
    Key getSigningKey(String token);
    String extractRole(UUID userId);
}
