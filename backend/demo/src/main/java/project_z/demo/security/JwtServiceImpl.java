package project_z.demo.security;

import java.security.Key;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import lombok.RequiredArgsConstructor;
import project_z.demo.services.impl.KeyDecodeService;
import project_z.demo.services.impl.SupabaseJwkProviderService;

@Service
@RequiredArgsConstructor
public class JwtServiceImpl implements JwtService {


    private final KeyDecodeService keyDecode;
    private final SupabaseJwkProviderService supabaseJwkProvider;


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
public String extractUsername(String token) {
    return extractAllClaims(token).getSubject(); 
}

@Override
public String extractRole(String token) {
    return extractAllClaims(token).get("role", String.class);
}

    @Override
    public Key getSigningKey(String token) {
    return supabaseJwkProvider.fetchPublicKeyForToken(token);
}
}
