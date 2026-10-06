package project_z.demo.Mappers.impl.CharacterMappers;

import org.springframework.stereotype.Component;
import project_z.demo.Mappers.Mapper;
import project_z.demo.common.pagination.externalApi.ExternalApiPageResponse;
import project_z.demo.common.pagination.externalApi.ExternalApiPagination;
import project_z.demo.common.pagination.externalRawApi.ExternalApiRawResponse;
import project_z.demo.dto.CharacterDtos.CharacterExternalApiDto;
import project_z.demo.dto.CharacterDtos.externalApiRaw.ExternalApiCharacterRawDto;

import java.util.List;
@Component
public class ExternalApiCharacterPageMapperImpl
        implements Mapper<ExternalApiRawResponse<ExternalApiCharacterRawDto>, ExternalApiPageResponse<CharacterExternalApiDto>> {
    @Override
    public ExternalApiPageResponse<CharacterExternalApiDto> mapTo(ExternalApiRawResponse<ExternalApiCharacterRawDto> rawResponse) {
        if (rawResponse == null || rawResponse.data() == null) {
            return new ExternalApiPageResponse<>(List.of(), new ExternalApiPagination(0, false, 0));
        }

        List<CharacterExternalApiDto> characterDtos = rawResponse.data().stream()
                .map(raw -> new CharacterExternalApiDto(
                        raw.malId(),
                        raw.name(),
                        raw.images() != null && raw.images().webp() != null
                                ? raw.images().webp().imageUrl()
                                : null
                ))
                .toList();

        var rawPagination = rawResponse.pagination();
        ExternalApiPagination paginationDto = new ExternalApiPagination(
                rawPagination != null ? rawPagination.currentPage() : 0,
                rawPagination != null && rawPagination.hasNextPage(),
                rawPagination != null ? rawPagination.lastVisiblePage() : 0
        );

        return new ExternalApiPageResponse<>(characterDtos, paginationDto);
    }

    @Override
    public ExternalApiRawResponse<ExternalApiCharacterRawDto> mapFrom(ExternalApiPageResponse<CharacterExternalApiDto> externalApiPageResponse) {
        throw new UnsupportedOperationException(
                "this mapping is not supported.");
    }
}