package project_z.demo.dto.TitleDtos;

import java.util.UUID;

public record TargetTitleContext(
    Long currentId,
    String category,
    Float currentRating,
    String titleType,
    UUID userId
) {}