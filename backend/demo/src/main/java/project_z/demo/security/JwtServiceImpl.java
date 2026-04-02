package project_z.demo.security;

import java.security.Key;
import java.util.UUID;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import lombok.RequiredArgsConstructor;
import project_z.demo.entity.UserEntity;
import project_z.demo.services.UserService;
import project_z.demo.services.impl.KeyDecodeService;
import project_z.demo.services.impl.SupabaseJwkProviderService;

@Service
@RequiredArgsConstructor
public class JwtServiceImpl implements JwtService {


    private final KeyDecodeService keyDecode;
    private final SupabaseJwkProviderService supabaseJwkProvider;
    private final UserService userService;

    @Override
    public String generateToken(UserDetails user) {
        throw new UnsupportedOperationException("Token generation handled by Supabase");
    }

    @Override
public boolean validateToken(String token) {
    try {
        if (token.startsWith("Bearer ")) token = token.substring(7);

        Jwts.parserBuilder()
            .setSigningKey(supabaseJwkProvider.fetchPublicKeyForToken(token))
            .build()
            .parseClaimsJws(token);

        return true;
    } catch (Exception e) {
        e.printStackTrace();
        return false;
    }
}
private Claims extractAllClaims(String token){
    if (token.startsWith("Bearer ")) {
        token = token.substring(7);
    }
    return Jwts.parserBuilder()
            .setSigningKey(supabaseJwkProvider.fetchPublicKeyForToken(token))
            .build()
            .parseClaimsJws(token)
            .getBody();
}
@Override
public UUID extractUsername(String token) {
    String pureJwt = (token.startsWith("Bearer ")) ? token.substring(7) : token;
    
    String subject = extractAllClaims(pureJwt).getSubject();
    return UUID.fromString(subject); 
}

@Override
public String extractRole(UUID userId) {
    UserEntity userEnity = userService.findOne(userId);
    return userEnity.getRole().toString();
}

    @Override
    public Key getSigningKey(String token) {
    return supabaseJwkProvider.fetchPublicKeyForToken(token);
}
}
