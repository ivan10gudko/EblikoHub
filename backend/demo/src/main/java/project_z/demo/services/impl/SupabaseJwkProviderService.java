package project_z.demo.services.impl;

import java.net.HttpURLConnection;
import java.net.URL;
import java.security.PublicKey;
import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import project_z.demo.config.MyConfig;

@Service
@RequiredArgsConstructor
public class SupabaseJwkProviderService {

    private final KeyDecodeService keyDecode;
    private final MyConfig myConfig;
    private final Map<String, PublicKey> cachedKeys = new HashMap<>();

    private JsonNode fetchJwksJson() {
        try {
            String jwkUrl = myConfig.getJwkUrl();
            URL url = new URL(jwkUrl);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");

            String json = new String(conn.getInputStream().readAllBytes());
            return new ObjectMapper().readTree(json);
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch JWKs from Supabase", e);
        }
    }

    private String extractKidFromToken(String token) {
          try {
        if (token.startsWith("Bearer ")) token = token.substring(7);

        // JWT має формат header.payload.signature
        String[] parts = token.split("\\.");
        if (parts.length != 3) throw new RuntimeException("Invalid JWT format");

        String headerJson = new String(io.jsonwebtoken.io.Decoders.BASE64URL.decode(parts[0]));
        com.fasterxml.jackson.databind.JsonNode headerNode = new com.fasterxml.jackson.databind.ObjectMapper().readTree(headerJson);
        String kid = headerNode.get("kid").asText();


        return kid;

    } catch (Exception e) {
        throw new RuntimeException("Failed to extract kid from token", e);
    }
    }

    public PublicKey fetchPublicKeyForToken(String token) {
        try {
            String kid = extractKidFromToken(token);

            // Перевіряємо кеш
            if (cachedKeys.containsKey(kid)) {
                return cachedKeys.get(kid);
            }

            // Fetch JWKS і шукаємо ключ по kid
            JsonNode jwks = fetchJwksJson();
            for (JsonNode key : jwks.get("keys")) {
                if (key.get("kid").asText().equals(kid)) {
                    PublicKey pubKey = keyDecode.loadEcPublicKeyFromJwk(key.toString());
                    cachedKeys.put(kid, pubKey);
                    return pubKey;
                }
            }
            throw new RuntimeException("No matching JWK found for kid: " + kid);

        } catch (Exception e) {
            throw new RuntimeException("Failed to get public key for token", e);
        }
    }
}
