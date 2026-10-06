package project_z.demo.dto.CharacterDtos.externalApiRaw;

import com.fasterxml.jackson.annotation.JsonProperty;

public record ExternalApiCharacterRawDto(
        @JsonProperty("mal_id") Long malId,
        String name,
        ImagesDto images
) {
    public record ImagesDto(
            JpgWebpDto webp
    ) {
    }

    public record JpgWebpDto(
            @JsonProperty("image_url") String imageUrl
    ) {
    }
}