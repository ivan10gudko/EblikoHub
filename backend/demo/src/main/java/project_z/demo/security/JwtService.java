package project_z.demo.security;

import java.security.Key;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
public interface  JwtService {
    String generateToken(UserDetails user);
    boolean validateToken(String token);
    String extractUsername(String token);
    Key getSigningKey(String token);
    String extractRole(String token);
}
